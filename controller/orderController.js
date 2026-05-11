import mongoose from "mongoose";
import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getTickets = async (req, res) => {
  try {
    const myTickets = await Order.find({ user: req.user._id })
      .populate("user")
      .populate("event");

    if (!myTickets) {
      res.status(404);
      throw new Error("Tickets Not Found!");
    }

    // Filter out tickets where the event might have been deleted
    const validTickets = myTickets.filter((ticket) => ticket.event !== null);

    res.status(200).json({
      success: true,
      tickets: validTickets,
    });
  } catch (error) {
    console.error("Error in getTickets:", error);
    res.status(500);
    throw new Error(error.message || "Failed to fetch tickets");
  }
};

const getTicket = async (req, res) => {
  try {
    const { id: tid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(tid)) {
      res.status(400);
      throw new Error("Invalid Ticket ID format");
    }

    const myTicket = await Order.findById(tid)
      .populate("user")
      .populate("event");

    if (!myTicket) {
      res.status(404);
      throw new Error("Ticket Not Found!");
    }

    res.status(200).json({
      success: true,
      ticket: myTicket,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch ticket");
  }
};

const bookTicket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { numberOfSeats, couponCode } = req.body;
    let userId = req.user._id;

    const eventId = req.params.eid;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400);
      throw new Error("Invalid Event ID format");
    }

    if (!numberOfSeats) {
      res.status(409);
      throw new Error("Kindly Select At least One Seat");
    }

    // Use session for read to ensure consistency
    const event = await Event.findById(eventId).session(session);

    if (!event) {
      res.status(404);
      throw new Error("Event Not Found!");
    }

    // BLOCK BOOKING FOR COMPLETED/EXPIRED EVENTS
    const currentDate = new Date();
    const eventDate = new Date(event.eventDate);
    
    if (event.status === "completed" || event.status === "expired" || eventDate < currentDate.setHours(0,0,0,0)) {
      res.status(403);
      throw new Error("Booking Closed: This event has ended or is no longer available for booking.");
    }

    if (event.totalSeats < numberOfSeats || numberOfSeats > 5) {
      res.status(409);
      throw new Error("Seats Not Available!");
    }

    const allPreviousOrder = await Order.find({ event: event._id }).session(session);
    const myOrders = allPreviousOrder.filter(
      (order) => order.user.toString() == userId.toString()
    );

    let myExistingBookingSeats = myOrders
      .filter((order) => order.status != "cancelled")
      .reduce((acc, order) => acc + order.seats, 0);

    if (myExistingBookingSeats + parseInt(numberOfSeats) > 5) {
      res.status(409);
      throw new Error(
        `Only 5 Seats Allowed Per User! ${5 - myExistingBookingSeats} Seats Available`
      );
    }

    let couponExists;
    if (couponCode) {
      couponExists = await Coupon.findOne({ couponCode: couponCode.toUpperCase(), isActive: true }).session(session);
      
      if (!couponExists) {
        res.status(404);
        throw new Error("Invalid or expired coupon code");
      }

      // Check Expiry
      if (couponExists.expiresAt && new Date(couponExists.expiresAt) < new Date()) {
        res.status(409);
        throw new Error("Coupon has expired");
      }

      // Check Usage Limit
      if (couponExists.usageLimit && couponExists.usedCount >= couponExists.usageLimit) {
        res.status(409);
        throw new Error("Coupon usage limit reached");
      }

      // Check User Authorization
      if (!couponExists.isPublic) {
        const isAllowed = couponExists.allowedUsers.some(id => id.toString() === userId.toString());
        if (!isAllowed) {
          res.status(403);
          throw new Error("This coupon is not assigned to your account");
        }
      }

      // Check Event Applicability
      if (couponExists.applicableEvents && couponExists.applicableEvents.length > 0) {
        const isEventApplicable = couponExists.applicableEvents.some(id => id.toString() === eventId.toString());
        if (!isEventApplicable) {
          res.status(409);
          throw new Error("Coupon is not applicable for this event");
        }
      }

      // Check if User already used it
      const hasUsed = couponExists.usedBy.some(id => id.toString() === userId.toString());
      if (hasUsed) {
        res.status(409);
        throw new Error("You have already used this coupon");
      }

      // Check Minimum Purchase
      const subtotalBeforeDiscount = event.ticketPrice * numberOfSeats;
      if (subtotalBeforeDiscount < couponExists.minPurchaseAmount) {
        res.status(409);
        throw new Error(`Minimum purchase of ₹${couponExists.minPurchaseAmount} required for this coupon`);
      }
    }

    // Calculate Discount
    let totalDiscount = 0;
    if (couponExists) {
      if (couponExists.discountType === "percentage") {
        totalDiscount = (event.ticketPrice * numberOfSeats * couponExists.couponDiscount) / 100;
        if (couponExists.maxDiscountAmount && totalDiscount > couponExists.maxDiscountAmount) {
          totalDiscount = couponExists.maxDiscountAmount;
        }
      } else {
        // Fixed discount
        totalDiscount = couponExists.couponDiscount;
      }
    }

    const subtotal = (event.ticketPrice * numberOfSeats) - totalDiscount;
    const platformFee = Math.round(subtotal * 0.03); // 3% Platform Fee
    const totalBillAmount = subtotal + platformFee;

    // Define Split
    const creatorEarning = subtotal;
    const adminEarning = platformFee;

    let buyer = await User.findById(userId).session(session);

    if (totalBillAmount > buyer.credits) {
      res.status(409);
      throw new Error("Not Enough Credits!");
    }

    // Find the Creator (Organizer)
    const creator = await User.findById(event.user).session(session);
    if (!creator) {
      res.status(404);
      throw new Error("Event organizer not found!");
    }

    // Find a Platform Admin Wallet (First Admin found)
    const admin = await User.findOne({ isAdmin: true }).session(session);

    // Create Order within Transaction
    const [order] = await Order.create([{
      user: userId,
      event: eventId,
      seats: numberOfSeats,
      status: "confirmed",
      isDiscounted: !!couponCode,
      couponCode: couponCode || null,
      discountPercentage: couponExists && couponExists.discountType === 'percentage' ? couponExists.couponDiscount : 0,
      subtotal,
      platformFee,
      creatorEarning,
      adminEarning,
      billedAmount: totalBillAmount,
    }], { session });

    if (!order) {
      res.status(409);
      throw new Error("Order Not Accepted!");
    }

    // Update Coupon Usage
    if (couponExists) {
      await Coupon.findByIdAndUpdate(couponExists._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: userId }
      }, { session });
    }

    // Update Available Seats
    await Event.findByIdAndUpdate(event._id, { $inc: { totalSeats: -numberOfSeats } }, { session });

    // --- FINANCIAL DISTRIBUTION ---
    
    // 1. Deduct from Buyer
    await User.findByIdAndUpdate(userId, { $inc: { credits: -totalBillAmount } }, { session });

    // 2. Add to Creator
    await User.findByIdAndUpdate(creator._id, { $inc: { credits: creatorEarning } }, { session });

    // 3. Add to Admin/Platform (if exists)
    if (admin) {
      await User.findByIdAndUpdate(admin._id, { $inc: { credits: adminEarning } }, { session });
    }

    // Commit Transaction
    await session.commitTransaction();
    console.log(`[TRANSACTION] Booking SUCCESS for Order: ${order._id}`);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    // Abort Transaction on failure
    await session.abortTransaction();
    console.error(`[TRANSACTION] Booking ABORTED: ${error.message}`);
    
    res.status(res.statusCode === 200 ? 500 : res.statusCode || 500);
    throw new Error(error.message || "Failed to book ticket");
  } finally {
    session.endSession();
  }
};

