import mongoose from 'mongoose';


const cartSchema = new mongoose.Schema({
    userid: { type: String, required: true },    
    productid: { type: String, required: true },
    productqty: { type: Number, required: true },
    carttotal: { type: Number, required: false }
});

export default mongoose.model('Cart', cartSchema);


