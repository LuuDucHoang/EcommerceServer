const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');
const customerSchema = new mongoose.Schema({
    name: { type: String, require: true },
    address: { type: String },
    phone: { type: Number },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    description: { type: String }
},
    {
        timestamps: true,
        static: {
            findByName(name) {
                return this.find({ name: new RegExp(name, 'i') });
            }
        }
    }
);
customerSchema.plugin(mongoose_delete, { overrideMethods: 'all' })

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;
