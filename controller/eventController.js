import { uploadToCloudinary, deleteFromCloudinary } from "../Middleware/cloudinaryMiddleware.js";
import fs from "node:fs"
import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const createEvent = async (req, res, next) => {
  try {
    const {
      title, 
      description, 
      category,
      eventDate, 
      eventLocation, 
      eventArtistName, 
      totalSeats, 
      duration, 
      ticketPrice,
      status
    } = req.body;

    if (!title || !description || !category || !eventDate || !eventLocation || !eventArtistName || !totalSeats || !duration || !ticketPrice) {
      res.status(400);
      throw new Error("Please Enter All Details!");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an event image!");
    }

    // Upload Image To Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);
    if (req.file.path) fs.unlinkSync(req.file.path);

    // Create New Event
    const newEvent = await Event.create({ 
      user: req.user._id, 
      title, 
      category,
      description, 
      eventDate, 
      eventLocation, 
      eventArtistName, 
      totalSeats, 
      duration, 
      ticketPrice, 
      status: status || "upcoming",
      isActive: true, // Explicitly set to true for visibility
      approvalStatus: "approved", // Admin events are pre-approved
      eventImage: uploadResult.secure_url 
    });

    if (!newEvent) {
      res.status(401);
      throw new Error("Event Not Created!");
    }

    // Set user as creator if not already
    if (!req.user.isCreator) {
      await User.findByIdAndUpdate(req.user._id, { isCreator: true });
    }

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    next(error);
  }
};

const hostEvent = async (req, res, next) => {
  try {
    const {
      title, description, category, eventDate, eventLocation,
      eventArtistName, totalSeats, duration, ticketPrice, status
    } = req.body;

    if (!title || !description || !category || !eventDate || !eventLocation || !eventArtistName || !totalSeats || !duration || !ticketPrice) {
      res.status(400);
      throw new Error("Please Enter All Details!");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an event banner!");
    }

    const uploadResult = await uploadToCloudinary(req.file.path);
    if (req.file.path) fs.unlinkSync(req.file.path);

    const newEvent = await Event.create({
      user: req.user._id,
      title, category, description, eventDate, eventLocation,
      eventArtistName, totalSeats, duration, ticketPrice,
      status: status || "upcoming",
      isActive: true,
      approvalStatus: "pending", // Force pending for user events
      eventImage: uploadResult.secure_url
    });

    // Set user as creator if not already
    if (!req.user.isCreator) {
      await User.findByIdAndUpdate(req.user._id, { isCreator: true });
    }

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    next(error);
  }
};

const getMyHostedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ 
      user: req.user._id,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const moderateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
      res.status(400);
      throw new Error("Invalid approval status");
    }

    const event = await Event.findByIdAndUpdate(id, { approvalStatus }, { new: true });
    
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// Get Events 
const getEvents = async (req, res) => {
  try {
    const { 
      search, category, minPrice, maxPrice, date, status, sort,
      page = 1, limit = 9
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let query = { 
      isActive: true, 
      isDeleted: { $ne: true },
      $or: [
        { approvalStatus: "approved" },
        { approvalStatus: { $exists: false } }
      ] 
    };

    // Search Filter (Title, Artist, Location, or Category)
    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { eventArtistName: { $regex: search, $options: "i" } },
            { eventLocation: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
          ]
        }
      ];
    }

    // Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.ticketPrice = {};
      if (minPrice) query.ticketPrice.$gte = Number(minPrice);
      if (maxPrice) query.ticketPrice.$lte = Number(maxPrice);
    }

    // Status Filter
    if (status && status !== "All") {
      query.status = status;
    } else {
      query.status = { $ne: "expired" };
    }

    // Date Filter (Today, Next 30 Days, etc.)
    if (date && date !== "All Time") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date === "Today") {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        query.eventDate = { $gte: today.toISOString().split('T')[0], $lt: tomorrow.toISOString().split('T')[0] };
      } else if (date === "Next 30 Days") {
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        query.eventDate = { $gte: today.toISOString().split('T')[0], $lte: nextMonth.toISOString().split('T')[0] };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === "Price: Low → High") sortOptions = { ticketPrice: 1 };
    if (sort === "Price: High → Low") sortOptions = { ticketPrice: -1 };
    if (sort === "Newest First") sortOptions = { createdAt: -1 };

    // Get Total Count for Pagination
    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / Number(limit));

    const events = await Event.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalEvents,
      totalPages,
      currentPage: Number(page),
      hasMore: Number(page) < totalPages,
      events: events,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Failed to fetch events");
  }
};

