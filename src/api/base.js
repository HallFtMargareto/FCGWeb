import service from '@/utils/request'

// 获取系统基础信息
export const getBaseInfo = (params) => {
    return service({
        url: "/base/info",
        method: 'get',
        params
    })
}

// @Summary 用户登录
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/login [post]
export const login = (data) => {
    return service({
        url: "/base/login",
        method: 'post',
        data: data
    })
}

// 退出登录
export const logout = () => {
    return service({
        url: "/base/logout",
        method: 'post',
    })
}

// @Summary 获取验证码
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/captcha [post]
export const captcha = (data) => {
    return service({
        url: "/base/captcha",
        method: 'post',
        data: data
    })
}

// 获取第三方登录链接
export const getOauthLink = (params) => {
    return service({
        url: "/base/oauth",
        method: 'get',
        params
    })
}

// 获取登录信息
export const getUserInfo = (params) => {
    return service({
        url: "/base/oauth_info",
        method: 'get',
        params
    })
}