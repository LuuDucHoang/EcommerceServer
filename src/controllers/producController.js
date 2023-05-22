const { postCreateProductService, getProductListServices } = require('../services/productService');
module.exports = {
    postCreateProduct: async (req, res) => {
        const { name, price, status } = req.body;
        let message;
        if (!name || !price || !status) {
            message = 'nhập full thông tin';
            return res.status(200).json({
                EC: -1,
                message,
            });
        }
        if (price < 0) {
            message = 'Giá không được âm';
            return res.status(200).json({
                EC: -1,
                message,
            });
        } else {
            const results = await postCreateProductService(req.body);
            return res.status(200).json({
                EC: 0,
                message: results,
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
