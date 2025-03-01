import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", upload, createUser);
router.put("/:id", upload, updateUser);
router.delete("/:id", deleteUser);

export default router;
