import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  loan: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true }, // ID peminjaman
  condition: { type: String, enum: ["good", "damaged"], default: "good" }, // Kondisi alat saat dikembalikan
  returnDate: { type: Date, required: true }, // Tanggal pengembalian
  createdAt: { type: Date, default: Date.now }, // Tanggal data pengembalian dibuat
});

const Return = mongoose.model("Return", returnSchema);
export default Return;
