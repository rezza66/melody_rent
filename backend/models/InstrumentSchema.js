import mongoose from "mongoose";

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  type: { type: String, required: true }, // Jenis alat musik (misal: gitar, piano, drum)
  brand: { type: String }, // Merek alat musik
  stock: { type: Number, required: true, min: 0 }, // Jumlah alat musik yang tersedia
  pricePerDay: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  condition: { type: String, enum: ["new", "good", "fair", "damaged"], default: "good" }, // Kondisi alat musik
  available: { type: Boolean, default: true }, // Ketersediaan alat musik
  createdAt: { type: Date, default: Date.now }, // Tanggal alat musik ditambahkan
});

const Instrument = mongoose.model("Instrument", instrumentSchema);
export default Instrument;
