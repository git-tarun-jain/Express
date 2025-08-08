import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js'
import session from 'express-session';
import { addTodoPage, createTodo, deleteTodo, editTodoPage, updateTodo, viewTodos } from './controllers/todoController.js';
import { registerUser, loginUser, welcomeUser, loginPage, registerPage, changePasswordPage, changePassword, logout } from './controllers/userController.js';
import { contactPage, sendEmail } from './controllers/contactController.js';
import { addProductPage, createProduct, deleteGalleryImage, deleteProduct, editProductPage, updateProduct, viewProduct, viewProducts } from './controllers/productController.js';
import { addBookPage, createBook, deleteBook, editBookPage, searchBook, updateBook, viewBooks } from './controllers/bookController.js';
import { addToCart, removeCartItem, updateQty, viewCart } from './controllers/cartController.js';
dotenv.config();
const app = express();

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });
const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

await connectDB();


/*async function insertBooks() {
    try {
        await connectDB();
        const books = JSON.parse(fs.readFileSync('clean_books_mongodb.json', 'utf8'));
        await Book.insertMany(books);

        console.log('Books inserted!');
    } catch (err) {
        console.error('Error inserting books:', err);
    } finally {
        await mongoose.disconnect();
    }
}

insertBooks();*/


// Todo
app.get('/add-todo', addTodoPage);
app.post('/add-todo', createTodo);
app.get('/edit-todo/:id', editTodoPage);
app.post('/edit-todo/:id', updateTodo);
app.get('/delete-todo/:id', deleteTodo);
app.get('/todos', viewTodos);

// User
app.get('/register', registerPage);
app.post('/register', registerUser);
app.get('/', loginPage);
app.post('/login', loginUser);
app.get('/dashboard', welcomeUser);
app.get('/change-password/:id', changePasswordPage);
app.post('/change-password/:id', changePassword);
app.get('/logout', logout);

// Contact
app.get('/contact', contactPage);
app.post('/send-email', upload.single('attachment'), sendEmail);

// Product
app.get('/add-product', addProductPage);
app.post('/add-product', productUpload, createProduct);
app.get('/view-product/:id', viewProduct);
app.get('/edit-product/:id', editProductPage);
app.post('/edit-product/:id', productUpload, updateProduct);
app.get('/delete-product/:id', deleteProduct);
app.get('/products', viewProducts);
app.post('/remove-image/:id', deleteGalleryImage);

// Cart
app.post('/add-to-cart', addToCart);
app.get('/cart', viewCart);
app.get('/remove-cart-item/:id', removeCartItem);
app.post('/update-qty', updateQty);


// Books
app.get('/add-book', addBookPage);
app.post('/add-book', createBook);
app.get('/edit-book/:id', editBookPage);
app.post('/edit-book/:id', updateBook);
app.get('/delete-book/:id', deleteBook);
app.get('/books', viewBooks);
app.post('/search-book/', searchBook);




// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
