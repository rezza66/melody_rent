import Loan from "../models/LoanSchema.js";
import Instrument from "../models/InstrumentSchema.js";

// GET all loans
export const getLoans = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query with pagination and populate
    const loans = await Loan.find()
      .populate("user")
      .populate("instrument")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Count total documents for pagination
    const total = await Loan.countDocuments();

    res.json({
      data: loans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || 'Server error' });
  }
};


export const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id })
      .populate("user", "name email") 
      .populate({
        path: "instrument",
        select: "_id name category", 
        populate: {
          path: "category", 
          select: "name", 
        },
      });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserLoanStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }

    // Ambil semua peminjaman user
    const userLoans = await Loan.find({ user: userId }).select("status");

    res.status(200).json(userLoans);
  } catch (error) {
    console.error("Error fetching user loan status:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
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
  try {
    const { user, instruments } = req.body;

    if (!user || !instruments || !Array.isArray(instruments) || instruments.length === 0) {
      return res.status(400).json({ message: "User and at least one instrument are required." });
    }

    // Batasi peminjaman maksimal 2 alat
    const userLoanCount = await Loan.countDocuments({ user, status: "ongoing" });
    if (userLoanCount + instruments.length > 2) {
      return res.status(400).json({ message: "Kamu hanya bisa meminjam maksimal 2 alat musik." });
    }

    let newLoans = [];

    for (const item of instruments) {
      const { instrumentId, quantity, startDate, endDate } = item;

      if (!instrumentId || quantity < 1 || !startDate || !endDate) {
        return res.status(400).json({ message: "Instrument ID, quantity, startDate, and endDate must be provided." });
      }

      const instrumentData = await Instrument.findById(instrumentId);
      if (!instrumentData) {
        return res.status(404).json({ message: `Instrument ${instrumentId} not found.` });
      }

      if (instrumentData.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock available for ${instrumentData.name}.` });
      }

      // Hitung lama peminjaman per alat
      const rentalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

      if (rentalDays <= 0) {
        return res.status(400).json({ message: "End date must be after start date." });
      }

      // Hitung total biaya sewa per alat
      const totalRentalFee = rentalDays * instrumentData.pricePerDay * quantity;

      // Simpan peminjaman ke database
      const newLoan = new Loan({
        user,
        instrument: instrumentId,
        quantity,
        startDate,
        endDate,
        totalRentalFee,
        status: "ongoing",
      });

      await newLoan.save();
      newLoans.push(newLoan);

      // Update stok alat musik
      instrumentData.stock -= quantity;
      instrumentData.available = instrumentData.stock > 0;
      await instrumentData.save();
    }

    res.status(201).json({ message: "Peminjaman berhasil!", loans: newLoans });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};




export const getUserLoanCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }

    const loanCount = await Loan.countDocuments({ user: userId });

    res.status(200).json({ count: loanCount });
  } catch (error) {
    console.error("Error fetching loan count:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
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
