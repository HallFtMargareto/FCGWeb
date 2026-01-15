import service from '@/utils/request'

// 创建FcgOrderAlter
export const createFcgOrderAlter = (data) => {
     return service({
         url: "/fcg_order_alter/create",
         method: 'post',
         data
     })
 }


// 删除FcgOrderAlter
 export const deleteFcgOrderAlter = (data) => {
     return service({
         url: "/fcg_order_alter/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgOrderAlter
 export const deleteFcgOrderAlterByIds = (data) => {
     return service({
         url: "/fcg_order_alter/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgOrderAlter
 export const updateFcgOrderAlter = (data) => {
     return service({
         url: "/fcg_order_alter/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgOrderAlter
 export const findFcgOrderAlter = (params) => {
     return service({
         url: "/fcg_order_alter/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgOrderAlter列表
 export const getFcgOrderAlterList = (params) => {
     return service({
         url: "/fcg_order_alter/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgOrderAlter
  export const batchFcgOrderAlterOperation = (data) => {
      return service({
          url: "/fcg_order_alter/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgOrderAlterSummary = (params) => {
    return service({
        url: "/fcg_order_alter/getSummary",
        method: 'get',
        params
    })
}