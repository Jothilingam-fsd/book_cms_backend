import express from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Book routes are working!' });
});

router.post('/create', createBook);
router.get('/getall', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;