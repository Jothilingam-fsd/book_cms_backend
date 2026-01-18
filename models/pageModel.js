import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSIONS_DIR = path.join(__dirname, '../storage/versions');

if (!fsSync.existsSync(VERSIONS_DIR)) {
  fsSync.mkdirSync(VERSIONS_DIR, { recursive: true });
}

class Page {
  static async create(pageData) {
    await db.read();

    const newPage = {
      id: uuidv4(),
      title: pageData.title,
      bookId: pageData.bookId,
      chapterId: pageData.chapterId || null,
      isIndexPage: pageData.isIndexPage || false,
      currentVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.pages.push(newPage);

    const version = await this._createVersion(
      newPage.id,
      1,
      pageData.content,
      pageData.editorName
    );

    db.data.versions.push(version);
    await db.write();

    return newPage;
  }

  static async _createVersion(pageId, versionNumber, content, editorName) {
    const versionId = uuidv4();
    const fileName = `${pageId}_v${versionNumber}_${versionId}.txt`;
    const filePath = path.join(VERSIONS_DIR, fileName);

    await fs.writeFile(filePath, content ?? '', 'utf-8');

    return {
      id: versionId,
      pageId,
      versionNumber,
      fileName,
      editorName,
      timestamp: new Date().toISOString()
    };
  }

  static async findAll() {
    await db.read();
    return db.data.pages;
  }

  static async findById(id) {
    await db.read();
    return db.data.pages.find(p => p.id === id);
  }

  static async findByChapterId(chapterId) {
    await db.read();
    return db.data.pages.filter(p => p.chapterId === chapterId);
  }

  static async findByBookId(bookId) {
    await db.read();
    return db.data.pages.filter(p => p.bookId === bookId);
  }

  static async update(id, updateData, editorName) {
    await db.read();
    const page = db.data.pages.find(p => p.id === id);

    if (!page) return null;

    if (updateData.content !== undefined) {
      const newVersionNumber = page.currentVersion + 1;

      const version = await this._createVersion(
        id,
        newVersionNumber,
        updateData.content,
        editorName
      );

      db.data.versions.push(version);
      page.currentVersion = newVersionNumber;
    }

    if (updateData.title) page.title = updateData.title;
    page.updatedAt = new Date().toISOString();

    await db.write();
    return page;
  }

  static async delete(id) {
    await db.read();
    const index = db.data.pages.findIndex(p => p.id === id);

    if (index === -1) return false;

    db.data.pages.splice(index, 1);
    db.data.versions = db.data.versions.filter(v => v.pageId !== id);
    await db.write();

    try {
      const files = await fs.readdir(VERSIONS_DIR);
      const pageFiles = files.filter(f => f.startsWith(`${id}_`));
      await Promise.all(
        pageFiles.map(f => fs.unlink(path.join(VERSIONS_DIR, f)))
      );
    } catch (err) {
      console.error('Version cleanup error:', err.message);
    }

    return true;
  }

  static async getVersionHistory(pageId) {
    await db.read();
    return db.data.versions
      .filter(v => v.pageId === pageId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  static async getVersionContent(pageId, versionNumber) {
    await db.read();
    const version = db.data.versions.find(
      v => v.pageId === pageId && v.versionNumber === versionNumber
    );

    if (!version) return null;

    const filePath = path.join(VERSIONS_DIR, version.fileName);
    const content = await fs.readFile(filePath, 'utf-8');

    return { ...version, content };
  }

  static async getCurrentContent(pageId) {
    await db.read();
    const page = db.data.pages.find(p => p.id === pageId);
    if (!page) return null;

    return this.getVersionContent(pageId, page.currentVersion);
  }

  static async restoreVersion(pageId, versionNumber, editorName) {
    await db.read();
    const page = db.data.pages.find(p => p.id === pageId);
    if (!page) return null;

    const oldVersion = await this.getVersionContent(pageId, versionNumber);
    if (!oldVersion) return null;

    const newVersionNumber = page.currentVersion + 1;
    const version = await this._createVersion(
      pageId,
      newVersionNumber,
      oldVersion.content,
      editorName
    );

    db.data.versions.push(version);
    page.currentVersion = newVersionNumber;
    page.updatedAt = new Date().toISOString();

    await db.write();

    return { page, version, restoredFrom: versionNumber };
  }
}

export default Page;
