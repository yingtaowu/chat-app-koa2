import axios from 'axios'

export default {
    //用户注册
    userRegister(data) {
        return axios.post('/api/signup', data);
    },

    //用户登录
    userLogin(data) {
        return axios.post('/api/signin', data);
    },

    //获取聊天信息
    getMsgHistory(data) {
        return axios.get('/api/message', { params: data });
    },

    //和机器人聊天
    chatToRobot(data) {
        return axios.get('/api/robotapi', { params: data });
    },

    //发送图片
    sendImg(data) {
        var config = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        return axios.post('/api/uploadimg', data, config);
    }
}