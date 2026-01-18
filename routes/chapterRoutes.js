import express from 'express';
import { createChapter, getAllChapters, getChapterById, getChaptersByBookId, updateChapter, deleteChapter } from '../controllers/chapterController.js';

const router = express.Router();

router.post('/create', createChapter);
router.get('/getall', getAllChapters);
router.get('/:id', getChapterById);
router.get('/book/:bookId', getChaptersByBookId);
router.put('/:id', updateChapter);
router.delete('/:id', deleteChapter);

export default router;

