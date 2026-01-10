import service from '@/utils/request'

// 分页获取FcgTransferoutSplitList列表
export const getFcgTransOrderList = (params) => {
    return service({
        url: "/fcg_transorder_rick/getList",
        method: 'get',
        params
    })
}