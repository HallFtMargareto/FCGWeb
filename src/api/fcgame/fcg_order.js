import service from '@/utils/request'

// 创建FcgOrder
export const createFcgOrder = (data) => {
    return service({
        url: "/fcg_order/create",
        method: 'post',
        data
    })
}


// 删除FcgOrder
export const deleteFcgOrder = (data) => {
    return service({
        url: "/fcg_order/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgOrder
export const deleteFcgOrderByIds = (data) => {
    return service({
        url: "/fcg_order/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgOrder
export const updateFcgOrder = (data) => {
    return service({
        url: "/fcg_order/update",
        method: 'put',
        data
    })
}


// 用id查询FcgOrder
export const findFcgOrder = (params) => {
    return service({
        url: "/fcg_order/find",
        method: 'get',
        params
    })
}


// 分页获取FcgOrder列表
export const getFcgOrderList = (params) => {
    return service({
        url: "/fcg_order/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgOrder
export const batchFcgOrderOperation = (data) => {
    return service({
        url: "/fcg_order/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgOrderSummary = (params) => {
    return service({
        url: "/fcg_order/getSummary",
        method: 'get',
        params
    })
}