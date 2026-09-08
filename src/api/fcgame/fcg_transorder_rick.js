import service from '@/utils/request'

// 分页获取FcgTransferoutSplitList列表
export const getFcgTransOrderList = (params) => {
    return service({
        url: "/fcg_transorder_rick/getList",
        method: 'get',
        params
    })
}


// 分页获取FcgTransferoutSplitList列表
export const getFcgTransPDFKList = (params) => {
    return service({
        url: "/fcg_transorder_rick/yksl",
        method: 'get',
        params
    })
}