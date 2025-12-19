import service from '@/utils/request'

// 创建FcgOrderCancel
export const createFcgOrderCancel = (data) => {
    return service({
        url: "/fcg_order_cancel/create",
        method: 'post',
        data
    })
}


// 删除FcgOrderCancel
export const deleteFcgOrderCancel = (data) => {
    return service({
        url: "/fcg_order_cancel/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgOrderCancel
export const deleteFcgOrderCancelByIds = (data) => {
    return service({
        url: "/fcg_order_cancel/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgOrderCancel
export const updateFcgOrderCancel = (data) => {
    return service({
        url: "/fcg_order_cancel/update",
        method: 'put',
        data
    })
}


// 用id查询FcgOrderCancel
export const findFcgOrderCancel = (params) => {
    return service({
        url: "/fcg_order_cancel/find",
        method: 'get',
        params
    })
}


// 分页获取FcgOrderCancel列表
export const getFcgOrderCancelList = (params) => {
    return service({
        url: "/fcg_order_cancel/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgOrderCancel
export const batchFcgOrderCancelOperation = (data) => {
    return service({
        url: "/fcg_order_cancel/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgOrderCancelSummary = (params) => {
    return service({
        url: "/fcg_order_cancel/getSummary",
        method: 'get',
        params
    })
}