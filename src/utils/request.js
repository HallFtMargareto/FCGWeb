import axios from 'axios'; // 引入axios
import { Message } from 'element-ui';
import { store } from '@/store/index'
import context from '@/main.js'
// import router from '@/router/index'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 99999
})
let activeAxios = 0
let loadingTimeout = null

// 优化后的 showLoading 函数
const showLoading = () => {
    activeAxios++
    // 清除之前的定时器
    if (loadingTimeout) {
        clearTimeout(loadingTimeout)
    }

    // 对于快速请求(小于400ms)，确保也能显示loading
    loadingTimeout = setTimeout(() => {
        if (activeAxios > 0) {
            context.$bus.emit("showLoading")
        }
    }, 100); // 降低延迟时间，提高用户体验
}

// 优化后的 closeLoading 函数
const closeLoading = () => {
    activeAxios = Math.max(0, activeAxios - 1); // 防止计数器变为负数

    if (activeAxios <= 0) {
        if (loadingTimeout) {
            clearTimeout(loadingTimeout)
        }
        context.$bus.emit("closeLoading")
    }
}

//http request 拦截器
service.interceptors.request.use(
    config => {
        if (!config.donNotShowLoading) {
            showLoading()
        }
        const token = store.getters['user/token']
        const user = store.getters['user/userInfo']
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json',
            'x-token': token,
            'x-user-id': user.ID
        }
        return config;
    },
    error => {
        closeLoading()
        Message({
            showClose: true,
            message: error,
            type: 'error'
        })
        return error;
    }
);

// ✅ 修复后的 response 拦截器
service.interceptors.response.use(
    response => {
        closeLoading();
        // 👇 关键：如果是文件下载（blob/arraybuffer），直接返回完整 response 对象！
        if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
            return response; // ← 让调用者能访问 headers、status、data(Blob)
        }
        // 👇 其他情况：按原来业务逻辑处理
        if (response.headers["new-token"]) {
            store.commit('user/setToken', response.headers["new-token"]);
        }
        if (response.data.code === 0 || response.headers.success === "true") {
            return response.data; // 普通请求返回数据
        } else {
            if (response.data.msg) {
                Message({
                    showClose: true,
                    message: response.data.msg || decodeURI(response.headers.msg),
                    type: response.headers.msgtype || 'error',
                });
            }
            if (response.data.data && response.data.data.reload) {
                if (response.data.data.reason != "") {
                    Message({
                        showClose: true,
                        message: response.data.data.reason,
                        type: 'error'
                    })
                    // 延迟1.5秒后执行登出，给用户足够时间看到消息
                    setTimeout(() => {
                        store.commit('user/LoginOut');
                    }, 1500);
                    return
                }
            }
            store.commit('user/LoginOut');
            return response.data.msg ? response.data : response;
        }
    },
    error => {
        closeLoading();
        Message({ showClose: true, message: error, type: 'error' });
        return Promise.reject(error);
    }
);

export default service