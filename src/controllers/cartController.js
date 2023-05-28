const aqp = require('api-query-params');
const Cart = require('../models/cart');
module.exports = {
    postCreateUpdateCart: async (req, res) => {
        const { userId, arr } = req.body;
        try {
            let sumQuanlity;
            let i;
            const test = await Cart.findOne({ userId });
            if (test) {
                test.cart.forEach((item, index) => {
                    if (item.name === arr.name) {
                        sumQuanlity = +item.quality + +arr.quality;
                        i = index;
                    }
                });
                console.log(sumQuanlity);
                if (sumQuanlity) {
                    test.cart[i].quality = sumQuanlity;
                    const data = await Cart.updateOne({ userId }, { cart: test.cart });
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
                if (!sumQuanlity) {
                    const newCart = [...test.cart, arr];
                    console.log(newCart);
                    const data = await Cart.updateOne({ userId }, { cart: newCart });
                    return res.status(200).json({
                        EC: 0,
                        data,
                    });
                }
            }
            if (!test) {
                const cart = new Cart({
                    userId,
                    cart: [arr],
                });
                const data = await cart.save();
                return res.status(200).json({
                    EC: 0,
                    data,
                });
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
};