const cancelTicket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    let userId = req.user._id;
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      res.status(400);
      throw new Error("Invalid Ticket ID format");
    }

    let ticket = await Order.findById(ticketId).session(session);

    if (!ticket) {
      res.status(404);
      throw new Error("Ticket Not Found!");
    }

    if (ticket.status == "cancelled") {
      res.status(400);
      throw new Error("Ticket Already Cancelled");
    }

    const event = await Event.findById(ticket.event).session(session);

    if (ticket.status == "expired") {
      res.status(409);
      throw new Error("Ticket Already Expired");
    }

    // Update Available Seats
    await Event.findByIdAndUpdate(event._id, { $inc: { totalSeats: ticket.seats } }, { session });

    // --- REVERSE FINANCIAL DISTRIBUTION ---
    
    // 1. Refund Buyer
    await User.findByIdAndUpdate(userId, { $inc: { credits: ticket.billedAmount } }, { session });

    // 2. Deduct from Creator
    if (ticket.creatorEarning) {
      await User.findByIdAndUpdate(event.user, { $inc: { credits: -ticket.creatorEarning } }, { session });
    }

    // 3. Deduct from Admin
    if (ticket.adminEarning) {
      const admin = await User.findOne({ isAdmin: true }).session(session);
      if (admin) {
        await User.findByIdAndUpdate(admin._id, { $inc: { credits: -ticket.adminEarning } }, { session });
      }
    }

    const updatedTicket = await Order.findByIdAndUpdate(
      ticket._id,
      { status: "cancelled" },
      { new: true, session }
    );

    if (!updatedTicket) {
      res.status(409);
      throw new Error("Ticket Not Cancelled");
    }

    // Commit Transaction
    await session.commitTransaction();
    console.log(`[TRANSACTION] Cancellation SUCCESS for Order: ${ticket._id}`);

    res.status(200).json({
      success: true,
      ticket: updatedTicket,
    });
  } catch (error) {
    // Abort Transaction on failure
    await session.abortTransaction();
    console.error(`[TRANSACTION] Cancellation ABORTED: ${error.message}`);
    
    res.status(res.statusCode === 200 ? 500 : res.statusCode || 500);
    throw new Error(error.message || "Failed to cancel ticket");
  } finally {
    session.endSession();
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { couponCode, eventId, numberOfSeats } = req.body;
    const userId = req.user._id;

    if (!couponCode) {
      res.status(400);
      throw new Error("Please provide a coupon code");
    }

    const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      res.status(404);
      throw new Error("Invalid or expired coupon code");
    }

    // 1. Expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      res.status(409);
      throw new Error("Coupon has expired");
    }

    // 2. Usage Limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(409);
      throw new Error("Coupon usage limit reached");
    }

    // 3. User Authorization
    if (!coupon.isPublic) {
      const isAllowed = coupon.allowedUsers.some(id => id.toString() === userId.toString());
      if (!isAllowed) {
        res.status(403);
        throw new Error("This coupon is private and not assigned to your account");
      }
    }

    // 4. Duplicate Usage
    const hasUsed = coupon.usedBy.some(id => id.toString() === userId.toString());
    if (hasUsed) {
      res.status(409);
      throw new Error("You have already used this coupon");
    }

    // 5. Event Applicability
    if (eventId && coupon.applicableEvents && coupon.applicableEvents.length > 0) {
      const isEventApplicable = coupon.applicableEvents.some(id => id.toString() === eventId.toString());
      if (!isEventApplicable) {
        res.status(409);
        throw new Error("Coupon is not applicable for this event");
      }
    }

    // 6. Minimum Purchase (if we have event context)
    if (eventId && numberOfSeats) {
      const event = await Event.findById(eventId);
      if (event) {
        const subtotal = event.ticketPrice * numberOfSeats;
        if (subtotal < coupon.minPurchaseAmount) {
          res.status(409);
          throw new Error(`Minimum purchase of ₹${coupon.minPurchaseAmount} required`);
        }
      }
    }

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.couponCode,
        discount: coupon.couponDiscount,
        type: coupon.discountType,
        maxDiscount: coupon.maxDiscountAmount
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message || "Failed to validate coupon");
  }
};

