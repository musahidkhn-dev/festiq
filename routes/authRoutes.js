import express from "express"
import authController from "../controller/authController.js"
import protect from "../Middleware/authMiddleware.js"
import upload from "../Middleware/imageUploadMiddleware.js"
const router = express.Router()

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.get("/me", protect.forUser, authController.getProfile)
router.put("/me", protect.forUser, authController.updateProfile)
router.put("/avatar", protect.forUser, upload.single('avatar'), authController.updateAvatar)
router.delete("/avatar", protect.forUser, authController.deleteAvatar)
router.put("/me/password", protect.forUser, authController.changePassword)
router.post("/forgot-password", authController.forgotPassword)
router.post("/private", protect.forUser, authController.privateController)


export default router