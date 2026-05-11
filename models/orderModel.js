import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    seats : {
        type : Number,
        required : true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "rejected"],
      required: true,
      default: "pending",
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    couponCode: {
      type: String,
      default: null
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    platformFee: {
      type: Number,
      required: true,
      default: 0
    },
    creatorEarning: {
      type: Number,
      required: true,
      default: 0
    },
    adminEarning: {
      type: Number,
      required: true,
      default: 0
    },
    billedAmount: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema)

export default Order