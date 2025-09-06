import service from '@/utils/request'

// 创建FcgOrderDetail
export const createFcgOrderDetail = (data) => {
     return service({
         url: "/fcg_order_detail/create",
         method: 'post',
         data
     })
 }


// 删除FcgOrderDetail
 export const deleteFcgOrderDetail = (data) => {
     return service({
         url: "/fcg_order_detail/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgOrderDetail
 export const deleteFcgOrderDetailByIds = (data) => {
     return service({
         url: "/fcg_order_detail/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgOrderDetail
 export const updateFcgOrderDetail = (data) => {
     return service({
         url: "/fcg_order_detail/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgOrderDetail
 export const findFcgOrderDetail = (params) => {
     return service({
         url: "/fcg_order_detail/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgOrderDetail列表
 export const getFcgOrderDetailList = (params) => {
     return service({
         url: "/fcg_order_detail/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgOrderDetail
  export const batchFcgOrderDetailOperation = (data) => {
      return service({
          url: "/fcg_order_detail/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgOrderDetailSummary = (params) => {
    return service({
        url: "/fcg_order_detail/getSummary",
        method: 'get',
        params
    })
}