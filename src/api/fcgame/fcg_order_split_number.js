import service from '@/utils/request'

// 创建FcgOrderSplitNumber
export const createFcgOrderSplitNumber = (data) => {
     return service({
         url: "/fcg_order_split_number/create",
         method: 'post',
         data
     })
 }


// 删除FcgOrderSplitNumber
 export const deleteFcgOrderSplitNumber = (data) => {
     return service({
         url: "/fcg_order_split_number/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgOrderSplitNumber
 export const deleteFcgOrderSplitNumberByIds = (data) => {
     return service({
         url: "/fcg_order_split_number/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgOrderSplitNumber
 export const updateFcgOrderSplitNumber = (data) => {
     return service({
         url: "/fcg_order_split_number/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgOrderSplitNumber
 export const findFcgOrderSplitNumber = (params) => {
     return service({
         url: "/fcg_order_split_number/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgOrderSplitNumber列表
 export const getFcgOrderSplitNumberList = (params) => {
     return service({
         url: "/fcg_order_split_number/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgOrderSplitNumber
  export const batchFcgOrderSplitNumberOperation = (data) => {
      return service({
          url: "/fcg_order_split_number/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgOrderSplitNumberSummary = (params) => {
    return service({
        url: "/fcg_order_split_number/getSummary",
        method: 'get',
        params
    })
}