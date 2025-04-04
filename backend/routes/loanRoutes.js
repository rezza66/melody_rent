import express from "express";
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getUserLoans,
  getUserLoanCount,
  getUserLoanStatus,
} from "../controllers/loanController.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("read", "loan"), getLoans);
router.get("/my-loans", protect, authorize("read", "loan"), getUserLoans);
router.get("/count", protect, authorize("read", "loan"), getUserLoanCount);
router.get("/status", protect, authorize("read", "loan"), getUserLoanStatus);
router.get("/:id", protect, authorize("read", "loan"), getLoanById);
router.post("/", protect, authorize("create", "loan"), createLoan);
router.put("/:id", protect, authorize("update", "loan"),updateLoan);
router.delete("/:id", protect, authorize("delete", "loan"), deleteLoan);

export default router;
