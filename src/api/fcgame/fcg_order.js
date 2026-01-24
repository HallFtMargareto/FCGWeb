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
export const updateFcgOrder = (data, config = {}) => {
    return service({
        url: "/fcg_order/update",
        method: 'put',
        data,
        ...config
    })
}


// 用id查询FcgOrder
export const findFcgOrder = (params, config = {}) => {
    return service({
        url: "/fcg_order/find",
        method: 'get',
        params,
        ...config
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
export const batchFcgOrderOperation = (data, config = {}) => {
    return service({
        url: "/fcg_order/batchOperation",
        method: 'post',
        data,
        ...config
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

// 查看首页用户组-获取统计数据
export const getBoardAuthorData = (params) => {
    return service({
        url: "/fcg_order/author_dashbpard",
        method: 'get',
        params
    })
}