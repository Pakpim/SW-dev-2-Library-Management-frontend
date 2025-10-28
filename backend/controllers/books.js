const Book = require("../models/Book");
const mongoose = require("mongoose");

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const products = await Book.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid book id" });
    }
    const product = await Book.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private (Admin only)
exports.createBook = async (req, res, next) => {
  try {
    const product = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/v1/books/:id
// @access  Private (Admin only)
exports.updateBook = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid book id" });
    }
    let product = await Book.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    product = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// @access  Private (Admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid book id" });
    }
    const product = await Book.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Hard delete
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update availableAmount
// @route   PUT /api/v1/books/:id/stock
// @access  Private (Admin only)
exports.updateBookStock = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid book id" });
    }
    const { availableAmount } = req.body;

    if (availableAmount < 0) {
      return res.status(400).json({
        success: false,
        error: "Available amount cannot be negative",
      });
    }

    const product = await Book.findByIdAndUpdate(
      req.params.id,
      { availableAmount },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


