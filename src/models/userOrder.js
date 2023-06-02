const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const userOrderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        userName: { type: String, require: true },
        address: { type: String, require: true },
        phone: { type: String, require: true },
        finalPrice: { type: Number, require: true },
        adminConfirm: { type: Boolean },
        cancel: { type: Boolean },
        orders: {
            type: [Object],
            require: true,
        },
    },
    {
        timestamps: true,
    },
);
userOrderSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const userOrder = mongoose.model('userOrder', userOrderSchema);

module.exports = userOrder;
