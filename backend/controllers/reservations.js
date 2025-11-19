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
      return res
        .status(400)
        .json({ success: false, error: "Invalid reservation id" });
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

    if (
      req.user.role === "member" &&
      request.user._id.toString() !== req.user.id
    ) {
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
        error: "Only members can create reservations",
      });
    }

    // Check for pending/approved reservations only (not rejected)
    const existingCount = await Reservation.countDocuments({
      user: req.user.id,
      status: { $in: ["pending", "approved"] },
    });

    if (existingCount >= 3) {
      return res.status(400).json({
        success: false,
        error: "Reservation limit reached (max 3 active reservations)",
      });
    }

    // Validation: reservation date must not be before today
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
        error: "Reservation date cannot be before today",
      });
    }

    if (pickupDate < today) {
      return res.status(400).json({
        success: false,
        error: "Pickup date cannot be before today",
      });
    }

    if (pickupDate < borrowDate) {
      return res.status(400).json({
        success: false,
        error: "Pickup date must not be earlier than reservation date",
      });
    }

    const book = await Book.findById(req.body.book);

    if (!book) {
      return res.status(400).json({
        success: false,
        error: "Book not found",
      });
    }

    // Create reservation request with pending status (no book availability update)
    const request = await Reservation.create({
      ...req.body,
      user: req.user.id,
      status: "pending",
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
      return res
        .status(400)
        .json({ success: false, error: "Invalid reservation id" });
    }
    let request = await Reservation.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Reservation not found",
      });
    }

    // Members can only edit their own pending reservations
    if (req.user.role === "member") {
      if (request.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to edit this reservation",
        });
      }
      // Members cannot change status
      if (req.body.status) {
        return res.status(403).json({
          success: false,
          error: "Members cannot change reservation status",
        });
      }
    }

    // Validation: dates must not be before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (req.body.borrowDate) {
      const borrowDate = new Date(req.body.borrowDate);
      if (isNaN(borrowDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid reservation (borrow) date",
        });
      }
      if (borrowDate < today) {
        return res.status(400).json({
          success: false,
          error: "Reservation date cannot be before today",
        });
      }
    }

    if (req.body.pickupDate) {
      const pickupDate = new Date(req.body.pickupDate);
      if (isNaN(pickupDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid pickup date",
        });
      }
      if (pickupDate < today) {
        return res.status(400).json({
          success: false,
          error: "Pickup date cannot be before today",
        });
      }
    }

    if (req.body.borrowDate && req.body.pickupDate) {
      const borrowDate = new Date(req.body.borrowDate);
      const pickupDate = new Date(req.body.pickupDate);
      if (pickupDate < borrowDate) {
        return res.status(400).json({
          success: false,
          error: "Pickup date must not be earlier than reservation date",
        });
      }
    }

    request = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email role")
      .populate("book", "title author ISBN publisher availableAmount");

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
      return res
        .status(400)
        .json({ success: false, error: "Invalid reservation id" });
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
