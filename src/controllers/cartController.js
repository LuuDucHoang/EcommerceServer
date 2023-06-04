const aqp = require('api-query-params');
const Cart = require('../models/cart');
module.exports = {
    postCreateUpdateCart: async (req, res) => {
        const { userId, arr } = req.body;
        try {
            let sumQuanlity;
            let i;
            let sumArr = [];
            let indexArr = [];

            const test = await Cart.findOne({ userId });

            if (test) {
                if (typeof arr === 'object' && !Array.isArray(arr)) {
                    test.cart.forEach((item, index) => {
                        if (item.name === arr.name) {
                            sumQuanlity = +item.quality + +arr.quality;
                            i = index;
                        }
                    });
                }

                if (Array.isArray(arr)) {
                    test.cart.forEach((item, index) => {
                        arr.forEach((x, key) => {
                            if (x.name == item.name) {
                                sumArr = [...sumArr, item.quality + x.quality];
                                indexArr = [...indexArr, index];
                            }
                        });
                    });
                }

                if (sumQuanlity) {
                    test.cart[i].quality = sumQuanlity;
                    const data = await Cart.updateOne({ userId }, { cart: test.cart });
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
                if (sumArr.length !== 0) {
                    indexArr.forEach((item, key) => {
                        test.cart[item].quality = sumArr[key];
                    });
                    const data = await Cart.updateOne({ userId }, { cart: test.cart });
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
                if (!sumQuanlity || !sumArr) {
                    if (typeof arr === 'object' && !Array.isArray(arr)) {
                        const newCart = [...test.cart, arr];
                        const data = await Cart.updateOne({ userId }, { cart: newCart });
                        return res.status(200).json({
                            EC: 0,
                            data,
                        });
                    }
                    if (Array.isArray(arr) === true) {
                        const newCart = [...test.cart, ...arr];
                        const data = await Cart.updateOne({ userId }, { cart: newCart });
                        return res.status(200).json({
                            EC: 0,
                            data,
                        });
                    }
                }
            }
            if (!test) {
                if (typeof arr === 'object' && !Array.isArray(arr)) {
                    const cart = new Cart({
                        userId,
                        cart: arr,
                    });
                    const data = await cart.save();
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
                if (Array.isArray(arr)) {
                    const cart = new Cart({
                        userId,
                        cart: arr,
                    });
                    const data = await cart.save();
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    putCartRemoveitemCart: async (req, res) => {
        const { userId, remove } = req.body;
        try {
            const userCart = await Cart.findOne({ userId });
            const newCart = userCart.cart.filter((e) => {
                if (JSON.stringify(e) !== JSON.stringify(remove)) {
                    return e;
                }
            });
            await Cart.updateOne({ userId }, { cart: newCart });
            const data = await Cart.findOne({ userId });
            return res.status(200).json({
                EC: 0,
                data,
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getCart: async (req, res) => {
        const { userid } = req.params;
        try {
            const data = await Cart.findOne({ userId: userid });

            return res.status(200).json({
                EC: 0,
                data,
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    clearUserCart: async (req, res) => {
        const { userid } = req.params;

        try {
            const data = await Cart.deleteOne({ userId: userid });
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
