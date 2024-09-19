
import mongoose from 'mongoose';
import Product from '../models/product.model.js';


export const getProduct =  async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({ success: true, data: product })
    } catch (error) {
        console.log("Error in fatching products: ", error.message);
        res.status(500).json({ succes: false, messsage: "server error" })

    }
}

export const postProduct = async (req, res) => {
    const product = req.body; // user will send this data
    if (!product.name || !product.price || !product.image) {
        res.status(400).json({ success: false, message: "please provide all fields" })
    }
    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct })
    } catch (error) {
        console.error("Error in creating prodct :", error.message);
        res.status(500).json({ succes: false, message: "server error" })
    }
}

export const putProduct =  async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid product id" })
    }
    try {
        const updateProduct = await Product.findByIdAndUpdate(id, product, { mew: true });
        res.status(200).json({ success: true, data: updateProduct })
    } catch (error) {
        res.status(500), json({ success: false, messsage: "server error" })
    }

}

export const deleteProduct =  async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid product id" })
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}