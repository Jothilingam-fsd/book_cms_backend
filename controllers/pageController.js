import Page from "../models/pageModel.js";

export const createPage = async (req, res, next) => {
  try {
    const { title, content, bookId, chapterId, editorName } = req.body;
    
    if (!title || !bookId) {
      return res.status(400).json({ error: 'title and bookId are required' });
    }
    
    const page = await Page.create({
      title,
      content: content || '',
      bookId,
      chapterId,
      editorName: editorName || 'Anonymous'
    });
    
    res.status(201).json({
      message: 'Page created successfully',
      page
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPages = async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.json({ pages });
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get current content
    const currentContent = await Page.getCurrentContent(id);
    
    res.json({
      page: {
        ...page,
        content: currentContent?.content || ''
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPagesByChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const pages = await Page.findByChapterId(chapterId);
    
    res.json({ pages });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, editorName } = req.body;
    
    const page = await Page.update(id, { title, content }, editorName || 'Anonymous');
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({
      message: 'Page updated successfully',
      page
    });
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Page.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getVersionHistory = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const versions = await Page.getVersionHistory(pageId);
    
    res.json({ versions });
  } catch (error) {
    next(error);
  }
};

export const getVersionContent = async (req, res, next) => {
  try {
    const { pageId, versionNumber } = req.params;
    const version = await Page.getVersionContent(pageId, parseInt(versionNumber));
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    res.json({ version });
  } catch (error) {
    next(error);
  }
};

export const restoreVersion = async (req, res, next) => {
  try {
    const { pageId, versionNumber } = req.params;
    const { editorName } = req.body;
    
    const result = await Page.restoreVersion(
      pageId,
      parseInt(versionNumber),
      editorName || 'Anonymous'
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Page or version not found' });
    }
    
    res.json({
      message: `Version ${versionNumber} restored successfully as version ${result.page.currentVersion}`,
      result
    });
  } catch (error) {
    next(error);
  }
};

export default Page;

