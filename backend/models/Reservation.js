const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    borrowDate: {
      type: Date,
      required: [true, "Please add a borrow date"],
      default: Date.now,
    },
    pickupDate: {
      type: Date,
      required: [true, "Please add a pickup date"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// No additional pre-save hooks for now

RequestSchema.virtual("userInfo", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

RequestSchema.virtual("bookInfo", {
  ref: "Book",
  localField: "book",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Reservation", RequestSchema);


