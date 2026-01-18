import db from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import Page from './pageModel.js';

class Book {
    static async create(bookData) {
        await db.read();

        const newBook = {
            id: uuidv4(),
            title: bookData.title,
            description: bookData.description,
            indexPageId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.data.books.push(newBook);
        await db.write();

        /// Create index page
        const indexPage = await Page.create({
            title: `${bookData.title} - Index`,
            content: bookData.indexContent || 'Index page content',
            bookId: newBook.id,
            isIndexPage: true,
            editorName: bookData.editorName || 'System'
        });

        // Update book with index page reference
        newBook.indexPageId = indexPage.id;
        await db.write();

        // Create initial empty pages if specified
        if (bookData.initialPages && bookData.initialPages > 0) {
            for (let i = 1; i <= bookData.initialPages; i++) {
                await Page.create({
                    title: `Page ${i}`,
                    content: '',
                    bookId: newBook.id,
                    isIndexPage: false,
                    editorName: bookData.editorName || 'System'
                });
            }
        }

        return newBook;
    }

    static async findAll() {
        await db.read();
        return db.data.books;
    }

    static async findById(id) {
        await db.read();
        return db.data.books.find(book => book.id === id);
    }

    static async update(id, updateData) {
        await db.read();
        const index = db.data.books.findIndex(book => book.id === id);

        if (index === -1) return null;

        db.data.books[index] = {
            ...db.data.books[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await db.write();
        return db.data.books[index];
    }

    static async delete(id) {
        await db.read();
        const index = db.data.books.findIndex(book => book.id === id);

        if (index === -1) return false;

        db.data.books.splice(index, 1);
        await db.write();
        return true;
    }

    static async getWithDetails(id) {
        await db.read();
        const book = db.data.books.find(b => b.id === id);
        if (!book) return null;

        const chapters = db.data.chapters
            .filter(c => c.bookId === id)
            .sort((a, b) => a.order - b.order);

        const indexPage = db.data.pages.find(p => p.id === book.indexPageId);

        return {
            ...book,
            indexPage,
            chapters
        };
    }
}

export default Book;



