import express from "express";
import { getReturns, getReturnUser, returnInstrument } from "../controllers/returnController.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("read", "return"), getReturns);
router.get("/my-return", protect, authorize("read", "return"), getReturnUser);
router.post("/:loanId", protect, authorize("create", "return"), returnInstrument);

export default router;
