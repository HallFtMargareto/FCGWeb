import service from '@/utils/request'

// 创建FcgBettingBatche
export const createFcgBettingBatche = (data) => {
     return service({
         url: "/fcg_betting_batche/create",
         method: 'post',
         data
     })
 }


// 删除FcgBettingBatche
 export const deleteFcgBettingBatche = (data) => {
     return service({
         url: "/fcg_betting_batche/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgBettingBatche
 export const deleteFcgBettingBatcheByIds = (data) => {
     return service({
         url: "/fcg_betting_batche/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgBettingBatche
 export const updateFcgBettingBatche = (data) => {
     return service({
         url: "/fcg_betting_batche/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgBettingBatche
 export const findFcgBettingBatche = (params) => {
     return service({
         url: "/fcg_betting_batche/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgBettingBatche列表
 export const getFcgBettingBatcheList = (params) => {
     return service({
         url: "/fcg_betting_batche/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgBettingBatche
  export const batchFcgBettingBatcheOperation = (data) => {
      return service({
          url: "/fcg_betting_batche/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgBettingBatcheSummary = (params) => {
    return service({
        url: "/fcg_betting_batche/getSummary",
        method: 'get',
        params
    })
}