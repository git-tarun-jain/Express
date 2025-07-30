import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    attachment: { type: String, required: true }
});

export default mongoose.model('Contact', contactSchema);
