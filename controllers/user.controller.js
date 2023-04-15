const userModel = require('../models/user.model');

class UserController {
    async getUser(req, res) {
        return res.status(200).send({
            msg: 'Thành công',
            data: req.user,
        });
    }
}

module.exports = new UserController();