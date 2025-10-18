import service from '@/utils/request'

// 获取期号统计数据
export const getIssueStatistics = (params) => {
    return service({
        url: "/fcg_stat/getIssueStatistics",
        method: 'get',
        params
    })
}
