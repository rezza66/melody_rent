import Category from "../models/CategorySchema.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new category
export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Periksa apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Cek apakah kategori yang diperbarui sudah ada dengan nama yang sama
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
