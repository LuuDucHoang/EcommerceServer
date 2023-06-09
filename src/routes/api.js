const express = require('express');
const routerApi = express.Router();
const {
    postCreateProduct,
    getProductList,
    getDetailProduct,
    getSmilarProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    restoreAndUpdateProduct,
    getDeletedProduct,
    removeDeletedProduct,
} = require('../controllers/producController');
const {
    postCreateUser,
    getUserSignIn,
    deleteUser,
    requestRefreshToken,
    userLogout,
    updatteUserInfo,
    getUserInfo,
} = require('../controllers/usersController');

const {
    postCreateUpdateCart,
    putCartRemoveitemCart,
    getCart,
    clearUserCart,
} = require('../controllers/cartController');
const {
    postNewUserOrder,
    getUserOrders,
    getDetailUserOrders,
    cancelUserOrders,
    getConfirmUserOrders,
    getNotConfirmUserOrders,
    getCancelUserOrders,
} = require('../controllers/userOrderController');
const middlewareController = require('../controllers/middlewareController');
//product
routerApi.post('/product', middlewareController.verifyTokenAndAdmin, postCreateProduct);
routerApi.get('/product', getProductList);
routerApi.get('/product/:id', getDetailProduct);
routerApi.get('/smilar/:type', getSmilarProduct);
routerApi.get('/products/all', getAllProduct);
routerApi.put('/product/update/:id', middlewareController.verifyTokenAndAdmin, updateProduct);
routerApi.delete('/product/delete/:id', middlewareController.verifyTokenAndAdmin, deleteProduct);
routerApi.get('/product/get/deleted', middlewareController.verifyTokenAndAdmin, getDeletedProduct);
routerApi.put('/product/restore/update/:id', restoreAndUpdateProduct);
routerApi.delete('/product/remove/:id', middlewareController.verifyTokenAndAdmin, removeDeletedProduct);
//user
routerApi.post('/users/register', postCreateUser);
routerApi.delete('/users/delete', middlewareController.verifyTokenAndAdmin, deleteUser);
routerApi.post('/users/signin', getUserSignIn);
routerApi.post('/users/refreshtoken', requestRefreshToken);
routerApi.post('/users/logout', middlewareController.verifyToken, userLogout);
routerApi.put('/users/update', middlewareController.verifyToken, updatteUserInfo);
routerApi.get('/user/:id', middlewareController.verifyToken, getUserInfo);

//cart
routerApi.get('/cart/getcart/:userid', middlewareController.verifyToken, getCart);
routerApi.post('/cart', middlewareController.verifyToken, postCreateUpdateCart);
routerApi.put('/cart/remove', middlewareController.verifyToken, putCartRemoveitemCart);
routerApi.delete('/clearcart/:userid', middlewareController.verifyToken, clearUserCart);

//userOrder
routerApi.post('/userorder', middlewareController.verifyToken, postNewUserOrder);
routerApi.get('/userorder/:userId', middlewareController.verifyToken, getUserOrders);
routerApi.get('/userorder/detail/:id', middlewareController.verifyToken, getDetailUserOrders);
routerApi.get('/userorder/notconfirm/:userId', middlewareController.verifyToken, getNotConfirmUserOrders);
routerApi.get('/userorder/confirm/:userId', middlewareController.verifyToken, getConfirmUserOrders);
routerApi.get('/userorder/cancel/:userId', middlewareController.verifyToken, getCancelUserOrders);
routerApi.patch('/userorder/cancel/:id', middlewareController.verifyToken, cancelUserOrders);

//export
module.exports = routerApi;
