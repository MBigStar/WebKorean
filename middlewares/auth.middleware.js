const AuthMethod = require("../methods/auth.method");
const userModel = require('../models/user.model');

class AuthMiddleware {
    async isAuth(req, res, next) {
        try {
            // Lấy access token từ header
            const accessTokenFromHeader = req.headers.token_access_authorization;
            if (!accessTokenFromHeader) {
                return res.status(401).send('Không tìm thấy access token!');
            }

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET; // Lấy access token secret từ file .env

            const verified = await AuthMethod.verifyToken(
                accessTokenFromHeader,
                accessTokenSecret,
            );
            //Không tồn tại thì trả về
            if (!verified) {
                return res
                    .status(401)
                    .send({
                        msg: 'Bạn không có quyền truy cập vào tính năng này!',
                    });
            }

            const user = await userModel.findOne({
                username: verified.payload.username,
            });

            req.user = user;

            return next();
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .send({
                    msg: 'Có lỗi xảy ra vui lòng thử lại',
                });
        }
    };
}

module.exports = new AuthMiddleware();