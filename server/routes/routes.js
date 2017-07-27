const UserController = require('../controllers/user.js'),
    childRouter = new (require('koa-router'))()
    childRouters = childRouter
    .post('/signup', UserController.Signup)
    .post('/signin', UserController.Signin)
    .get('/message', UserController.GetMessage)
    .get('/robotapi', UserController.ChatToRobot)
    .post('/uploadimg', UserController.SendImg)

module.exports = childRouters;