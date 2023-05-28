const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const userSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        sex: { type: String },
        address: { type: String },
        age: { type: Number },
        phone: { type: Number },
        image: { type: String },
        admin: { type: Boolean, default: false },
        refreshToken: { type: String },
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
userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const User = mongoose.model('user', userSchema);

module.exports = User;
