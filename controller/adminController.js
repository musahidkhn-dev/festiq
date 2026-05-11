import mongoose from "mongoose";
import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    } : {};

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!users) {
      res.status(404);
      throw new Error("Users Not Found!");
    }

    res.status(200).json({
      success: true,
      users,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch users");
  }
};

const updateUser = async (req, res) => {

  let  {isActive, credits} = req.body
  
  const userId = req.params.uid;

  let user = await User.findById(userId)

  if(!user){
    res.status(404)
    throw new Error('User Not Found!')
  }

  let updatedUser

  if (credits !== undefined) {
    const creditAdjustment = parseInt(credits);
    if (isNaN(creditAdjustment)) {
      res.status(400);
      throw new Error("Invalid credit amount provided.");
    }

    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: creditAdjustment } },
      { new: true }
    );
  } else {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: isActive },
      { new: true }
    );
  }




  if (!updatedUser) {
    res.status(409);
    throw new Error("User Not Updated");
  }

  res.status(200).json(updatedUser);
};

const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log("Backend received delete request for UID:", uid);
    
    const user = await User.findById(uid);
    if (!user) {
      console.log("User not found in DB for UID:", uid);
      res.status(404);
      throw new Error("User Not Found!");
    }

    await User.deleteOne({ _id: uid });
    console.log("User successfully deleted from DB:", uid);
    
    res.status(200).json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.error("Backend deleteUser error:", error.message);
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to delete user");
  }
};

const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search ? {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { eventArtistName: { $regex: search, $options: "i" } }
      ]
    } : {};

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!events) {
      res.status(404);
      throw new Error("Events Not Found!");
    }

    res.status(200).json({
      success: true,
      events,
      pagination: {
        totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch events");
  }
};

import uploadToCloudinary from "../Middleware/cloudinaryMiddleware.js";
import fs from "node:fs";

const updateEvents = async (req, res) => {
  try {
    const eventId = req.params.eid;
    let updateData = { ...req.body };

    console.log(`[DEBUG] Update Event Request for ID: ${eventId}`);
    console.log(`[DEBUG] Incoming Data:`, updateData);

    // Convert string booleans from FormData back to actual booleans
    if (updateData.isActive === 'true') updateData.isActive = true;
    if (updateData.isActive === 'false') updateData.isActive = false;

    // If new image is uploaded
    if (req.file) {
      console.log(`[DEBUG] New image detected, uploading to Cloudinary...`);
      const uploadResult = await uploadToCloudinary(req.file.path);
      fs.unlinkSync(req.file.path);
      updateData.eventImage = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    }).populate("user");

    if (!updatedEvent) {
      console.log(`[DEBUG] Update FAILED: Event not found.`);
      res.status(404);
      throw new Error("Event Not Found!");
    }

    console.log(`[DEBUG] Update SUCCESS. New DB Status: ${updatedEvent.status}, Visibility: ${updatedEvent.isActive}`);
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error(`[DEBUG] Update CRASHED:`, error.message);
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to update event");
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eid);
    if (!event) {
      res.status(404);
      throw new Error("Event Not Found!");
    }
    res.status(200).json({ success: true, message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to delete event");
  }
};

const getAllRatings = async (req, res) => {
  try {
    const events = await Event.find({ "reviews.0": { $exists: true } })
      .select("title category reviews")
      .lean();
    
    const ratings = [];
    for (const event of events) {
      for (const review of event.reviews) {
        ratings.push({
          _id: review._id,
          eventId: event._id,
          eventTitle: event.title,
          eventCategory: event.category,
          user: review.user,
          name: review.name,
          avatar: review.avatar,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      }
    }
    
    // Sort newest first
    ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch ratings");
  }
};

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      // Find events matching search to filter orders
      const matchedEvents = await Event.find({ title: { $regex: search, $options: "i" } }).select('_id');
      const eventIds = matchedEvents.map(e => e._id);
      
      // Find users matching search
      const matchedUsers = await User.find({ 
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).select('_id');
      const userIds = matchedUsers.map(u => u._id);

      query = {
        $or: [
          { event: { $in: eventIds } },
          { user: { $in: userIds } }
        ]
      };
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user")
      .populate("event")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders) {
      res.status(404);
      throw new Error("Orders Not Found!");
    }

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch orders");
  }
};

const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.oid).session(session);

    if (!order) {
      res.status(404);
      throw new Error("Order Not Found!");
    }

    // If cancelling, handle refund and seat recovery
    if (status === "cancelled" && order.status !== "cancelled") {
      const event = await Event.findById(order.event).session(session);
      const user = await User.findById(order.user).session(session);

      if (event) {
        await Event.findByIdAndUpdate(event._id, {
          $inc: { totalSeats: order.seats },
        }, { session });

        // REVERSE CREATOR EARNING
        if (order.creatorEarning) {
          await User.findByIdAndUpdate(event.user, { $inc: { credits: -order.creatorEarning } }, { session });
        }
      }

      if (user) {
        await User.findByIdAndUpdate(user._id, {
          $inc: { credits: order.billedAmount },
        }, { session });
      }

      // REVERSE ADMIN EARNING
      if (order.adminEarning) {
        const adminWallet = await User.findOne({ isAdmin: true }).session(session);
        if (adminWallet) {
          await User.findByIdAndUpdate(adminWallet._id, { $inc: { credits: -order.adminEarning } }, { session });
        }
      }
    }

    // If restoring a cancelled order to confirmed
    if (status === "confirmed" && order.status === "cancelled") {
      const event = await Event.findById(order.event).session(session);
      const user = await User.findById(order.user).session(session);

      if (event && event.totalSeats < order.seats) {
         res.status(409);
         throw new Error("Cannot restore order: Not enough seats available!");
      }

      if (user && user.credits < order.billedAmount) {
         res.status(409);
         throw new Error("Cannot restore order: User has insufficient credits!");
      }

      if (event) {
        await Event.findByIdAndUpdate(event._id, {
          $inc: { totalSeats: -order.seats },
        }, { session });

        // RESTORE CREATOR EARNING
        if (order.creatorEarning) {
          await User.findByIdAndUpdate(event.user, { $inc: { credits: order.creatorEarning } }, { session });
        }
      }

      if (user) {
        await User.findByIdAndUpdate(user._id, {
          $inc: { credits: -order.billedAmount },
        }, { session });
      }

      // RESTORE ADMIN EARNING
      if (order.adminEarning) {
        const adminWallet = await User.findOne({ isAdmin: true }).session(session);
        if (adminWallet) {
          await User.findByIdAndUpdate(adminWallet._id, { $inc: { credits: order.adminEarning } }, { session });
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.oid,
      { status },
      { new: true, session }
    ).populate("user event");

    // Commit Transaction
    await session.commitTransaction();
    console.log(`[TRANSACTION] Admin Order Update SUCCESS for Order: ${order._id} to ${status}`);

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    // Abort Transaction on failure
    await session.abortTransaction();
    console.error(`[TRANSACTION] Admin Order Update ABORTED: ${error.message}`);
    
    res.status(res.statusCode === 200 ? 500 : res.statusCode || 500);
    throw new Error(error.message || "Failed to update order status");
  } finally {
    session.endSession();
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.oid);
    if (!order) {
      res.status(404);
      throw new Error("Order Not Found!");
    }
    res.status(200).json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to delete order");
  }
};

