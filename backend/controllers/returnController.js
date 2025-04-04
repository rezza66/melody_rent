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

export const getReturnUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const returns = await Return.find()
      .populate({
        path: "loan",
        match: { user: userId },
        populate: {
          path: "instrument",
          select: "name category",
          populate: { path: "category", select: "name" },
        },
      })
      .lean()
      .exec();

    const filteredReturns = returns.filter((r) => r.loan);

    const enhancedReturns = await Promise.all(
      filteredReturns.map(async (returnItem) => {
        const fineRecord = await Fine.findOne({ loan: returnItem.loan._id });
        return {
          ...returnItem,
          fineRecord,
        };
      })
    );

    res.json(enhancedReturns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const returnInstrument = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { returnDate, condition } = req.body;

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

    // Konversi tanggal
    const returnDateObj = new Date(returnDate);
    const endDate = new Date(loan.endDate);

    let fineAmount = 0;
    let fineReason = "";

    // ✅ Hitung keterlambatan berdasarkan `endDate` alat ini
    if (returnDateObj > endDate) {
      const delayDays = Math.ceil((returnDateObj - endDate) / (1000 * 60 * 60 * 24));
      fineAmount = delayDays * 10000 * loan.quantity; // Denda Rp10.000 per hari per alat
      fineReason = `Late return by ${delayDays} days`;
    }

    // ✅ Cek apakah alat dikembalikan dalam kondisi rusak
    if (condition === "damaged") {
      fineAmount += 50000 * loan.quantity; // Tambahan denda Rp50.000 per alat jika rusak
      fineReason += fineReason ? " & damaged instrument" : "Damaged instrument";
    }

    // ✅ Simpan denda jika ada
    let fineRecord = null;
    if (fineAmount > 0) {
      fineRecord = await Fine.create({
        loan: loan._id,
        amount: fineAmount,
        reason: fineReason,
      });
    }

    // ✅ Simpan data pengembalian alat musik
    const returnRecord = await Return.create({
      loan: loan._id,
      condition: condition,
      returnDate: returnDateObj,
    });

    // ✅ Update status peminjaman
    loan.status = "returned";
    await loan.save();

    // ✅ Kembalikan stok alat musik
    instrument.stock += loan.quantity;
    instrument.available = true;
    await instrument.save();

    res.json({
      message: "Instrument returned successfully",
      updatedLoan: loan,
      returnRecord: returnRecord,
      fineRecord: fineRecord, // Denda ditampilkan jika ada
      totalAmountDue: loan.totalRentalFee + fineAmount, // Total yang harus dibayar user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





