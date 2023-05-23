const { postCreateProductService, getProductListServices } = require('../services/productService');
const Product = require('../models/product');
module.exports = {
    postCreateProduct: async (req, res) => {
        const { name, price, status } = req.body;
        let message;
        if (price < 0) {
            message = 'Giá không được âm';
            return res.status(400).json({
                EC: -1,
                message,
            });
        }
        try {
            const test = await Product.find({ name });
            if (test.length != 0) {
                return res.status(400).json({
                    EC: -1,
                    message: 'Đã tồn tại mặt hàng',
                });
            }
            const results = await Product.create({ ...req.body });
            return res.status(200).json({
                message: null,
                results,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    getProductList: async (req, res) => {
        const results = await getProductListServices();
        return res.status(200).json({
            EC: 0,
            message: results,
        });
    },
};
