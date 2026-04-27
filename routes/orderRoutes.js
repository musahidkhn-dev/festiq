import express from "express";
import protect from "../Middleware/authMiddleware.js";
import orderController from "../controller/orderController.js";

const router = express.Router();

router.get("/", protect.forUser, orderController.getTickets);
router.get("/:tid", protect.forUser, orderController.getTicket);
router.put("/:tid", protect.forUser, orderController.cancelTicket);
router.post("/:eid", protect.forUser, orderController.bookTicket);

export default router;
