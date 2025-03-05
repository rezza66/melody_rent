import express from "express";
import {
  getInstruments,
  getInstrumentById,
  createInstrument,
  updateInstrument,
  deleteInstrument,
} from "../controllers/instrumentController.js";
import upload from "../config/multer.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getInstruments);
router.get("/:id", getInstrumentById);
router.post("/", protect, authorize('create', 'instrument'), upload, createInstrument);
router.put("/:id", protect, authorize('update', 'instrument'), upload, updateInstrument);
router.delete("/:id", protect, authorize('delete', 'instrument'), deleteInstrument);

export default router;
