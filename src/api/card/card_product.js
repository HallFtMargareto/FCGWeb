import service from '@/utils/request'

// 创建SysCardProduct
export const createSysCardProduct = (data) => {
     return service({
         url: "/card_product/create",
         method: 'post',
         data
     })
 }


// 删除SysCardProduct
 export const deleteSysCardProduct = (data) => {
     return service({
         url: "/card_product/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCardProduct
 export const deleteSysCardProductByIds = (data) => {
     return service({
         url: "/card_product/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCardProduct
 export const updateSysCardProduct = (data) => {
     return service({
         url: "/card_product/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCardProduct
 export const findSysCardProduct = (params) => {
     return service({
         url: "/card_product/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCardProduct列表
 export const getSysCardProductList = (params) => {
     return service({
         url: "/card_product/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCardProduct
  export const batchSysCardProductOperation = (data) => {
      return service({
          url: "/card_product/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCardProductSummary = (params) => {
    return service({
        url: "/card_product/getSummary",
        method: 'get',
        params
    })
}