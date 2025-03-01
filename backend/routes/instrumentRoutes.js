import express from "express";
import {
  getInstruments,
  getInstrumentById,
  createInstrument,
  updateInstrument,
  deleteInstrument,
} from "../controllers/instrumentController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getInstruments);
router.get("/:id", getInstrumentById);
router.post("/", upload, createInstrument);
router.put("/:id", upload, updateInstrument);
router.delete("/:id", deleteInstrument);

export default router;
