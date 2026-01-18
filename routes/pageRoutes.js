import express from 'express';
import { createPage, getAllPages, getPagesByChapterId, getPageById, updatePage, deletePage, getVersionHistory, getVersionContent, restoreVersion } from '../controllers/pageController.js';

const router = express.Router();

router.post('/create', createPage);
router.get('/getall', getAllPages);
router.get('/chapter/:chapterId', getPagesByChapterId);
router.get('/:id', getPageById);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);
router.get('/:pageid/versions', getVersionHistory);
router.get('/:pageid/versions/:versionNumber', getVersionContent);
router.post('/:pageid/restore/:versionNumber', restoreVersion);

export default router;