const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

class AuthMethod {
    // Hàm này để genetate token 
    static async generateToken(payload, secretSignature, tokenLife) {
        try {
            return await sign({
                    payload
                },
                secretSignature, {
                    algorithm: 'HS256',
                    expiresIn: tokenLife,
                },
            );
        } catch (error) {
            console.log(`Error in generate access token:  + ${error}`);
            return null;
        }
    };

    // Hàm này verify code khi access token đã hoặc chưa hết hạn
    static async decodeToken(token, secretKey) {
        try {
            return await verify(token, secretKey, {
                ignoreExpiration: true,
            });
        } catch (error) {
            console.log(`Error in decode access token: ${error}`);
            return null;
        }
    };

    // Hàm này verify code khi access token chưa hết hạn
    static async verifyToken(token, secretKey) {
        try {
            return await verify(token, secretKey);
        } catch (error) {
            console.log(`Error in verify access token:  + ${error}`);
            return null;
        }
    };
}

module.exports = AuthMethod;