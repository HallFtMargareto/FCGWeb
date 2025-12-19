import service from '@/utils/request'

// 创建FcgOrderReidentify
export const createFcgOrderReidentify = (data) => {
    return service({
        url: "/fcg_order_reidentify/create",
        method: 'post',
        data
    })
}


// 删除FcgOrderReidentify
export const deleteFcgOrderReidentify = (data) => {
    return service({
        url: "/fcg_order_reidentify/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgOrderReidentify
export const deleteFcgOrderReidentifyByIds = (data) => {
    return service({
        url: "/fcg_order_reidentify/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgOrderReidentify
export const updateFcgOrderReidentify = (data) => {
    return service({
        url: "/fcg_order_reidentify/update",
        method: 'put',
        data
    })
}


// 用id查询FcgOrderReidentify
export const findFcgOrderReidentify = (params) => {
    return service({
        url: "/fcg_order_reidentify/find",
        method: 'get',
        params
    })
}


// 分页获取FcgOrderReidentify列表
export const getFcgOrderReidentifyList = (params) => {
    return service({
        url: "/fcg_order_reidentify/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgOrderReidentify
export const batchFcgOrderReidentifyOperation = (data) => {
    return service({
        url: "/fcg_order_reidentify/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgOrderReidentifySummary = (params) => {
    return service({
        url: "/fcg_order_reidentify/getSummary",
        method: 'get',
        params
    })
}