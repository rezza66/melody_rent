import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Instrument from "../models/InstrumentSchema.js";
import Category from "../models/CategorySchema.js"; // Import model Category

// Konversi __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GET all instruments (dengan kategori)
export const getInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find().populate("category");
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single instrument (dengan kategori)
export const getInstrumentById = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id).populate("category");
    if (!instrument) return res.status(404).json({ message: "Instrument not found" });
    res.json(instrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new instrument (dengan kategori)
export const createInstrument = async (req, res) => {
  const { name, type, brand, condition, stock, pricePerDay, description, available, category } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

  try {
    // Periksa apakah kategori valid
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const newInstrument = new Instrument({
      name,
      type,
      brand,
      condition,
      stock,
      pricePerDay,
      description,
      available,
      category,
      image,
    });

    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE an instrument (termasuk kategori)
export const updateInstrument = async (req, res) => {
  try {
    // Cari data lama sebelum update
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    let updateData = { ...req.body };

    // Periksa apakah kategori valid jika diubah
    if (req.body.category) {
      const existingCategory = await Category.findById(req.body.category);
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    // Jika ada gambar baru yang diunggah
    if (req.file) {
      const oldImagePath = instrument.image;
      if (oldImagePath) {
        const oldImageFullPath = path.join(__dirname, "..", oldImagePath);
        fs.unlink(oldImageFullPath, (err) => {
          if (err) console.log("Gagal menghapus gambar lama:", err);
        });
      }

      // Simpan path gambar baru
      updateData.image = req.file.path.replace(/\\/g, "/");
    } else {
      updateData.image = instrument.image;
    }

    // Update data di database
    const updatedInstrument = await Instrument.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category");

    res.json(updatedInstrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE an instrument
export const deleteInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Hapus gambar jika ada
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
