import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { getBaseInfo } from "@/api/base";
import { Notification } from 'element-ui';

import { store } from '@/store/index'

const ping = "ping"
const pong = "pong"

export default new Vuex.Store({
    state: {
        ws: null, //建立的连接
        lockReconnect: false, //是否真正建立连接
        timeout: 60000, //60秒一次心跳
        timeoutObj: null, //心跳心跳倒计时
        serverTimeoutObj: null, //心跳倒计时
        timeoutnum: null, //断开 重连倒计时
        msg: null, //接收到的信息
        baseInfo: null
    },
    getters: {
        // 获取接收的信息
        socketMsgs: state => {
            return state.msg
        }
    },
    mutations: {
        //初始化ws 用户登录后调用
        async webSocketInit(state) {
            const res = await getBaseInfo()
            if (res.code != 0) {
                Notification({
                    title: '系统消息',
                    message: "获取系统信息失败",
                    type: 'error'
                })
                return
            }
            state.baseInfo = res.data
            const token = store.getters['user/token']

            let that = this
            //this 创建一个state.ws对象【发送、接收、关闭socket都由这个对象操作】
            state.ws = new WebSocket(state.baseInfo.system.webSocket + "?token=" + token);
            // state.ws = new WebSocket(res.data.system.webSocket);

            state.ws.onopen = function (res) {
                console.log("Connection success...", res);
                // 启动心跳检测
                that.commit("start");
            }

            //接收消息
            state.ws.onmessage = function (res) {
                // console.log(res.data);

                if (res.data === pong) {
                    // 收到服务器信息，心跳重置
                    that.commit("reset");
                } else {
                    state.msg = { ...res };
                    console.log(state.msg, "state.msg");
                }
            }

            state.ws.onclose = function (res) {
                console.log("Connection closed...", res);
                //重连
                that.commit('reconnect');
            }

            state.ws.onerror = function (res) {
                console.log("Connection error...", res);
                //重连
                that.commit('reconnect');
            }

            // 处理Ping/Pong消息
            // state.ws.addEventListener('ping', function (event) {
            //     console.log('Received ping message', event);
            // });
            // state.ws.addEventListener('pong', function (event) {
            //     console.log('Received pong message', event);
            // });
        },
        //重新连接
        reconnect(state) {
            let that = this;
            if (state.lockReconnect) {
                return;
            }
            state.lockReconnect = true;
            //没连接上会一直重连,30秒重试请求重连，设置延迟避免请求过多
            state.timeoutnum &&
                clearTimeout(state.timeoutnum);
            state.timeoutnum = setTimeout(() => {
                //新连接
                that.commit('webSocketInit')
                state.lockReconnect = false;
            }, 5000);
        },
        //重置心跳
        reset(state) {
            let that = this;
            //清除时间
            clearTimeout(state.timeoutObj);
            clearTimeout(state.serverTimeoutObj);
            //重启心跳
            that.commit('start')
        },
        //开启心跳
        start(state) {
            var self = this;
            state.timeoutObj &&
                clearTimeout(state.timeoutObj);
            state.serverTimeoutObj &&
                clearTimeout(state.serverTimeoutObj);
            state.timeoutObj = setTimeout(() => {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                if (state.ws.readyState === 1) {
                    //如果连接正常
                    state.ws.send(ping);
                } else {
                    //否则重连
                    self.commit('reconnect');
                }
                state.serverTimeoutObj = setTimeout(function () {
                    //超时关闭
                    state.ws.close();
                }, state.timeout);
            }, state.timeout);
        },
        send(state, data) {
            if (!state.ws) {
                console.log("socket未初始化,发送失败", data);
                return
            }
            state.ws.send(data)
        }
    },
    actions: {
        webSocketInit({
            commit
        }, url) {
            commit('webSocketInit', url)
        },
        send({
            commit
        }, data) {
            commit('send', data)
        }
    }
})