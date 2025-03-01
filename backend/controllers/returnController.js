import Return from "../models/ReturnSchema.js";
import Loan from "../models/LoanSchema.js";
import Instrument from "../models/InstrumentSchema.js";
import Fine from "../models/FineSchema.js";

// GET all returns
export const getReturns = async (req, res) => {
  try {
    const returns = await Return.find().populate("loan");
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new return
export const createReturn = async (req, res) => {
  const { loan, condition, returnDate } = req.body;
  try {
    const loanData = await Loan.findById(loan);
    if (!loanData) return res.status(404).json({ message: "Loan not found" });

    const newReturn = new Return({ loan, condition, returnDate });
    await newReturn.save();

    // Update instrument availability
    const instrument = await Instrument.findById(loanData.instrument);
    if (instrument) {
      instrument.available = true;
      await instrument.save();
    }

    res.status(201).json(newReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const returnInstrument = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { returnDate, condition } = req.body; // Tambahkan condition untuk mencatat kondisi alat

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status === "returned") {
      return res.status(400).json({ message: "Instrument already returned" });
    }

    const instrument = await Instrument.findById(loan.instrument);
    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Hitung denda jika ada keterlambatan
    const endDate = new Date(loan.endDate);
    const returnDateObj = new Date(returnDate);
    let fineAmount = 0;
    let fineReason = "";

    if (returnDateObj > endDate) {
      const delayDays = Math.ceil((returnDateObj - endDate) / (1000 * 60 * 60 * 24));
      fineAmount = delayDays * 10000; // Rp10.000 per hari keterlambatan
      fineReason = `Late return by ${delayDays} days`;
    }

    // Cek apakah alat dikembalikan dalam kondisi rusak
    if (condition === "damaged") {
      fineAmount += 50000; // Tambahan denda Rp50.000 jika rusak
      fineReason += fineReason ? " & damaged instrument" : "Damaged instrument";
    }

    // Simpan denda jika ada
    let fineRecord = null;
    if (fineAmount > 0) {
      fineRecord = await Fine.create({
        loan: loan._id,
        amount: fineAmount,
        reason: fineReason,
      });
    }

    // Simpan data pengembalian
    const returnRecord = await Return.create({
      loan: loan._id,
      condition: condition,
      returnDate: returnDateObj,
    });

    // Update status peminjaman
    loan.status = "returned";
    await loan.save();

    // Kembalikan stok alat musik
    instrument.stock += loan.quantity;
    instrument.available = true;
    await instrument.save();

    res.json({
      message: "Instrument returned successfully",
      updatedLoan: loan,
      returnRecord: returnRecord, // Tambahkan returnRecord ke respons
      fineRecord: fineRecord, // Tampilkan denda jika ada
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




