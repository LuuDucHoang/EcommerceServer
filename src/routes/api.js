const express = require('express');
const Customer = require('../models/customer');
const Product = require('../models/product');
const routerApi = express.Router();
const { postCreateProduct, getProductList } = require('../controllers/producController');

routerApi.post('/product', postCreateProduct);
routerApi.get('/product', getProductList);
routerApi.post('/product/post', (req, res) => {
    const data = req.body;
    return res.status(200).json({
        data,
    });
});
module.exports = routerApi;
