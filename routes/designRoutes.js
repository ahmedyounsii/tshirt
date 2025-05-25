const express = require("express");
const Design = require("../models/Design");
const Category = require("../models/Category");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  const { label, categoryId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Save design with file path
    const design = new Design({
      url: `/uploads/${file.filename}`,
      label,
    });
    await design.save();

    category.designs.push(design._id);
    await category.save();

    res.status(201).json({ design, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