const getMyCoupons = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find coupons that are:
    // 1. Active
    // 2. Not expired
    // 3. (Public OR assigned to this user)
    // 4. Not already used by this user
    const coupons = await Coupon.find({
      isActive: true,
      $and: [
        { $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] },
        { $or: [{ isPublic: true }, { allowedUsers: userId }] }
      ],
      usedBy: { $ne: userId }
    }).select("couponCode couponDiscount discountType maxDiscountAmount minPurchaseAmount expiresAt description");

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch coupons");
  }
};

const updateCreatorOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    const creatorId = req.user._id;

    if (!["pending", "confirmed", "cancelled", "rejected"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status update");
    }

    const order = await Order.findById(id).populate("event").session(session);
    if (!order) {
      res.status(404);
      throw new Error("Booking not found");
    }

    // Verify Ownership: Does this event belong to the logged-in creator?
    if (order.event.user.toString() !== creatorId.toString()) {
      res.status(403);
      throw new Error("Unauthorized: You can only manage bookings for your own events");
    }

    // Handle Financial Reversals if status changes to 'cancelled' or 'rejected'
    if ((status === "cancelled" || status === "rejected") && order.status !== "cancelled" && order.status !== "rejected") {
      const event = await Event.findById(order.event._id).session(session);
      const user = await User.findById(order.user).session(session);

      // 1. Restore Seats
      if (event) {
        await Event.findByIdAndUpdate(event._id, { $inc: { totalSeats: order.seats } }, { session });
      }

      // 2. Refund Buyer
      if (user) {
        await User.findByIdAndUpdate(user._id, { $inc: { credits: order.billedAmount } }, { session });
      }

      // 3. Reverse Creator Earning
      if (order.creatorEarning) {
        await User.findByIdAndUpdate(creatorId, { $inc: { credits: -order.creatorEarning } }, { session });
      }

      // 4. Reverse Admin Fee
      if (order.adminEarning) {
        const admin = await User.findOne({ isAdmin: true }).session(session);
        if (admin) {
          await User.findByIdAndUpdate(admin._id, { $inc: { credits: -order.adminEarning } }, { session });
        }
      }
    }

    // Handle Restoration if status changes FROM 'cancelled/rejected' BACK to 'confirmed'
    if (status === "confirmed" && (order.status === "cancelled" || order.status === "rejected")) {
       const event = await Event.findById(order.event._id).session(session);
       const user = await User.findById(order.user).session(session);

       if (event && event.totalSeats < order.seats) {
         res.status(409);
         throw new Error("Insufficient seats to restore booking");
       }

       if (user && user.credits < order.billedAmount) {
         res.status(409);
         throw new Error("User has insufficient credits to re-confirm booking");
       }

       // Deduct seats and credits again
       if (event) await Event.findByIdAndUpdate(event._id, { $inc: { totalSeats: -order.seats } }, { session });
       if (user) await User.findByIdAndUpdate(user._id, { $inc: { credits: -order.billedAmount } }, { session });
       
       // Re-distribute earnings
       if (order.creatorEarning) {
         await User.findByIdAndUpdate(creatorId, { $inc: { credits: order.creatorEarning } }, { session });
       }
       if (order.adminEarning) {
         const admin = await User.findOne({ isAdmin: true }).session(session);
         if (admin) await User.findByIdAndUpdate(admin._id, { $inc: { credits: order.adminEarning } }, { session });
       }
    }

    order.status = status;
    await order.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    console.log(`[TRANSACTION] Creator Status Update SUCCESS for Order: ${order._id} to ${status}`);

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      order
    });

  } catch (error) {
    // Abort Transaction on failure
    await session.abortTransaction();
    console.error(`[TRANSACTION] Creator Status Update ABORTED: ${error.message}`);
    
    res.status(error.statusCode || 500);
    throw new Error(error.message || "Failed to update booking status");
  } finally {
    session.endSession();
  }
};

const orderController = { bookTicket, cancelTicket, getTickets, getTicket, validateCoupon, getMyCoupons, updateCreatorOrderStatus };

export default orderController;
