
import service from '@/utils/request'

// 创建SysAdminPermission
export const createSysAdminPermission = (data) => {
    return service({
        url: "/sysAdminPermission/create",
        method: 'post',
        data
    })
}


// 删除SysAdminPermission
export const deleteSysAdminPermission = (data) => {
    return service({
        url: "/sysAdminPermission/delete",
        method: 'delete',
        data
    })
}

// 批量删除SysAdminPermission
export const deleteSysAdminPermissionByIds = (data) => {
    return service({
        url: "/sysAdminPermission/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新SysAdminPermission
export const updateSysAdminPermission = (data) => {
    return service({
        url: "/sysAdminPermission/update",
        method: 'put',
        data
    })
}


// 用id查询SysAdminPermission
export const findSysAdminPermission = (params) => {
    return service({
        url: "/sysAdminPermission/find",
        method: 'get',
        params
    })
}


// 分页获取SysAdminPermission列表
export const getSysAdminPermissionList = (params) => {
    return service({
        url: "/sysAdminPermission/getList",
        method: 'get',
        params
    })
}

// 批量操作SysAdminPermission
export const batchSysAdminPermissionOperation = (data) => {
    return service({
        url: "/sysAdminPermission/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getSysAdminPermissionSummary = (params) => {
    return service({
        url: "/sysAdminPermission/getSummary",
        method: 'get',
        params
    })
}