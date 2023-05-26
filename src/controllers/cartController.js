const aqp = require('api-query-params');
const Cart = require('../models/cart');
module.exports = {
    postCreateUpdateCart: async (req, res) => {
        const { userId, arr } = req.body;
        try {
            const test = await Cart.findOne({ userId });
            if (test) {
                const newCart = [...test.cart, ...arr];
                const data = await Cart.updateOne({ userId }, { cart: newCart });
                return res.status(200).json({
                    EC: 0,
                    data,
                });
            }
            if (!test) {
                const cart = new Cart({
                    userId,
                    cart: [...arr],
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
            const data = await Cart.updateOne({ userId }, { cart: newCart });
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
