const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const defaultRouter = require('./default.route');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/', defaultRouter);
}

module.exports = route;