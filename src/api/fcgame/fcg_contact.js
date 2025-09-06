import service from '@/utils/request'

// 创建FcgContact
export const createFcgContact = (data) => {
     return service({
         url: "/fcg_contact/create",
         method: 'post',
         data
     })
 }


// 删除FcgContact
 export const deleteFcgContact = (data) => {
     return service({
         url: "/fcg_contact/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgContact
 export const deleteFcgContactByIds = (data) => {
     return service({
         url: "/fcg_contact/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgContact
 export const updateFcgContact = (data) => {
     return service({
         url: "/fcg_contact/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgContact
 export const findFcgContact = (params) => {
     return service({
         url: "/fcg_contact/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgContact列表
 export const getFcgContactList = (params) => {
     return service({
         url: "/fcg_contact/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgContact
  export const batchFcgContactOperation = (data) => {
      return service({
          url: "/fcg_contact/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgContactSummary = (params) => {
    return service({
        url: "/fcg_contact/getSummary",
        method: 'get',
        params
    })
}