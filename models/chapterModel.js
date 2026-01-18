import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

class Chapter {
  static async create(chapterData) {
    await db.read();
    
    // Auto-generate order if not provided
    const existingChapters = db.data.chapters.filter(c => c.bookId === chapterData.bookId);
    const order = chapterData.order ?? existingChapters.length + 1;
    
    const newChapter = {
      id: uuidv4(),
      bookId: chapterData.bookId,
      title: chapterData.title,
      order: order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.data.chapters.push(newChapter);
    await db.write();
    
    return newChapter;
  }
  
  static async findAll() {
    await db.read();
    return db.data.chapters;
  }
  
  static async findById(id) {
    await db.read();
    return db.data.chapters.find(chapter => chapter.id === id);
  }
  
  static async findByBookId(bookId) {
    await db.read();
    return db.data.chapters
      .filter(chapter => chapter.bookId === bookId)
      .sort((a, b) => a.order - b.order);
  }
  
  static async update(id, updateData) {
    await db.read();
    const index = db.data.chapters.findIndex(chapter => chapter.id === id);
    
    if (index === -1) return null;
    
    db.data.chapters[index] = {
      ...db.data.chapters[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await db.write();
    return db.data.chapters[index];
  }
  
  static async delete(id) {
    await db.read();
    const index = db.data.chapters.findIndex(chapter => chapter.id === id);
    
    if (index === -1) return false;
    
    db.data.chapters.splice(index, 1);
    await db.write();
    return true;
  }
  
  static async getWithPages(id) {
    await db.read();
    const chapter = db.data.chapters.find(c => c.id === id);
    if (!chapter) return null;
    
    const pages = db.data.pages.filter(p => p.chapterId === id);
    
    return {
      ...chapter,
      pages
    };
  }
}

export default Chapter;