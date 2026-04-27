import express from "express"
import authController from "../controller/authController.js"
import protect from "../Middleware/authMiddleware.js"
const router = express.Router()

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.post("/private", protect.forUser, authController.privateController)


export default router