const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const cartSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true, unique: true },
        cart: {
            type: [Object],
            require: true,
        },
    },
    {
        timestamps: true,
        static: {
            findByName(name) {
                return this.find({ name: new RegExp(name, 'i') });
            },
        },
    },
);
cartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
