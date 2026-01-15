import service from '@/utils/request'

// 创建FcgTenantChannel
export const createFcgTenantChannel = (data) => {
    return service({
        url: "/fcg_tenant_channel/create",
        method: 'post',
        data
    })
}


// 删除FcgTenantChannel
export const deleteFcgTenantChannel = (data) => {
    return service({
        url: "/fcg_tenant_channel/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgTenantChannel
export const deleteFcgTenantChannelByIds = (data) => {
    return service({
        url: "/fcg_tenant_channel/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgTenantChannel
export const updateFcgTenantChannel = (data) => {
    return service({
        url: "/fcg_tenant_channel/update",
        method: 'put',
        data
    })
}


// 用id查询FcgTenantChannel
export const findFcgTenantChannel = (params) => {
    return service({
        url: "/fcg_tenant_channel/find",
        method: 'get',
        params
    })
}


// 分页获取FcgTenantChannel列表
export const getFcgTenantChannelList = (params) => {
    return service({
        url: "/fcg_tenant_channel/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgTenantChannel
export const batchFcgTenantChannelOperation = (data) => {
    return service({
        url: "/fcg_tenant_channel/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgTenantChannelSummary = (params) => {
    return service({
        url: "/fcg_tenant_channel/getSummary",
        method: 'get',
        params
    })
}