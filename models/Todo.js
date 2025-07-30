import mongoose from 'mongoose';

const toDoSchema = new mongoose.Schema({
    todo: { type: String, required: true }
});

export default mongoose.model('Todo', toDoSchema);
