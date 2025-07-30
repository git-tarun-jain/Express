import Product from '../models/Product.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProduct(req, res) {
    const { title, excerpt, content, price, sku } = req.body;
    const imagepath = (req.files.image?.[0]?.path || '').replace(/\\/g, '/');
    const formattedGallery = (req.files.gallery || []).map(file => ({
        filename: file.filename,
        path: (file.path).replace(/\\/g, '/')
    }));
    const newProduct = new Product({ title, excerpt, content, price, sku, image: imagepath, gallery: formattedGallery });
    await newProduct.save();
    res.redirect('/products');
}

export async function updateProduct(req, res) {
    const { title, excerpt, content, price, sku } = req.body;
    const vpid = req.params.id;
    const product = await Product.findById(vpid);
    const imagepath = (req.files.image?.[0]?.path || product.image).replace(/\\/g, '/');
    const formattedGallery = (req.files.gallery || product.gallery).map(file => ({
        filename: file.filename,
        path: (file.path).replace(/\\/g, '/')
    }));
    const updateProductData = {
        title,
        excerpt,
        content,
        price,
        sku,
        image: imagepath,
        gallery: formattedGallery
    };
    await Product.findByIdAndUpdate(vpid, updateProductData);
    res.redirect('/products');
}

export async function viewProduct(req, res) {
    const vpid = req.params.id;
    const product = await Product.findById(vpid);
    res.render('product.ejs', { product });
}

export async function viewProducts(req, res) {
    const products = await Product.find();
    res.render('products.ejs', { products });
}

export async function deleteProduct(req, res) {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
}

export function addProductPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
}

export async function editProductPage(req, res) {
    const product = await Product.findById(req.params.id);
    res.render('edit-product.ejs', { product });
}