import service from '@/utils/request'

// 预亏损数据分析
export const preLossDataAnalysis = (data) => {
    return service({
        url: "/fcg_aianalysis/pre_loss",
        method: 'post',
        data
    })
}
