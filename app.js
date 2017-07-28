require('./server/config/db.js')
// require('./server/routes.js')

var config = require('./server/config/config.js')

const app = new (require('koa'))(),
    json = require('koa-json'),
    logger = require('koa-logger'),
    resource = require('koa-static'),
    path = require('path'),
    router = new (require('koa-router'))()

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(resource(path.resolve('dist')))
// app.use(routes.routes(), routes.allowedMethods());

//引入子路由
const apiRouter = require('./server/routes/routes.js');

//装载子路由
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date - start;
    console.log('---', this.method, this.url, ms);
});

app.on('error', function (err, ctx) {
    console.log('server error', err);
});

let server = require('http').Server(app.callback())
let io = require('socket.io').listen(server) //利用socketIo创建io对象然后通过io的on方法监听connection事件

var Message = require('./server/models/message')
global.users = {}

io.on('connection', function (socket) {

    socket.on('enterChat', function (obj) { //用于监听用户进入聊天室
        console.log("-----enter----------");
        socket.name = obj.name
        socket.room = obj.roomid
        if (!global.users[obj.roomid]) {
            global.users[obj.roomid] = {}
        }
        global.users[obj.roomid][obj.name] = obj
        socket.join(obj.roomid) //加入某个分组

        io.to(obj.roomid).emit('enterChat', global.users[obj.roomid]) //向某个分组发送消息
        console.log(obj.name + '加入了' + obj.roomid)
    })

    socket.on('message', function (obj) { //监听用户发布聊天内容
        var mess = {
            username: obj.username,
            src: obj.src,
            msg: obj.msg,
            img: obj.img,
            roomid: obj.room
        }

        io.to(mess.roomid).emit('message', mess)  //向所有客户端广播发布的消息
        console.log(obj.username + '对房' + mess.roomid + '说：' + mess.msg)
        var message = new Message(mess)
        message.save(function (err, mess) { //将发送过来的消息进行储存
            if (err) {
                console.log(err)
            }
        })
    })


    socket.on('logout', function (obj) { //用于监听用户退出聊天室
        console.log("global.users--", global.users);
        delete global.users[obj.roomid][obj.name]
        console.log(obj.name + '退出了' + obj.roomid)

        io.to(obj.roomid).emit('logout', global.users[obj.roomid])
    })

})



server.listen(config.port, () => {
    console.log('Koa is listening in' + config.port);
});

module.exports = app