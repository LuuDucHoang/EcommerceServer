const aqp = require('api-query-params');
const Product = require('../models/product');
module.exports = {
    postCreateProductService: async (data) => {
        const { name, price, countryMade, status, brand, description, image, size } = data;

        try {
            const test = await Product.find({ name });
            if (test) {
                return {
                    message: 'Đã tồn tại tên mặt hàng',
                    results: null,
                };
            }
            const results = await Product.create({ ...data });
            return {
                message: null,
                results,
            };
        } catch (error) {
            return {
                message: error,
                results: null,
            };
        }
    },
    getProductListServices: async () => {
        try {
            const results = await Product.find({});
            return {
                message: null,
                data: results,
            };
        } catch (error) {
            return {
                message: error,
                data: null,
            };
        }
    },
};
