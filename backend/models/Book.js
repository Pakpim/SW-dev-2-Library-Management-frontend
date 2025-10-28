const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a book title"],
      unique: true,
      trim: true,
      maxlength: [200, "Book title cannot be more than 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
      maxlength: [100, "Author cannot be more than 100 characters"],
    },
    ISBN: {
      type: String,
      required: [true, "Please add an ISBN"],
      unique: true,
      trim: true,
      maxlength: [20, "ISBN cannot be more than 20 characters"],
    },
    publisher: {
      type: String,
      required: [true, "Please add a publisher"],
      trim: true,
      maxlength: [100, "Publisher cannot be more than 100 characters"],
    },
    availableAmount: {
      type: Number,
      required: [true, "Please add available amount"],
      min: [0, "Available amount cannot be negative"],
      default: 0,
    },
    coverPicture: {
      type: String,
      required: [true, "Please add URL to cover picture"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals for reservations
ProductSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "book",
  justOne: false,
});

module.exports = mongoose.model("Book", ProductSchema);


