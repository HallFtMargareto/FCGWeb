import service from '@/utils/request'

// @Tags SysSettings
// @Summary 创建SysSettings
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysSettings true "创建SysSettings"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /sysSettings/createSysSettings [post]
export const createSysSettings = (data) => {
    return service({
        url: "/sysSettings/createSysSettings",
        method: 'post',
        data
    })
}


// @Tags SysSettings
// @Summary 删除SysSettings
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysSettings true "删除SysSettings"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /sysSettings/deleteSysSettings [delete]
export const deleteSysSettings = (data) => {
    return service({
        url: "/sysSettings/deleteSysSettings",
        method: 'delete',
        data
    })
}

// @Tags SysSettings
// @Summary 删除SysSettings
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除SysSettings"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /sysSettings/deleteSysSettings [delete]
export const deleteSysSettingsByIds = (data) => {
    return service({
        url: "/sysSettings/deleteSysSettingsByIds",
        method: 'delete',
        data
    })
}

// @Tags SysSettings
// @Summary 更新SysSettings
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysSettings true "更新SysSettings"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /sysSettings/updateSysSettings [put]
export const updateSysSettings = (data, params) => {
    return service({
        url: "/sysSettings/updateSysSettings",
        method: 'put',
        data,
        params
    })
}


// @Tags SysSettings
// @Summary 用id查询SysSettings
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysSettings true "用id查询SysSettings"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /sysSettings/findSysSettings [get]
export const findSysSettings = (params) => {
    return service({
        url: "/sysSettings/findSysSettings",
        method: 'get',
        params
    })
}


// @Tags SysSettings
// @Summary 分页获取SysSettings列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.PageInfo true "分页获取SysSettings列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /sysSettings/getSysSettingsList [get]
export const getSysSettingsList = (params) => {
    return service({
        url: "/sysSettings/getSysSettingsList",
        method: 'get',
        params
    })
}