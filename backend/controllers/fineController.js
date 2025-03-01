import Fine from "../models/FineSchema.js";
import Loan from "../models/LoanSchema.js";

// GET all fines
export const getFines = async (req, res) => {
  try {
    const fines = await Fine.find().populate("loan");
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a fine
export const createFine = async (req, res) => {
  const { loan, amount, reason, status } = req.body;
  try {
    const loanData = await Loan.findById(loan);
    if (!loanData) return res.status(404).json({ message: "Loan not found" });

    const newFine = new Fine({ loan, amount, reason, status });
    await newFine.save();
    res.status(201).json(newFine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
