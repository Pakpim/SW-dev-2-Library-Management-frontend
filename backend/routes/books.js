const express = require("express");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateBookStock,
} = require("../controllers/books");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - ISBN
 *         - publisher
 *         - availableAmount
 *         - coverPicture
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Author name
 *         ISBN:
 *           type: string
 *           description: Book ISBN
 *         publisher:
 *           type: string
 *           description: Book publisher
 *         availableAmount:
 *           type: number
 *           description: Available copies
 *         coverPicture:
 *           type: string
 *           description: URL to cover picture
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookCreate:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - ISBN
 *         - publisher
 *         - availableAmount
 *         - coverPicture
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         publisher:
 *           type: string
 *         availableAmount:
 *           type: number
 *         coverPicture:
 *           type: string
 *     BookUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         publisher:
 *           type: string
 *         availableAmount:
 *           type: number
 *         coverPicture:
 *           type: string
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *     responses:
 *       201:
 *         description: Book created
 */
router.route("/").get(getBooks).post(protect, authorize("admin"), createBook);
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete (soft) a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("admin"), updateBook)
  .delete(protect, authorize("admin"), deleteBook);
/**
 * @swagger
 * /books/{id}/stock:
 *   put:
 *     summary: Update available copies for a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availableAmount:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid amount
 *       404:
 *         description: Book not found
 */
router.route("/:id/stock").put(protect, authorize("admin"), updateBookStock);

module.exports = router;


