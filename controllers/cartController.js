import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export async function addToCart(req, res) {
    const { userid, productid, productqty } = req.body;
    const product = await Product.findById(productid);
    const carttotal = parseInt(productqty * product.price);
    const cartProduct = await Cart.findOne({productid});
    if(cartProduct) {
        const cpTotal = cartProduct.carttotal;
        const cpQty = cartProduct.productqty;
        const newQty = parseInt(cpQty) + parseInt(productqty);
        const newTotal = parseInt(cpTotal + carttotal);
        await Cart.findByIdAndUpdate(cartProduct._id, {userid, productid, productqty: newQty, carttotal: newTotal});
    }else{
        const newCart = new Cart({userid, productid, productqty, carttotal});
        await newCart.save();
    }    
    res.render('product.ejs', { product });
}

export async function viewCart(req, res) {
    const userid = req.session.user._id;
    const cart = await Cart.find({userid});
    const cartItemData = {};
    let cartSubtotal = 0;
    for (const prod of cart) {
        const productData = await Product.findById(prod.productid);
        if (productData) {
            cartSubtotal += prod.carttotal;
            cartItemData[prod.productid] = {
                name: productData.title,
                price: productData.price,
                image: productData.image,
                qty: prod.productqty,
                subtotal: prod.carttotal,
                id: prod._id
            };
        }
    };
    res.render('cart.ejs', { cartItemData, cartSubtotal });
}

export async function removeCartItem(req, res) {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/cart');
}

export async function updateQty(req, res) {
    try {
        const { id, change } = req.body; 
        const userid = req.session.user._id;
        const cart = await Cart.findById(id);
        cart.productqty += change;
        if(cart.productqty < 1) {
            await Cart.findByIdAndDelete(id);
        }else{            
            const product = await Product.findById(cart.productid);
            const carttotal = cart.productqty * product.price;
            await Cart.findByIdAndUpdate(cart._id, {userid, productid: cart.productid, productqty: cart.productqty, carttotal});
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
}
