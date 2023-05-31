const aqp = require('api-query-params');
const userOrder = require('../models/userOrder');

module.exports = {
    postNewUserOrder: async (req, res) => {
        const { userId, userName, address, phone, orders } = req.body;
        try {
            const uOrder = new userOrder({ userId, userName, address, phone, orders: orders });
            const data = await uOrder.save();
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
    // getUserOrders:async(req,res)=>{
    //     const userId =
    // }
};
