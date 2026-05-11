import express from "express"
import protect from "../Middleware/authMiddleware.js"
import eventController from "../controller/eventController.js"
import reviewController from "../controller/reviewController.js"
import upload from "../Middleware/imageUploadMiddleware.js"


const router = express.Router()

router.post("/", protect.forAdmin,  upload.single('eventImage'), eventController.createEvent)
router.post("/host", protect.forUser, upload.single('eventImage'), eventController.hostEvent)
router.get("/hosted", protect.forUser, eventController.getMyHostedEvents)
router.get("/creator-analytics", protect.forUser, eventController.getCreatorAnalytics)
router.get("/", eventController.getEvents)
router.get("/:eid", protect.optional, eventController.getEvent)
router.put("/:id/moderate", protect.forAdmin, eventController.moderateEvent)
router.post("/:id/like", protect.forUser, eventController.toggleLike)
router.delete("/:id", protect.forUser, eventController.deleteEvent)
router.put("/:id", protect.forUser, upload.single('eventImage'), eventController.updateEvent)

// Review Routes
router.post("/:eid/reviews", protect.forUser, reviewController.addReview)
router.put("/:eid/reviews/:rid", protect.forUser, reviewController.updateReview)
router.delete("/:eid/reviews/:rid", protect.forUser, reviewController.deleteReview)

 
export default router