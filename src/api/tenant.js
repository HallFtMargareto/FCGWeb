import service from '@/utils/request'

// 创建SysTenant
export const createSysTenant = (data) => {
     return service({
         url: "/tenant/create",
         method: 'post',
         data
     })
 }


// 删除SysTenant
 export const deleteSysTenant = (data) => {
     return service({
         url: "/tenant/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysTenant
 export const deleteSysTenantByIds = (data) => {
     return service({
         url: "/tenant/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysTenant
 export const updateSysTenant = (data) => {
     return service({
         url: "/tenant/update",
         method: 'put',
         data
     })
 }


// 用id查询SysTenant
 export const findSysTenant = (params) => {
     return service({
         url: "/tenant/find",
         method: 'get',
         params
     })
 }


// 分页获取SysTenant列表
 export const getSysTenantList = (params) => {
     return service({
         url: "/tenant/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysTenant
  export const batchSysTenantOperation = (data) => {
      return service({
          url: "/tenant/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysTenantSummary = (params) => {
    return service({
        url: "/tenant/getSummary",
        method: 'get',
        params
    })
}