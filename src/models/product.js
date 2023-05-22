const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const productSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, require: true },
        countryMade: { type: String },
        status: { type: String, require: true },
        brand: { type: String },
        size: { type: String, require: true },
        image: { type: String },
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
