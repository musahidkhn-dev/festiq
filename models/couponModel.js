import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage"
    },
    couponDiscount: {
        type: Number,
        required: true
    },
    maxDiscountAmount: {
        type: Number,
        default: null // For percentage coupons, cap the discount
    },
    minPurchaseAmount: {
        type: Number,
        default: 0
    },
    usageLimit: {
        type: Number,
        default: null // Total number of times this coupon can be used
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPublic: {
        type: Boolean,
        default: true // If false, only allowedUsers can use it
    },
    allowedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    applicableEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;