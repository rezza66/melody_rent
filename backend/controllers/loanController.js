import Loan from "../models/LoanSchema.js";
import Instrument from "../models/InstrumentSchema.js";

// GET all loans
export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user").populate("instrument");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single loan
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("user").populate("instrument");
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new loan
export const createLoan = async (req, res) => {
  const { user, instrument, quantity, startDate, endDate, status } = req.body;
  
  try {
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const instrumentData = await Instrument.findById(instrument);
    if (!instrumentData) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    if (!instrumentData.available || instrumentData.stock < quantity) {
      return res.status(400).json({ message: "Instrument is not available or insufficient stock" });
    }

    const newLoan = new Loan({ user, instrument, quantity, startDate, endDate, status });
    await newLoan.save();

    // Kurangi stok alat musik
    instrumentData.stock -= quantity;
    if (instrumentData.stock === 0) {
      instrumentData.available = false;
    }
    await instrumentData.save();

    // Tambahkan logika untuk menangani error spesifik
    if (!newLoan) {
      return res.status(500).json({ message: "Failed to create loan" });
    }

    res.status(201).json(newLoan);
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE a loan
export const updateLoan = async (req, res) => {
  try {
    const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLoan) return res.status(404).json({ message: "Loan not found" });
    res.json(updatedLoan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a loan
export const deleteLoan = async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
