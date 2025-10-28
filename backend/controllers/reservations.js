const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const mongoose = require("mongoose");

// @desc    Get all reservations (Admin only) or user's own (Member)
// @route   GET /api/v1/reservations
// @access  Private
exports.getReservations = async (req, res, next) => {
  try {
    let requests;
    
    if (req.user.role === "admin") {
      requests = await Reservation.find()
        .populate("user", "name email role")
        .populate("book", "title author ISBN publisher availableAmount");
    } else {
      requests = await Reservation.find({ user: req.user.id })
        .populate("user", "name email role")
        .populate("book", "title author ISBN publisher availableAmount");
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reservation by ID
// @route   GET /api/v1/reservations/:id
// @access  Private
exports.getReservation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid reservation id" });
    }
    const request = await Reservation.findById(req.params.id)
      .populate("user", "name email role")
      .populate("book", "title author ISBN publisher availableAmount");

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Reservation not found",
      });
    }

    if (req.user.role === "member" && request.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this reservation",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new reservation (Member only, max 3)
// @route   POST /api/v1/reservations
// @access  Private (Member only)
exports.createReservation = async (req, res, next) => {
  try {
    if (req.user.role !== "member") {
      return res.status(403).json({
        success: false,
        error: "Only member can create reservations",
      });
    }

    const existingCount = await Reservation.countDocuments({ user: req.user.id });
    if (existingCount >= 3) {
      return res.status(400).json({
        success: false,
        error: "Reservation limit reached (max 3)",
      });
    }

    // Validation: reservation date must not be earlier than today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const borrowDate = new Date(req.body.borrowDate);
    const pickupDate = new Date(req.body.pickupDate);
    if (isNaN(borrowDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid reservation (borrow) date",
      });
    }
    if (isNaN(pickupDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid pickup date",
      });
    }
    if (borrowDate < today) {
      return res.status(400).json({
        success: false,
        error: "Reservation date must not be earlier than today",
      });
    }
    if (pickupDate < borrowDate) {
      return res.status(400).json({
        success: false,
        error: "Pick-up date must not be earlier than reservation date",
      });
    }

    const book = await Book.findById(req.body.book);
    if (!book) {
      return res.status(400).json({
        success: false,
        error: "Book not found",
      });
    }

    const request = await Reservation.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation
// @route   PUT /api/v1/reservations/:id
// @access  Private
exports.updateReservation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid reservation id" });
    }
    let request = await Reservation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Reservation not found",
      });
    }

    if (req.user.role === "member" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to edit this reservation",
      });
    }

    // Validation: reservation date must not be earlier than today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const borrowDate = new Date(req.body.borrowDate);
    const pickupDate = new Date(req.body.pickupDate);
    if (req.body.borrowDate && isNaN(borrowDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid reservation (borrow) date",
      });
    }
    if (req.body.pickupDate && isNaN(pickupDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid pickup date",
      });
    }
    if (req.body.borrowDate && borrowDate < today) {
      return res.status(400).json({
        success: false,
        error: "Reservation date must not be earlier than today",
      });
    }
    if (req.body.borrowDate && req.body.pickupDate && pickupDate < borrowDate) {
      return res.status(400).json({
        success: false,
        error: "Pick-up date must not be earlier than reservation date",
      });
    }

    request = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reservation
// @route   DELETE /api/v1/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid reservation id" });
    }
    const request = await Reservation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Reservation not found",
      });
    }

    if (req.user.role === "member" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this reservation",
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


