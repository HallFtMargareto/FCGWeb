import service from '@/utils/request'

// 创建FcgFinance
export const createFcgFinance = (data) => {
    return service({
        url: "/fcg_finance/create",
        method: 'post',
        data
    })
}


// 删除FcgFinance
export const deleteFcgFinance = (data) => {
    return service({
        url: "/fcg_finance/delete",
        method: 'delete',
        data
    })
}

// 批量删除FcgFinance
export const deleteFcgFinanceByIds = (data) => {
    return service({
        url: "/fcg_finance/deleteByIds",
        method: 'delete',
        data
    })
}

// 更新FcgFinance
export const updateFcgFinance = (data) => {
    return service({
        url: "/fcg_finance/update",
        method: 'put',
        data
    })
}


// 用id查询FcgFinance
export const findFcgFinance = (params) => {
    return service({
        url: "/fcg_finance/find",
        method: 'get',
        params
    })
}


// 分页获取FcgFinance列表
export const getFcgFinanceList = (params) => {
    return service({
        url: "/fcg_finance/getList",
        method: 'get',
        params
    })
}

// 批量操作FcgFinance
export const batchFcgFinanceOperation = (data) => {
    return service({
        url: "/fcg_finance/batchOperation",
        method: 'post',
        data
    })
}

// 获取统计数据
export const getFcgFinanceSummary = (params) => {
    return service({
        url: "/fcg_finance/getSummary",
        method: 'get',
        params
    })
}