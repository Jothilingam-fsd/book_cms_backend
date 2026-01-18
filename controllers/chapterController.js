import Chapter from "../models/chapterModel.js";

export const createChapter = async (req, res, next) => {
  try {
    const { bookId, title, order } = req.body;
    
    if (!bookId || !title) {
      return res.status(400).json({ error: 'bookId and title are required' });
    }
    
    const chapter = await Chapter.create({ bookId, title, order });
    
    res.status(201).json({
      message: 'Chapter created successfully',
      chapter
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChapters = async (req, res, next) => {
  try {
    const chapters = await Chapter.findAll();
    res.json({ chapters });
  } catch (error) {
    next(error);
  }
};

export const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.getWithPages(id);
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json({ chapter });
  } catch (error) {
    next(error);
  }
};

export const getChaptersByBookId = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const chapters = await Chapter.findByBookId(bookId);
    
    res.json({ chapters });
  } catch (error) {
    next(error);
  }
};

export const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;
    
    const chapter = await Chapter.update(id, { title, order });
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json({
      message: 'Chapter updated successfully',
      chapter
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Chapter.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default Chapter;