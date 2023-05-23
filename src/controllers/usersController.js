const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const aqp = require('api-query-params');
///ádasdasd
const { postCreateUsersService, getUserSignInServices } = require('../services/userService');
const { use } = require('../routes/api');

const accessTokenfc = (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        process.env.ACCESS_KEY,
        { expiresIn: '2h' },
    );
};
const refreshTokenfc = (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        process.env.REFRESH_KEY,
        { expiresIn: '365d' },
    );
};
module.exports = {
    postCreateUser: async (req, res) => {
        try {
            const results = await postCreateUsersService(req.body);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({
                message: error,
                results: null,
            });
        }
    },
    getUserSignIn: async (req, res) => {
        const { userName, password } = req.body;
        try {
            const user = await User.findOne({ userName });

            if (!user) {
                return res.status(404).json('Tài khoản không tồn tại');
            }
            console.log(user.password);
            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass) {
                return res.status(404).json('Sai mật khảu');
            }
            if (user && checkPass) {
                user.password = undefined;
                const accessToken = accessTokenfc(user);
                const refreshToken = refreshTokenfc(user);

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: 'true',
                    path: '/',
                    sameSite: 'strict',
                });
                return res.status(200).json({ user, accessToken });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.body;
        try {
            const results = await User.deleteById(id);
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    requestRefreshToken: async (req, res) => {
        console.log(req.cookies.refreshToken);
        return res.status(200).json(1);
    },
};
