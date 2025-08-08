import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    publisher: { type: String, required: false },
    userid: { type: String, required: false }
});

export default mongoose.model('Book', bookSchema);


