const express = require('express');
const routerApi = express.Router();
const { postCreateProduct, getProductList } = require('../controllers/producController');
const { postCreateUser, getUserSignIn, deleteUser, requestRefreshToken } = require('../controllers/usersController');
const middlewareController = require('../controllers/middlewareController');

routerApi.post('/product', middlewareController.verifyTokenAndAdmin, postCreateProduct);
routerApi.get('/product', getProductList);
routerApi.post('/product/post', (req, res) => {
    const data = req.body;
    return res.status(200).json({
        data,
    });
});
routerApi.post('/users/register', postCreateUser);
routerApi.delete('/users/delete', middlewareController.verifyTokenAndAdmin, deleteUser);
routerApi.post('/users/signin', getUserSignIn);
routerApi.post('/users/refreshtoken', requestRefreshToken);
module.exports = routerApi;
