import express from "express";
import protect from "../Middleware/authMiddleware.js";
import orderController from "../controller/orderController.js";

const router = express.Router();

// Static Routes FIRST
router.get("/", protect.forUser, orderController.getTickets);

// Dynamic Routes AFTER static routes
router.get("/:id", protect.forUser, orderController.getTicket);
router.put("/:id", protect.forUser, orderController.cancelTicket);
router.post("/:eid", protect.forUser, orderController.bookTicket);
router.patch("/:id/status", protect.forUser, orderController.updateCreatorOrderStatus);

export default router;
