import service from '@/utils/request'

// 创建SysCardOrder
export const createSysCardOrder = (data) => {
     return service({
         url: "/card_order/create",
         method: 'post',
         data
     })
 }


// 删除SysCardOrder
 export const deleteSysCardOrder = (data) => {
     return service({
         url: "/card_order/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCardOrder
 export const deleteSysCardOrderByIds = (data) => {
     return service({
         url: "/card_order/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCardOrder
 export const updateSysCardOrder = (data) => {
     return service({
         url: "/card_order/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCardOrder
 export const findSysCardOrder = (params) => {
     return service({
         url: "/card_order/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCardOrder列表
 export const getSysCardOrderList = (params) => {
     return service({
         url: "/card_order/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCardOrder
  export const batchSysCardOrderOperation = (data) => {
      return service({
          url: "/card_order/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCardOrderSummary = (params) => {
    return service({
        url: "/card_order/getSummary",
        method: 'get',
        params
    })
}