const express = require('express');
const routerApi = express.Router();
const {
    postCreateProduct,
    getProductList,
    getDetailProduct,
    getSmilarProduct,
} = require('../controllers/producController');
const {
    postCreateUser,
    getUserSignIn,
    deleteUser,
    requestRefreshToken,
    userLogout,
} = require('../controllers/usersController');
const middlewareController = require('../controllers/middlewareController');
//product
routerApi.post('/product', middlewareController.verifyTokenAndAdmin, postCreateProduct);
routerApi.get('/product', getProductList);
routerApi.get('/product/:id', getDetailProduct);
routerApi.get('/smilar/:type', getSmilarProduct);

//user
routerApi.post('/users/register', postCreateUser);
routerApi.delete('/users/delete', middlewareController.verifyTokenAndAdmin, deleteUser);
routerApi.post('/users/signin', getUserSignIn);
routerApi.post('/users/refreshtoken', requestRefreshToken);
routerApi.post('/users/logout', middlewareController.verifyToken, userLogout);

module.exports = routerApi;
