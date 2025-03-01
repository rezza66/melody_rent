import express from "express";
import { getFines, createFine } from "../controllers/fineController.js";

const router = express.Router();

router.get("/", getFines);
router.post("/", createFine);

export default router;
