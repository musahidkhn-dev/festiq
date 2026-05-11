import express from "express";
import adminController from "../controller/adminController.js";
import protect from "../Middleware/authMiddleware.js";
import upload from "../Middleware/imageUploadMiddleware.js";

const router = express.Router();

router.get("/users", protect.forAdmin, adminController.getAllUsers);
router.get("/ratings", protect.forAdmin, adminController.getAllRatings);
router.get("/events", protect.forAdmin, adminController.getAllEvents);
router.put("/events/:eid", protect.forAdmin, upload.single('eventImage'), adminController.updateEvents);
router.delete("/events/:eid", protect.forAdmin, adminController.deleteEvent);

router.get("/orders", protect.forAdmin, adminController.getAllOrders);
router.get("/coupons", protect.forAdmin, adminController.getAllCoupons);
router.post("/coupons", protect.forAdmin, adminController.createCoupon);
router.post("/coupons/assign", protect.forAdmin, adminController.assignCouponToUser);
router.put("/coupons/:cid", protect.forAdmin, adminController.updateCoupon);
router.put("/users/:uid", protect.forAdmin, adminController.updateUser)
router.get("/users/:id/details", protect.forAdmin, adminController.getUserDetails);
router.delete("/users/:uid", protect.forAdmin, adminController.deleteUser)
router.put("/orders/:oid", protect.forAdmin, adminController.updateOrderStatus)
router.delete("/orders/:oid", protect.forAdmin, adminController.deleteOrder)
router.delete("/coupons/:cid", protect.forAdmin, adminController.deleteCoupon)
router.get("/analytics", protect.forAdmin, adminController.getAnalytics);
export default router;
