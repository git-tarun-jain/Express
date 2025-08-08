import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';
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
    const productGallery = [
        ...(product.gallery || []).map(file => ({
            filename: file.filename,
            path: file.path.replace(/\\/g, '/')
        })),
        ...(req.files.gallery || []).map(file => ({
            filename: file.filename,
            path: file.path.replace(/\\/g, '/')
        }))
    ];
    const updateProductData = {
        title,
        excerpt,
        content,
        price,
        sku,
        image: imagepath,
        gallery: productGallery
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

export async function deleteGalleryImage(req, res) {
    const { imagePath } = req.body;
    const vpid = req.params.id;
    try {
        const prod = await Product.findById(vpid);
        if (!prod) {
            return res.status(404).send('Product not found');
        }        
        prod.gallery = prod.gallery.filter(p => p.path !== imagePath);
        await prod.save();
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, (err) => {
            if (err) console.error('File delete error:', err);
        });
        res.redirect(`/edit-product/${vpid}`);
    } catch (error) {
        console.error('Error deleting gallery image:', err);
        res.status(500).send('Server error');
    }
}