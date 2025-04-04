import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, authorize('create', 'category'), createCategory);
router.put("/:id", protect, authorize('update', 'category'), updateCategory);
router.delete("/:id", protect, authorize('delete', 'category'), deleteCategory);

export default router;
