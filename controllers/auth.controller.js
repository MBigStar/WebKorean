const randToken = require('rand-token');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const {
    SALT_ROUNDS
} = require('../constants/auth.constant');
const {
    refreshTokenSize,
    accessTokenSecret,
    accessTokenLife
} = require('../constants/jwt.constant');
const AuthMethod = require('../methods/auth.method');

class AuthController {
    async register(req, res) {
        const username = req.body.username.toLowerCase();
        const user = await userModel.findOne({
            username: username
        });
        if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
            const newUser = {
                username: username,
                password: hashPassword,
            };
            const createUser = await userModel.create(newUser);
            if (!createUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            return res.status(201).send({
                msg: 'Đăng ký thành công',
                data: {
                    username,
                },
            });
        }
    }

    async login(req, res) {
        const username = req.body.username.toLowerCase();
        const password = req.body.password;

        const user = await userModel.findOne({
            username: username,
        });

        if (!user) {
            return res.status(401).send('Tên đăng nhập không tồn tại.');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Mật khẩu không chính xác.');
        }

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            username: user.username,
        };
        const accessToken = await AuthMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }

        let refreshToken = randToken.generate(refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
        if (user.refreshToken === '') {
            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            user.refreshToken = refreshToken;
            await user.save();
        } else {
            // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = user.refreshToken;
        }

        //Data trả về khi đăng nhập thành công
        const dataUser = {
            username: user.username,
            fullname: user.fullname,
            address: user.address,
            avatar: user.avatar,
            rating: user.rating,
            cert: user.certificates,
            dateOfBirth: user.dateOfBirth,
        };

        return res.json({
            msg: 'Đăng nhập thành công.',
            data: {
                accessToken,
                refreshToken,
                dataUser,
            }
        });
    }

    async refreshToken(req, res) {
        // Lấy access token từ header
        const accessTokenFromHeader = req.headers.token_access_authorization;
        if (!accessTokenFromHeader) {
            return res.status(400).send('Không tìm thấy access token.');
        }

        // Lấy refresh token từ body
        const refreshTokenFromBody = req.body.refreshToken;
        if (!refreshTokenFromBody) {
            return res.status(400).send('Không tìm thấy refresh token.');
        }

        // Biến này dùng để băm cùng với data username để tạo token thông qua bcrypt
        const _accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || accessTokenSecret;

        // Thời gian sống của token
        const _accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE || accessTokenLife;

        // Decode access token
        const decoded = await AuthMethod.decodeToken(
            accessTokenFromHeader,
            _accessTokenSecret,
        );
        if (!decoded) {
            return res.status(400).send('Access token không hợp lệ.');
        }

        const username = decoded.payload.username; // Lấy username từ payload

        const user = await userModel.findOne({
            username: username
        });
        if (!user) {
            return res.status(401).send('User không tồn tại.');
        }

        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token không hợp lệ.');
        }

        // Tạo access token mới
        const dataForAccessToken = {
            username,
        };

        const accessToken = await AuthMethod.generateToken(
            dataForAccessToken,
            _accessTokenSecret,
            _accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(400)
                .send('Tạo access token không thành công, vui lòng thử lại.');
        }
        return res.status(201).json({
            msg: 'Tạo thành công',
            accessToken,
        });
    };
}

module.exports = new AuthController();