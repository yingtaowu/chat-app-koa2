import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import vueRouter from '../router'
import api from '../api/api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        dialog: false,
        dialoginfo: '',
        socket: '',
        chatdetails: {
            id: '',
            users: {},
            infos: []
        },
        userinfo: {
            name: '',
            src: '',
            roomid: ''
        },
        // 存放历史记录
        msghistory: [],
        robotmsg: [{
            message: 'Hi，有什么需要帮忙的吗？',
            user: '小公仔'
        }],
        chattoggle: false,
        online: false
    },
    getters: {
        getdialog: state => state.dialog,
        getdialoginfo: state => state.dialoginfo,
        getsocket: state => state.socket,
        getmsghistory: state => state.msghistory,
        getusername: state => state.userinfo.name,
        getusersrc: state => state.userinfo.src,
        getuserroom: state => state.userinfo.roomid,
        getusers: state => state.chatdetails.users,
        getinfos: state => state.chatdetails.infos,
        getrobotmsg: state => state.robotmsg,
        getchattoggle: state => state.chattoggle,
        getonline: state => state.online
    },
    mutations: {
        changedialog(state) {
            state.dialog = !state.dialog
        },
        changedialoginfo(state, data) {
            state.dialoginfo = data
        },
        setgetsocket(state, data) {
            state.socket = data
        },
        setusers(state, data) {
            state.chatdetails.users = data
        },
        setusername(state, data) {
            state.userinfo.name = data
        },
        setusersrc(state, data) {
            state.userinfo.src = data
        },
        setuserroom(state, data) {
            state.userinfo.roomid = data
        },
        setmsghistory(state, data) {
            state.msghistory = data
        },
        setgroupdetailinfos(state) {
            state.chatdetails.infos = []
        },
        addgroupdetailinfos(state, data) {
            state.chatdetails.infos.push(data)
        },
        setrobotmsg(state, data) {
            data == 'clean' ? state.robotmsg = [state.robotmsg[0]] : state.robotmsg.push(data)
        },
        changechattoggle(state) {
            state.chattoggle = !state.chattoggle
        },
        openonline(state) {
            state.online = !state.online
        }
    },
    actions: {
        registersubmit({commit}, data) {
            api.userRegister(data)
                .then(({ data }) => {
                    if (data.success) {
                        vueRouter.push('/')
                    }
                    commit('changedialog')
                    commit('changedialoginfo', data.msg)
                }).catch(function (err) {
                    console.log(err)
                })
        },

        loginsubmit({commit}, data) {
            api.userLogin(data)
                .then(({ data }) => {
                    if (data.success) {
                        vueRouter.push('index');
                        commit('setrobotmsg', 'clean')
                        commit('setusername', data.data.name)
                        commit('setusersrc', data.data.src)
                    }
                    commit('changedialog')
                    commit('changedialoginfo', data.msg)
                }).catch(function (err) {
                    console.log(err)
                })
        },

        getmsghistory({commit}, data) {
            api.getMsgHistory(data)
                .then(({data}) => {
                    if (data.success) {
                        commit('setmsghistory', data.data)
                    }
                }).catch(function (err) {
                    console.log(err)
                })
        },

        getrobatmess({commit}, data) {
            var robotdata = ''
            api.chatToRobot(data)
                .then(({data}) => {
                    robotdata = JSON.parse(data.data)
                    //分类信息
                    if (robotdata.code === 100000) {
                        commit('setrobotmsg', { message: robotdata.text, user: '小公仔' })
                    } else if (robotdata.code === 200000) {
                        let data = robotdata.text + robotdata.url
                        commit('setrobotmsg', { message: data, user: '小公仔' })
                    } else if (robotdata.code === 302000) {
                        commit('setrobotmsg', { message: '暂不支持此类对话', user: '小公仔' })
                    } else {
                        commit('setrobotmsg', { message: '暂不支持此类对话', user: '小公仔' })
                    }
                }).catch(function (err) {
                    console.log(err)
                })
        },

        uploadimg({commit}, data) {
            api.sendImg(data)
                .then(({data}) => {
                    if (data.success) {
                        console.log('上传成功')
                    }
                }).catch(function (err) {
                    console.log(err)
                })
        }
    }
});

export default store