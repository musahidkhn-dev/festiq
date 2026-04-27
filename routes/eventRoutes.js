import express from "express"
import protect from "../Middleware/authMiddleware.js"
import eventController from "../controller/eventController.js"
import upload from "../Middleware/imageUploadMiddleware.js"


const router = express.Router()

router.post("/", protect.forUser,  upload.single('eventImage'), eventController.createEvent)
router.get("/", eventController.getEvents)
router.get("/:eid", eventController.getEvent)

 
export default router