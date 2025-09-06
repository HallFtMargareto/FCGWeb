import service from '@/utils/request'

// 创建FcgUser
export const createFcgUser = (data) => {
     return service({
         url: "/fcg_user/create",
         method: 'post',
         data
     })
 }


// 删除FcgUser
 export const deleteFcgUser = (data) => {
     return service({
         url: "/fcg_user/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgUser
 export const deleteFcgUserByIds = (data) => {
     return service({
         url: "/fcg_user/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgUser
 export const updateFcgUser = (data) => {
     return service({
         url: "/fcg_user/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgUser
 export const findFcgUser = (params) => {
     return service({
         url: "/fcg_user/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgUser列表
 export const getFcgUserList = (params) => {
     return service({
         url: "/fcg_user/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgUser
  export const batchFcgUserOperation = (data) => {
      return service({
          url: "/fcg_user/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgUserSummary = (params) => {
    return service({
        url: "/fcg_user/getSummary",
        method: 'get',
        params
    })
}