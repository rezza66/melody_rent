import express from "express";
import { getFines, createFine } from "../controllers/fineController.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("read", "fine"), getFines);
router.post("/", protect, authorize("create", "fine"), createFine);

export default router;