// Get Event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eid);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event Not Found!" });
    }

    let hasBooked = false;
    if (req.user) {
      const order = await Order.findOne({
        user: req.user._id,
        event: event._id,
        status: { $in: ["confirmed", "pending"] }
      });
      hasBooked = !!order;
    }

    res.status(200).json({
      success: true,
      event,
      hasBooked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch event" });
  }
};

const getCreatorAnalytics = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const user = await User.findById(creatorId).select("credits");

    const events = await Event.find({ 
      user: creatorId,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });
    const eventIds = events.map(e => e._id);

    const orders = await Order.find({ 
      event: { $in: eventIds },
      status: { $in: ["confirmed", "pending", "cancelled", "rejected"] }
    })
    .populate("user", "name email profilePicture")
    .populate("event", "title eventDate ticketPrice")
    .sort({ createdAt: -1 });

    let totalRevenue = 0;
    let totalTicketsSold = 0;

    orders.forEach(order => {
      if (order.status === "confirmed") {
        // Use creatorEarning if available, fallback to billedAmount for legacy data
        totalRevenue += order.creatorEarning !== undefined ? order.creatorEarning : order.billedAmount;
        totalTicketsSold += order.seats;
      }
    });

    res.status(200).json({
      success: true,
      events,
      metrics: {
        totalEvents: events.length,
        totalRevenue,
        totalTicketsSold,
        approvedEvents: events.filter(e => e.approvalStatus === 'approved').length,
        pendingEvents: events.filter(e => e.approvalStatus === 'pending').length,
        pendingBookings: orders.filter(o => o.status === 'pending').length,
        walletBalance: user?.credits || 0
      },
      recentBookings: orders.map(o => ({
        ...o._doc,
        displayAmount: o.billedAmount,
        creatorEarning: o.creatorEarning !== undefined ? o.creatorEarning : o.billedAmount,
        platformFee: o.platformFee || 0
      }))
    });

  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Ensure likes array exists (for legacy data)
    if (!event.likes) event.likes = [];

    const isLiked = event.likes.includes(userId);

    if (isLiked) {
      // Unlike: Remove userId from array
      event.likes = event.likes.filter((uid) => uid.toString() !== userId.toString());
    } else {
      // Like: Add userId to array
      event.likes.push(userId);
    }

    await event.save();

    res.status(200).json({ 
      success: true, 
      message: isLiked ? "Removed from favorites" : "Added to favorites",
      likes: event.likes 
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Ownership check
    if (event.user.toString() !== userId.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error("Unauthorized: You are not the creator of this event");
    }

    // Check for bookings
    const bookingsCount = await Order.countDocuments({ 
      event: id, 
      status: { $in: ["confirmed", "pending"] } 
    });

    if (bookingsCount > 0) {
      // Soft Delete / Cancellation
      event.isActive = false;
      event.isDeleted = true;
      event.status = "cancelled";
      await event.save();
      
      return res.status(200).json({ 
        success: true, 
        message: "Event has active bookings. It has been marked as cancelled and hidden from public view.",
        type: "cancelled"
      });
    }

    // Hard Delete if no bookings
    if (event.eventImage) {
      try {
        const publicId = event.eventImage.split('/').pop().split('.')[0];
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error("Cloudinary Cleanup Error:", error);
      }
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Event deleted successfully",
      type: "deleted"
    });

  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Ownership check
    if (event.user.toString() !== userId.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error("Unauthorized: You are not the creator of this event");
    }

    const updateData = { ...req.body };

    // Moderation Logic: If a creator edits, reset approvalStatus to pending for re-review
    if (!req.user.isAdmin) {
      updateData.approvalStatus = "pending";
    }

    // Handle Image Replacement
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (req.file.path) fs.unlinkSync(req.file.path);
      
      // Delete old image
      if (event.eventImage) {
        try {
          const oldPublicId = event.eventImage.split('/').pop().split('.')[0];
          await deleteFromCloudinary(oldPublicId);
        } catch (err) {
          console.error("Cloudinary Cleanup Error:", err);
        }
      }
      
      updateData.eventImage = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    res.status(200).json({ 
      success: true, 
      message: "Event updated successfully",
      event: updatedEvent 
    });

  } catch (error) {
    next(error);
  }
};

const eventController = { createEvent, getEvents, getEvent, hostEvent, getMyHostedEvents, moderateEvent, getCreatorAnalytics, toggleLike, deleteEvent, updateEvent };

export default eventController;
