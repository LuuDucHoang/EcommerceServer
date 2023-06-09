const { postCreateProductService, getProductListServices } = require('../services/productService');
const { uploadSingleFile } = require('../services/fileService');

const aqp = require('api-query-params');
const Product = require('../models/product');
module.exports = {
    postCreateProduct: async (req, res) => {
        const { name, price, status, brand, size, image, type, description } = req.body;
        let message;
        if (!req.files || Object.keys(req.files).length === 0) {
            message = 'Không có files được chọn';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!name) {
            message = 'Vui lòng nhập tên sản phẩm';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (price < 0 || !price || isNaN(price)) {
            message = 'Giá sản phẩm không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!type) {
            message = 'Vui lòng nhập loại hàng';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }

        if (!size || isNaN(size)) {
            message = 'Size không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        try {
            const test = await Product.find({ name });
            if (test.length !== 0) {
                return res.status(500).json({
                    EC: -1,
                    message: 'Đã tồn tại mặt hàng',
                });
            }
            const imgLink = await uploadSingleFile(req.files.image);
            imageUrl = `http://${process.env.HOST_NAME}:${process.env.PORT}/upload/${imgLink.path}`;
            let data = { name, price, status, brand, size, image, type, description, image: imageUrl };

            const results = await Product.create({ ...data });
            return res.status(200).json({
                message: null,
                results,
            });
        } catch (error) {
            console.log(error);
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
            let randomPage = Math.floor(Math.random() * 4);
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
    getAllProduct: async (req, res) => {
        const { page, limit } = req.query;
        try {
            const data = await Product.find({});
            const firstPageIndex = (page - 1) * +limit;
            const lastPageIndex = firstPageIndex + +limit;
            const x = data.slice(firstPageIndex, lastPageIndex);
            return res.status(200).json({
                EC: 0,
                total: data.length,
                data: x,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    updateProduct: async (req, res) => {
        const { name, price, status, brand, size, image, type, description } = req.body;
        const { id } = req.params;
        let message;
        if (!id) {
            message = 'Vui lòng nhập id của sản phẩm';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!name) {
            message = 'Vui lòng nhập tên sản phẩm';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (price < 0 || !price || isNaN(price)) {
            message = 'Giá sản phẩm không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!type) {
            message = 'Vui lòng nhập loại hàng';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }

        if (!size || isNaN(size)) {
            message = 'Size không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        try {
            const test = await Product.find({ _id: id });
            let data;
            if (!test.length) {
                return res.status(500).json({
                    EC: -1,
                    message: 'Không tìm thấy sản phẩm cần cập nhật',
                });
            }
            if (req.files) {
                const arrayOfAllowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
                if (!arrayOfAllowedFileTypes.includes(req.files.mimetype)) {
                    return res.status(500).json({
                        EC: -1,
                        message: 'Files không hợp lệ',
                    });
                }
                const imgLink = await uploadSingleFile(req.files.image);
                imageUrl = `http://${process.env.HOST_NAME}:${process.env.PORT}/upload/${imgLink.path}`;
                data = { name, price, status, brand, size, image, type, description, image: imageUrl };
            }
            if (!req.files) {
                data = {
                    name,
                    price,
                    status,
                    brand,
                    size,
                    type,
                    description,
                };
            }

            const results = await Product.updateOne({ _id: id }, { ...data }, { upsert: true });
            return res.status(200).json({
                message: null,
                results,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(500).json({
                EC: -1,
                message: 'Vui lòng nhập id',
            });
        }
        try {
            const test = await Product.findById({ _id: id });
            if (!test) {
                return res.status(500).json({
                    EC: -1,
                    message: 'không tìm thấy sản phẩm cần xóa',
                });
            }

            const data = await Product.deleteById({ _id: id });
            return res.status(200).json({
                EC: 0,
                data,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                error,
            });
        }
    },
    getDeletedProduct: async (req, res) => {
        const { page, limit } = req.query;
        try {
            const data = await Product.findDeleted({});
            const firstPageIndex = (page - 1) * +limit;
            const lastPageIndex = firstPageIndex + +limit;
            const x = data.slice(firstPageIndex, lastPageIndex);
            return res.status(200).json({
                EC: 0,
                total: data.length,
                data: x,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    restoreAndUpdateProduct: async (req, res) => {
        const { name, price, status, brand, size, image, type, description } = req.body;
        const { id } = req.params;
        let message;
        if (!id) {
            message = 'Vui lòng nhập id của sản phẩm';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!name) {
            message = 'Vui lòng nhập tên sản phẩm';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (price < 0 || !price || isNaN(price)) {
            message = 'Giá sản phẩm không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        if (!type) {
            message = 'Vui lòng nhập loại hàng';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }

        if (!size || isNaN(size)) {
            message = 'Size không hợp lệ';
            return res.status(500).json({
                EC: -1,
                message,
            });
        }
        try {
            const test = await Product.findDeleted({ _id: id });
            let data;
            if (!test.length) {
                return res.status(500).json({
                    EC: -1,
                    message: 'Không tìm thấy sản phẩm cần khôi phục',
                });
            }
            if (req.files) {
                const arrayOfAllowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
                if (!arrayOfAllowedFileTypes.includes(req.files.mimetype)) {
                    return res.status(500).json({
                        EC: -1,
                        message: 'Files không hợp lệ',
                    });
                }
                const imgLink = await uploadSingleFile(req.files.image);
                imageUrl = `http://${process.env.HOST_NAME}:${process.env.PORT}/upload/${imgLink.path}`;
                data = { name, price, status, brand, size, image, type, description, image: imageUrl };
            }
            if (!req.files) {
                data = {
                    name,
                    price,
                    status,
                    brand,
                    size,
                    type,
                    description,
                };
            }

            const results = await Product.updateOneDeleted({ _id: id }, { ...data, deleted: false }, { upsert: true });
            return res.status(200).json({
                message: null,
                results,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                message: error,
            });
        }
    },
    removeDeletedProduct: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const test = await Product.findOneDeleted({ _id: id });
            if (!test) {
                return res.status(500).json({
                    EC: -1,
                    message: 'Không tìm thấy sản phẩm cần loại bỏ',
                });
            }
            const data = await Product.deleteOne({ _id: id });
            return res.status(200).json({
                EC: 0,
                data,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                error,
            });
        }
    },
};
