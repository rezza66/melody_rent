import Payment from "../models/PaymentSchema.js";
import Fine from "../models/FineSchema.js";

// GET all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("fine").populate("user");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a payment
export const createPayment = async (req, res) => {
  const { fine, user, amount, method, paymentDate, status } = req.body;
  try {
    const fineData = await Fine.findById(fine);
    if (!fineData) return res.status(404).json({ message: "Fine not found" });

    const newPayment = new Payment({ fine, user, amount, method, paymentDate, status });
    await newPayment.save();

    // Mark fine as paid
    fineData.status = "Paid";
    await fineData.save();

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
