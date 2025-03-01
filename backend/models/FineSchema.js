import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
  loan: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true }, // ID peminjaman
  amount: { type: Number, required: true }, // Jumlah denda yang harus dibayar
  reason: { type: String, required: true }, // Alasan denda (misal: terlambat atau alat rusak)
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" }, // Status pembayaran denda
  createdAt: { type: Date, default: Date.now }, // Tanggal denda dibuat
});

const Fine = mongoose.model("Fine", fineSchema);
export default Fine;
