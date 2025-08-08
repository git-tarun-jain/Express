import Book from '../models/Book.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createBook(req, res) {
    const { title, genre, publisher } = req.body;
    const userid = req.session.user._id;
    const newBook = new Book({ title, genre, publisher, userid });
    await newBook.save();
    res.redirect('/books');
}

export async function updateBook(req, res) {
    const { title, genre, publisher } = req.body;
    const bid = req.params.id;
    const userid = req.session.user._id;
    const updateBookData = {
        title,
        genre,
        publisher,
        userid
    };
    await Book.findByIdAndUpdate(bid, updateBookData);
    res.redirect('/books');
}

export async function viewBooks(req, res) {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (currentPage - 1) * limit;
    const userid = req.session.user._id;
    try {
        const books = await Book.find({userid}).skip(offset).limit(limit);
        const total = await Book.countDocuments({userid});
        const author = req.session.user.fname + ' ' + req.session.user.lname;
        books.forEach((book, index) => {
            book.author = author;
        });        
        res.render('books.ejs', { 
            currentPage,
            offset,
            midSize: 2,
            totalPages: Math.ceil(total / limit),
            totalBooks: total,
            books
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export async function deleteBook(req, res) {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
}

export function addBookPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'add-book.html'));
}

export async function editBookPage(req, res) {
    const book = await Book.findById(req.params.id);
    res.render('edit-book.ejs', { book });
}

export async function searchBook(req, res) {
    const { keyword } = req.body;
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (currentPage - 1) * limit;
    try {
        const searchQuery = { title: { $regex: keyword, $options: 'i' } };
        const books = await Book.find(searchQuery).skip(offset).limit(limit);
        const total = await Book.countDocuments(searchQuery);
        res.render('books.ejs', { 
            currentPage,
            offset,
            midSize: 2,
            totalPages: Math.ceil(total / limit),
            totalBooks: total,
            books 
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}