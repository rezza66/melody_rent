import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  fine: { type: mongoose.Schema.Types.ObjectId, ref: "Fine", required: true }, // ID denda yang dibayar
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ID pengguna yang membayar
  amount: { type: Number, required: true }, // Jumlah pembayaran
  method: { type: String, enum: ["cash", "transfer"], required: true }, // Metode pembayaran
  paymentDate: { type: Date, required: true }, // Tanggal pembayaran
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // Status pembayaran
  createdAt: { type: Date, default: Date.now }, // Tanggal data pembayaran dibuat
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
