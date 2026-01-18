import Book from "../models/bookModel.js";

export const createBook = async (req, res, next) => {
  try {
    const { title, description, initialPages, indexContent, editorName } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const book = await Book.create({
      title,
      description,
      initialPages: parseInt(initialPages) || 0,
      indexContent,
      editorName: editorName || 'Anonymous'
    });
    
    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.json({ books });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.getWithDetails(id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ book });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const book = await Book.update(id, { title, description });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Book.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default Book;