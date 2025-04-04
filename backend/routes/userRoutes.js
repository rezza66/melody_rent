import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize('read', 'user'), getUsers);
router.get("/me", protect, authorize('read', 'user'), getUserProfile);
router.get("/:id", protect, authorize('read', 'user'), getUserById);
router.post("/", protect, authorize('create', 'user'), upload, createUser);
router.put("/:id", protect, authorize('update', 'user'), upload, updateUser);
router.delete("/:id", protect, authorize('delete', 'user'), deleteUser);

export default router;
