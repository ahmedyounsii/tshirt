const express = require("express");
const Category = require("../models/Category");
const Design = require("../models/Design");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const designs = await Category.find();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all_designs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;
    const search = req.query.search || "";

    const query = search
      ? { label: { $regex: search, $options: "i" } } // case-insensitive search
      : {};

    const [designs, count] = await Promise.all([
      Design.find(query).skip(skip).limit(size),
      Design.countDocuments(query),
    ]);

    res.json({
      items: designs,
      count,
      page,
      size,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  const search = req.query.label || "";
  try {
    const categories = await Category.find({
      label: { $regex: search, $options: "i" }, // case-insensitive partial match
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;
    const search = req.query.search || "";

    const category = await Category.findById(req.params.id).populate({
      path: "designs",
      match: { label: { $regex: search, $options: "i" } }, // Case-insensitive search
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const allDesigns = category.designs || [];
    const paginatedDesigns = allDesigns.slice(skip, skip + size);

    res.json({
      items: paginatedDesigns,
      count: allDesigns.length,
      page: page,
      size: size,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { label } = req.body;
    const category = new Category({
      label,
    });

    await category.save();

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // duplicate key error for unique id
      return res
        .status(409)
        .json({ message: "Category with this id already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
