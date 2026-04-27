import express from "express"
import commentController from "../controller/conmmentController.js"
import protect from "../Middleware/authMiddleware.js"

const router = express.Router()

router.get("/:eid", commentController.getComments)
router.post("/:eid", protect.forUser, commentController.addComment)

export default router