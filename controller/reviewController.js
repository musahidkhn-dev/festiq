import Event from "../models/eventModel.js";
import Order from "../models/orderModel.js";

// Add a review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const eventId = req.params.eid;

    if (!rating || !comment) {
      res.status(400);
      throw new Error("Please provide rating and comment");
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // CHECK FOR VALID BOOKING
    const hasBooked = await Order.findOne({
      user: req.user._id,
      event: eventId,
      status: { $in: ["confirmed", "pending"] }
    });

    if (!hasBooked) {
      res.status(403);
      throw new Error("Only users who have booked this experience can leave a review");
    }

    // Check if user already reviewed
    const alreadyReviewed = event.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this event");
    }

    const review = {
      name: req.user.name,
      avatar: req.user.profilePicture || "",
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    event.reviews.push(review);
    event.totalReviews = event.reviews.length;
    event.averageRating =
      event.reviews.reduce((acc, item) => item.rating + acc, 0) /
      event.reviews.length;

    await event.save();

    res.status(201).json({ success: true, message: "Review added", event });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to add review");
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eid);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Find the review
    const review = event.reviews.find(
      (r) => r._id.toString() === req.params.rid.toString()
    );

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Check if it's the user's review or admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to delete this review");
    }

    // Remove the review
    event.reviews = event.reviews.filter(
      (r) => r._id.toString() !== req.params.rid.toString()
    );

    event.totalReviews = event.reviews.length;
    
    if (event.reviews.length > 0) {
      event.averageRating =
        event.reviews.reduce((acc, item) => item.rating + acc, 0) /
        event.reviews.length;
    } else {
      event.averageRating = 0;
    }

    await event.save();

    res.status(200).json({ success: true, message: "Review removed", event });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to delete review");
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const eventId = req.params.eid;
    const reviewId = req.params.rid;

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const review = event.reviews.find(
      (r) => r._id.toString() === reviewId.toString()
    );

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to edit this review");
    }

    // Update fields
    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    // Recalculate average rating
    event.averageRating =
      event.reviews.reduce((acc, item) => item.rating + acc, 0) /
      event.reviews.length;

    await event.save();

    res.status(200).json({ success: true, message: "Review updated", event });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message || "Failed to update review");
  }
};

const reviewController = { addReview, deleteReview, updateReview };
export default reviewController;
