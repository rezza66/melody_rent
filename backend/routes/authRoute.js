import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import upload from "../config/multer.js";
const router = express.Router()

router.post('/register', upload, registerUser )
router.post('/login', loginUser)

export default router;