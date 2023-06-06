const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        status: { type: String, required: true },
        brand: { type: String },
        size: { type: String, required: true },
        image: { type: String, require: true },
        type: { type: String, required: true },
        description: { type: String },
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
productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Product = mongoose.model('product', productSchema);

module.exports = Product;
