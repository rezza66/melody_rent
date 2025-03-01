import express from "express";
import { getReturns, createReturn, returnInstrument } from "../controllers/returnController.js";

const router = express.Router();

router.get("/", getReturns);
router.post("/", createReturn);
router.post("/:loanId", returnInstrument);

export default router;
