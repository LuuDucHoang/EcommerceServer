const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const userOrderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true, unique: true },
        userName: { type: String, require: true, unique: true },
        address: { type: String, require: true },
        phone: { type: String, require: true },
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
