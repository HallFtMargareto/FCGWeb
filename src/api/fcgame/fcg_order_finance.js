import service from '@/utils/request'

// 创建FcgOrderFinance
export const createFcgOrderFinance = (data) => {
    return service({
        url: "/fcg_order_finance/create",
        method: 'post',
        data
    })
}


// 删除FcgOrderFinance
export const deleteFcgOrderFinance = (data) => {
    return service({
        url: "/fcg_order_finance/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgOrderFinance
export const deleteFcgOrderFinanceByIds = (data) => {
    return service({
        url: "/fcg_order_finance/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgOrderFinance
export const updateFcgOrderFinance = (data) => {
    return service({
        url: "/fcg_order_finance/update",
        method: 'put',
        data
    })
}


// 用id查询FcgOrderFinance
export const findFcgOrderFinance = (params) => {
    return service({
        url: "/fcg_order_finance/find",
        method: 'get',
        params
    })
}


// 分页获取FcgOrderFinance列表
export const getFcgOrderFinanceList = (params) => {
    return service({
        url: "/fcg_order_finance/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgOrderFinance
export const batchFcgOrderFinanceOperation = (data) => {
    return service({
        url: "/fcg_order_finance/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgOrderFinanceSummary = (params) => {
    return service({
        url: "/fcg_order_finance/getSummary",
        method: 'get',
        params
    })
}
