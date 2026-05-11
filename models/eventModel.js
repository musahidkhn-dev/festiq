


import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
    title: {
      type: String,
      required: [true, "Please Enter Event Title"],
    },
    category: {
        type: String,
        required: [true, "Please Enter Event Category"]
    },
    description: { 
        type: String, 
        required: [true, "Please Enter Event Description"] 
    },
    
    eventImage: {
        type: String, 
        required: [true, "Please Enter Event Image URL"]
    },
    eventDate: {
        type: String, 
        required: [true, "Please Enter Event Date"]
    },
    eventLocation: {
        type: String, 
        required: [true, "Please Enter Event Location"]
    },
    eventArtistName: {
        type: String, 
        required: [true, "Please Enter Event Artist Name"]
    },
    totalSeats: {
        type: Number, 
        required: [true, "Please Enter Event Seats"]
    },
    duration: {
        type: String, 
        required: [true, "Please Enter Event Duration"]
    },
    ticketPrice: {
        type: Number, 
        required: [true, "Please Enter Event Ticket Price"],
        
    },
      status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled", "expired", "postponed"],
      required: true,
      default: "upcoming",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Retroactive support for existing events. New hosted events will be forced to 'pending' in controller.
    },
    isActive: {
        type : Boolean ,
        required : true,
        default : true
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        avatar: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  },
);

eventSchema.pre("save", async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(this.eventDate);
  targetDate.setHours(0, 0, 0, 0);

  // If status is cancelled, postponed or expired, we allow manual management
  if (["cancelled", "postponed", "expired"].includes(this.status)) {
    // Sync isActive: these statuses should never be active
    if (this.status === "cancelled" || this.status === "expired") {
      this.isActive = false;
    }
    return;
  }

  // VALIDATION RULES
  if (targetDate > today) {
    // Future Date: Cannot be Live or Completed
    if (this.status === "live" || this.status === "completed") {
      throw new Error(`Validation Failed: A future event (Date: ${this.eventDate}) cannot be set to '${this.status}'. It must be 'upcoming'.`);
    }
  } else if (targetDate < today) {
    // Past Date: Must be Completed or Expired
    if (this.status === "live" || this.status === "upcoming") {
      throw new Error(`Validation Failed: A past event (Date: ${this.eventDate}) cannot be set to '${this.status}'. It must be 'completed' or 'expired'.`);
    }
    // Past events that are completed should be deactivated from public listing
    if (this.status === "completed") {
      this.isActive = false;
    }
  } else if (targetDate.getTime() === today.getTime()) {
    // Today: Should ideally be Live
    if (this.status === "upcoming" || this.status === "completed") {
      this.status = "live"; // We can auto-correct this one as it makes sense for today's events
    }
  }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
