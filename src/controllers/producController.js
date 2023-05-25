const { postCreateProductService, getProductListServices } = require('../services/productService');
const aqp = require('api-query-params');
const Product = require('../models/product');
module.exports = {
    postCreateProduct: async (req, res) => {
        const { name, price, status, type } = req.body;
        let message;
        if (price < 0) {
            message = 'Giá không được âm';
            return res.status(400).json({
                EC: -1,
                message,
            });
        }
        if (!type) {
            message = 'Vui lòng nhập loại hàng';
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
        const size = Object.keys(req.query).length;
        try {
            if (size !== 0) {
                const x = aqp(req.query);
                delete x.filter.page;
                if (!x.filter.name) {
                    return res.status(404).json('Nhập tên cần tìm');
                }
                const results = await Product.find({
                    name: { $regex: '.*' + x.filter.name + '.*', $options: 'i' },
                }).limit(x.limit);
                return res.status(200).json({
                    EC: 0,
                    message: results,
                });
            }
            if (size === 0) {
                const results = await getProductListServices();
                return res.status(200).json({
                    EC: 0,
                    message: results,
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    getDetailProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const results = await Product.findById(id);
            return res.status(200).json({
                EC: 0,
                data: results,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    getSmilarProduct: async (req, res) => {
        const type = req.params.type;
        try {
            let randomPage = Math.floor(Math.random() * 3);
            if (randomPage === 0) {
                randomPage++;
            }
            const results = await Product.find({ type: type })
                .skip((randomPage - 1) * 5)
                .limit(5);
            return res.status(200).json({
                EC: 0,
                data: results,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
};
