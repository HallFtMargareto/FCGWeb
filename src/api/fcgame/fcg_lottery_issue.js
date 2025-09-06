import service from '@/utils/request'

// 创建FcgLotteryIssue
export const createFcgLotteryIssue = (data) => {
     return service({
         url: "/fcg_lottery_issue/create",
         method: 'post',
         data
     })
 }


// 删除FcgLotteryIssue
 export const deleteFcgLotteryIssue = (data) => {
     return service({
         url: "/fcg_lottery_issue/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgLotteryIssue
 export const deleteFcgLotteryIssueByIds = (data) => {
     return service({
         url: "/fcg_lottery_issue/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgLotteryIssue
 export const updateFcgLotteryIssue = (data) => {
     return service({
         url: "/fcg_lottery_issue/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgLotteryIssue
 export const findFcgLotteryIssue = (params) => {
     return service({
         url: "/fcg_lottery_issue/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgLotteryIssue列表
 export const getFcgLotteryIssueList = (params) => {
     return service({
         url: "/fcg_lottery_issue/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgLotteryIssue
  export const batchFcgLotteryIssueOperation = (data) => {
      return service({
          url: "/fcg_lottery_issue/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgLotteryIssueSummary = (params) => {
    return service({
        url: "/fcg_lottery_issue/getSummary",
        method: 'get',
        params
    })
}