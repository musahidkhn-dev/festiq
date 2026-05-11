import Coupon from "../models/couponModel.js";
import Event from "../models/eventModel.js";

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
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ],
      $or: [
        { isPublic: true },
        { allowedUsers: userId }
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

const couponController = { validateCoupon, getMyCoupons };

export default couponController;