const createCoupon = async (req, res) => {
  try {
    const { 
      couponCode, 
      couponDiscount, 
      discountType, 
      maxDiscountAmount, 
      minPurchaseAmount, 
      usageLimit, 
      expiresAt, 
      isPublic,
      applicableEvents 
    } = req.body;

    if (!couponCode || !couponDiscount) {
      res.status(400);
      throw new Error("Coupon code and discount are required!");
    }

    const couponExist = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (couponExist) {
      res.status(409);
      throw new Error("Coupon code already exists!");
    }

    const newCoupon = await Coupon.create({
      couponCode: couponCode.toUpperCase(),
      couponDiscount,
      discountType: discountType || "percentage",
      maxDiscountAmount,
      minPurchaseAmount: minPurchaseAmount || 0,
      usageLimit,
      expiresAt,
      isPublic: isPublic !== undefined ? isPublic : true,
      applicableEvents: applicableEvents || []
    });

    res.status(201).json({
      success: true,
      coupon: newCoupon,
    });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to create coupon");
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("allowedUsers", "name email")
      .populate("applicableEvents", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch coupons");
  }
};

const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.cid,
      req.body,
      { new: true }
    );

    if (!updatedCoupon) {
      res.status(404);
      throw new Error("Coupon Not Found!");
    }

    res.status(200).json({
      success: true,
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to update coupon");
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.cid);
    if (!coupon) {
      res.status(404);
      throw new Error("Coupon Not Found!");
    }
    res.status(200).json({ success: true, message: "Coupon Deleted Successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to delete coupon");
  }
};

const assignCouponToUser = async (req, res) => {
  try {
    const { couponId, userId } = req.body;

    if (!couponId || !userId) {
      res.status(400);
      throw new Error("Coupon ID and User ID are required");
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      res.status(404);
      throw new Error("Coupon Not Found");
    }

    // Check if user already has it
    if (coupon.allowedUsers.includes(userId)) {
      res.status(409);
      throw new Error("Coupon already assigned to this user");
    }

    coupon.allowedUsers.push(userId);
    coupon.isPublic = false; // Automatically make it private if assigned
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon assigned successfully",
      coupon
    });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to assign coupon");
  }
};

