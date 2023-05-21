const express = require('express');
const Customer = require('../models/customer');
const Product = require('../models/product');
const routerApi = express.Router();

routerApi.get('/customer', async (req, res) => {
    const results = await Customer.find({});
    return res.status(200).json({
        EC: 0,
        data: results,
    });
});

routerApi.post('/product');
module.exports = routerApi;
