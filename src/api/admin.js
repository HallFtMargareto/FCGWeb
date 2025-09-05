import service from '@/utils/request'


// @Summary 用户注册
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/resige [post]
export const register = (data) => {
    return service({
        url: "/admin/register",
        method: 'post',
        data: data
    })
}
// @Summary 修改密码
// @Produce  application/json
// @Param data body {username:"string",password:"string",newPassword:"string"}
// @Router /user/changePassword [post]
export const changePassword = (data) => {
    return service({
        url: "/admin/changePassword",
        method: 'post',
        data: data
    })
}
// @Tags User
// @Summary 分页获取用户列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const getUserList = (data) => {
    return service({
        url: "/admin/getUserList",
        method: 'post',
        data: data
    })
}


// @Tags User
// @Summary 设置用户权限
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.SetUserAuth true "设置用户权限"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/setUserAuthority [post]
export const setUserAuthority = (data) => {
    return service({
        url: "/admin/setUserAuthority",
        method: 'post',
        data: data
    })
}


// @Tags SysAdmin
// @Summary 删除用户
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.SetUserAuth true "删除用户"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/deleteUser [delete]
export const deleteUser = (data) => {
    return service({
        url: "/admin/deleteUser",
        method: 'delete',
        data: data
    })
}

// @Tags SysAdmin
// @Summary 设置用户信息
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysAdmin true "设置用户信息"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/setUserInfo [put]
export const setUserInfo = (data) => {
    return service({
        url: "/admin/setUserInfo",
        method: 'put',
        data: data
    })
}

// 获取用户信息
export const getLoginInfo = (params) => {
    return service({
        url: "/admin/getUserInfo",
        method: 'get',
        params
    })
}

