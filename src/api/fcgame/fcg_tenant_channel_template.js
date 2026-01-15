import service from '@/utils/request'

// 创建FcgTenantChannelTemplate
export const createFcgTenantChannelTemplate = (data) => {
    return service({
        url: "/fcg_tenant_channel_template/create",
        method: 'post',
        data
    })
}


// 删除FcgTenantChannelTemplate
export const deleteFcgTenantChannelTemplate = (data) => {
    return service({
        url: "/fcg_tenant_channel_template/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgTenantChannelTemplate
export const deleteFcgTenantChannelTemplateByIds = (data) => {
    return service({
        url: "/fcg_tenant_channel_template/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgTenantChannelTemplate
export const updateFcgTenantChannelTemplate = (data) => {
    return service({
        url: "/fcg_tenant_channel_template/update",
        method: 'put',
        data
    })
}


// 用id查询FcgTenantChannelTemplate
export const findFcgTenantChannelTemplate = (params) => {
    return service({
        url: "/fcg_tenant_channel_template/find",
        method: 'get',
        params
    })
}


// 分页获取FcgTenantChannelTemplate列表
export const getFcgTenantChannelTemplateList = (params) => {
    return service({
        url: "/fcg_tenant_channel_template/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgTenantChannelTemplate
export const batchFcgTenantChannelTemplateOperation = (data) => {
    return service({
        url: "/fcg_tenant_channel_template/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgTenantChannelTemplateSummary = (params) => {
    return service({
        url: "/fcg_tenant_channel_template/getSummary",
        method: 'get',
        params
    })
}