const getAnalytics = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // 2. Consistent Aggregation for Revenue & Filtered Orders
    const analyticsData = await Order.aggregate([
      { $match: { status: "confirmed" } },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDoc"
        }
      },
      { $match: { "eventDoc.0": { $exists: true } } }, // Filter orphaned orders
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$billedAmount" },
          totalPlatformRevenue: { $sum: { $ifNull: ["$platformFee", 0] } },
          totalSeatsSold: { $sum: "$seats" },
          confirmedCount: { $sum: 1 }
        },
      },
    ]);

    const totalRevenue = analyticsData[0]?.totalRevenue || 0;
    const platformRevenue = analyticsData[0]?.totalPlatformRevenue || 0;
    const totalSeatsSold = analyticsData[0]?.totalSeatsSold || 0;
    const confirmedOrders = analyticsData[0]?.confirmedCount || 0;

    // 3. Monthly Revenue (Last 6 Months) - Filtered by Existing Events
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "confirmed",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "eventDoc"
        }
      },
      { $match: { "eventDoc.0": { $exists: true } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$billedAmount" },
          orders: { $count: {} },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data for Recharts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      name: monthNames[item._id.month - 1],
      revenue: item.revenue,
      orders: item.orders,
    }));

    // 4. Top Selling Events
    const topEvents = await Order.aggregate([
      { $match: { status: "confirmed" } },
      {
        $group: {
          _id: "$event",
          sold: { $sum: "$seats" },
          revenue: { $sum: "$billedAmount" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "details",
        },
      },
      { $unwind: "$details" },
      {
        $project: {
          title: "$details.title",
          category: "$details.category",
          sold: 1,
          revenue: 1,
          image: "$details.eventImage",
          price: "$details.ticketPrice"
        },
      },
    ]);

    // 5. Recent Activity (Latest 8 Orders for a better list)
    const recentActivity = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("user", "name email")
      .populate("event", "title");

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalEvents,
        activeEvents,
        totalOrders,
        confirmedOrders,
        cancelledOrders,
        totalRevenue,
        platformRevenue,
        ticketsSold: totalSeatsSold, // Map to ticketsSold for frontend
      },
      monthlyRevenue: formattedMonthlyRevenue,
      topEvents,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Fetch hosted events if creator
    let hostedEvents = [];
    if (user.isCreator) {
      const rawEvents = await Event.find({ user: id }).sort({ createdAt: -1 });
      
      // Calculate stats for EACH event
      hostedEvents = await Promise.all(rawEvents.map(async (ev) => {
        const orders = await Order.find({ event: ev._id, status: 'confirmed' });
        const revenue = orders.reduce((acc, curr) => acc + (curr.billedAmount || 0), 0);
        const bookedSeats = orders.reduce((acc, curr) => acc + (curr.seats || 0), 0);
        
        return {
          ...ev.toObject(),
          revenue,
          bookedSeats
        };
      }));
    }

    // Fetch booking history
    const bookings = await Order.find({ user: id })
      .populate("event")
      .sort({ createdAt: -1 });

    // Fetch reviews from events
    const eventsWithReviews = await Event.find({ "reviews.user": id })
      .select("title reviews category eventImage");
    
    const reviews = eventsWithReviews.flatMap(ev => 
      ev.reviews
        .filter(r => r.user && r.user.toString() === id.toString())
        .map(r => ({
          ...r.toObject(),
          event: { _id: ev._id, title: ev.title, category: ev.category, eventImage: ev.eventImage }
        }))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate aggregated creator stats if creator
    let creatorStats = {
      totalRevenue: 0,
      totalTicketsSold: 0,
      totalEvents: hostedEvents.length
    };

    if (user.isCreator) {
      creatorStats.totalRevenue = hostedEvents.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
      creatorStats.totalTicketsSold = hostedEvents.reduce((acc, curr) => acc + (curr.bookedSeats || 0), 0);
    }

    res.status(200).json({
      success: true,
      user,
      hostedEvents,
      bookings,
      reviews,
      creatorStats
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch user details");
  }
};

const adminController = {
  getAllUsers,
  updateUser,
  getAllEvents,
  deleteEvent,
  getAllOrders,
  getAllCoupons,
  getAllRatings,
  updateEvents,
  createCoupon,
  updateCoupon,
  getAnalytics,
  deleteUser,
  deleteOrder,
  updateOrderStatus,
  deleteCoupon,
  assignCouponToUser,
  getUserDetails,
};

export default adminController;
