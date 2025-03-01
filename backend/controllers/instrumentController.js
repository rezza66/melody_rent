import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Instrument from "../models/InstrumentSchema.js";

// Konversi __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GET all instruments
export const getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find();
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single instrument
export const getInstrumentById = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument)
      return res.status(404).json({ message: "Instrument not found" });
    res.json(instrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new instrument
export const createInstrument = async (req, res) => {
  const { name, type, brand, condition, stock, available } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

  try {
    const newInstrument = new Instrument({
      name,
      type,
      brand,
      condition,
      stock,
      available,
      image,
    });

    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE an instrument
export const updateInstrument = async (req, res) => {
  try {
    // Cari data lama sebelum update
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    let updateData = { ...req.body };

    // Jika ada gambar baru yang diunggah
    if (req.file) {
      // Path gambar lama yang tersimpan di database
      const oldImagePath = instrument.image;

      // Hapus gambar lama jika ada
      if (oldImagePath) {
        const oldImageFullPath = path.join(__dirname, "..", oldImagePath);
        fs.unlink(oldImageFullPath, (err) => {
          if (err) console.log("Gagal menghapus gambar lama:", err);
        });
      }

      // Simpan path gambar baru
      updateData.image = req.file.path.replace(/\\/g, "/");
    } else {
      // Jika tidak ada gambar baru, tetap gunakan gambar lama
      updateData.image = instrument.image;
    }

    // Update data di database
    const updatedInstrument = await Instrument.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedInstrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// DELETE an instrument
export const deleteInstrument = async (req, res) => {
    try {
      // Cari data alat musik berdasarkan ID
      const instrument = await Instrument.findById(req.params.id);
      if (!instrument) {
        return res.status(404).json({ message: "Instrument not found" });
      }
  
      // Jika ada gambar yang tersimpan, hapus dari folder uploads
      if (instrument.image) {
        const imagePath = path.join(__dirname, "..", instrument.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Gagal menghapus gambar:", err);
        });
      }
  
      // Hapus data dari database
      await Instrument.findByIdAndDelete(req.params.id);
  
      res.json({ message: "Instrument deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
