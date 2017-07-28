const User = require('../models/user')
const Message = require('../models/message')
const superagent = require('superagent')
const fs = require('fs') //node的文件系统
const multiparty = require('multiparty') //用于上传文件

//注册
const Signup = async (ctx) => {
    let user = new User({
        name: ctx.request.body.name,
        password: ctx.request.body.password,
        src: ctx.request.body.src
    });

    let userInfo = await findUser(user.name);
    if (userInfo) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            msg: '用户名已存在'
        };
    } else {
        await new Promise((resolve, reject) => {
            user.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        ctx.status = 200;
        ctx.body = {
            success: true,
            msg: '注册成功'
        }
    }
};

//登录
const Signin = async (ctx) => {
    let username = ctx.request.body.name
    let password = ctx.request.body.password
    let userInfo = await findUser(username);

    if (!userInfo) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            msg: '用户名不存在'
        };
    } else {
        let isMatch = await userInfo.comparePassword(password);

        if (isMatch) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                msg: '登录成功',
                data: {
                    name: username,
                    src: userInfo.src
                }
            };
        } else {
            ctx.status = 200;
            ctx.body = {
                success: false,
                msg: '密码不正确'
            };
        }
    }
};

//信息
const GetMessage = async (ctx) => {
    let id = ctx.query.roomid;

    let message = await findMessage(id);

    ctx.status = 200;
    ctx.body = {
        success: true,
        data: message
    };
}

//和机器人聊天
const ChatToRobot = async (ctx) => {
    let text = await getRobotMsg(ctx);

    ctx.status = 200;
    ctx.body = {
        success: true,
        data: text
    };
}

//发送图片
const SendImg = async (ctx) => {
    await sendImgProcess(ctx.req)

    ctx.status = 200;
    ctx.body = {
        success: true
    };
}



//根据用户名查找用户
const findUser = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ name: username }, (err, user) => {
            if (err) {
                reject(err);
            }
            resolve(user);
        });
    });
};

// 根据roomid查询聊天信息
const findMessage = (id) => {
    return new Promise((resolve, reject) => {
        Message.find({ roomid: id }, (err, msg) => {
            if (err) {
                reject(err);
            }
            resolve(msg);
        });
    });
};

// 发送图片更新聊天信息表
const updateMessage = (data) => {
    return new Promise((resolve, reject) => {
        Message.save((err, data) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

//获取机器人信息
const getRobotMsg = (data) => {
    return new Promise((resolve, reject) => {
        let info = data.query.info;
        let name = data.query.name;
        let key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'

        //superagent是nodejs里一个非常方便的客户端请求代理模块，当你想处理get,post,put,delete,head请求时,你就应该想起该用它了
        //superagent是一个轻量的,渐进式的ajax api,可读性好,学习曲线低,内部依赖nodejs原生的请求api,适用于nodejs环境下.
        superagent.post('http://www.tuling123.com/openapi/api')
            .send({ info, name, key })
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.text)
            })
    })
}

//发送图片处理
const sendImgProcess = (req) => {
    return new Promise((resolve, reject) => {
        var fileAdr = "./static/files/";
        var form = new multiparty.Form()
        // 设置编辑
        form.encoding = 'utf-8'
        // 设置文件存储路径
        form.uploadDir = fileAdr
        // 设置单文件大小限制
        form.maxFilesSize = 2 * 1024 * 1024
        // form.maxFields = 1000;  设置所以文件的大小总和

        // 上传完成后处理
        form.parse(req, function (err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2)
            if (err) {
                reject(err);
            } else {
                var inputFile = files.file[0]
                var uploadedPath = inputFile.path
                var array = inputFile.originalFilename.split('.')
                var imgtype = array[array.length - 1]
                var dstPath = fileAdr + new Date().getTime() + '.' + imgtype

                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function (err) { //fs node的文件系统
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                })
            }
        })
    })
}

module.exports = {
    Signup,
    Signin,
    GetMessage,
    ChatToRobot,
    SendImg
};