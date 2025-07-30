import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: String, required: true },
    sku: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [
        {
            filename: String,
            path: String
        }
    ]
});

export default mongoose.model('Product', productSchema);
