import express from "express";
import { getReturns, createReturn, returnInstrument } from "../controllers/returnController.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("read", "return"), getReturns);
router.post("/", protect, authorize("cretae", "return"), createReturn);
router.post("/:loanId", protect, authorize("create", "return"), returnInstrument);

export default router;
