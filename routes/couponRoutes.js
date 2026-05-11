import express from "express";
import protect from "../Middleware/authMiddleware.js";
import couponController from "../controller/couponController.js";

const router = express.Router();

router.get("/my-coupons", protect.forUser, couponController.getMyCoupons);
router.post("/validate-coupon", protect.forUser, couponController.validateCoupon);

export default router;
