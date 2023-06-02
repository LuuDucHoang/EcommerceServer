const aqp = require('api-query-params');
const userOrder = require('../models/userOrder');

module.exports = {
    postNewUserOrder: async (req, res) => {
        const { userId, userName, address, phone, finalPrice, adminConfirm = false, cancel = false, orders } = req.body;
        try {
            const data = await userOrder.create({
                userId,
                userName,
                address,
                phone,
                finalPrice,
                adminConfirm,
                cancel,
                orders: orders,
            });
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
    getUserOrders: async (req, res) => {
        const { userId } = req.params;
        try {
            const data = await userOrder.find({ userId });
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
    getDetailUserOrders: async (req, res) => {
        const { id } = req.params;
        try {
            const data = await userOrder.findOne({ _id: id });
            return res.status(200).json({
                EC: 0,
                data,
            });
        } catch (error) {}
        console.log(error);
        return res.status(500).json({
            EC: -1,
            error,
        });
    },
    cancelUserOrders: async (req, res) => {
        const { id } = req.params;
        try {
            const data = await userOrder.deleteById({ _id: id });
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
    getNotConfirmUserOrders: async (req, res) => {
        const { userId } = req.params;
        try {
            const data = await userOrder.find({ userId, adminConfirm: false });
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
