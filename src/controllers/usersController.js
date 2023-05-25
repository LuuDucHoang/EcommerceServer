const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const aqp = require('api-query-params');
///ádasdasd
const { postCreateUsersService, getUserSignInServices } = require('../services/userService');

let refreshTokens = [];
const accessTokenfc = (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        process.env.ACCESS_KEY,
        { expiresIn: '1h' },
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
        const { name, userName, password } = req.body;
        try {
            const test = await User.find({ userName });
            if (test.length > 0) {
                return res.status(409).json('Tài khoản đã tồn tại');
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const results = await User.create({ userName, password: hashPassword, name });
            if (results) {
                return res.status(200).json(results);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getUserSignIn: async (req, res) => {
        const { userName, password } = req.body;
        try {
            const user = await User.findOne({ userName });

            if (!user) {
                return res.status(401).json('Tài khoản không tồn tại');
            }

            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass) {
                return res.status(404).json('Sai mật khảu');
            }
            if (user && checkPass) {
                user.password = undefined;
                const accessToken = accessTokenfc(user);
                const refreshToken = refreshTokenfc(user);
                const x = await User.updateOne({ _id: user._id }, { refreshToken });
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
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated ");
        if (!(await User.findOne({ refreshToken }))) return res.status(403).json('Refresh token is not valid');
        jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, user) => {
            if (err) {
                return res.status(500).json(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = accessTokenfc(user);
            const newRefreshToken = refreshTokenfc(user);
            // refreshTokens.push(newRefreshToken);
            await User.updateOne({ refreshToken }, { refreshToken: newRefreshToken });
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: 'true',
                path: '/',
                sameSite: 'strict',
            });
            return res.status(200).json({ accessToken: newAccessToken });
        });
    },
    userLogout: async (req, res) => {
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        return res.status(200).json('Log out!');
    },
};
