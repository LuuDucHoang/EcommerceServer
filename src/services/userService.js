const aqp = require('api-query-params');
const bcrypt = require('bcrypt');
const User = require('../models/user');
module.exports = {
    postCreateUsersService: async (data) => {
        const { name, password, userName } = data;

        try {
            const test = await User.find({ userName });
            if (test.length > 0) {
                return {
                    message: 'Tài khoản đã tồn tại',
                    results: null,
                };
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const results = await User.create({ userName, password: hashPassword, name });
            if (results) {
                return {
                    message: null,
                    results,
                };
            }
        } catch (error) {
            return {
                message: error,
                results: null,
            };
        }
    },
    getUserSignInServices: async (data) => {},
};
