import service from '@/utils/request'

// 创建FcgMessage
export const createFcgMessage = (data) => {
     return service({
         url: "/fcg_message/create",
         method: 'post',
         data
     })
 }


// 删除FcgMessage
 export const deleteFcgMessage = (data) => {
     return service({
         url: "/fcg_message/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgMessage
 export const deleteFcgMessageByIds = (data) => {
     return service({
         url: "/fcg_message/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgMessage
 export const updateFcgMessage = (data) => {
     return service({
         url: "/fcg_message/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgMessage
 export const findFcgMessage = (params) => {
     return service({
         url: "/fcg_message/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgMessage列表
 export const getFcgMessageList = (params) => {
     return service({
         url: "/fcg_message/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgMessage
  export const batchFcgMessageOperation = (data) => {
      return service({
          url: "/fcg_message/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgMessageSummary = (params) => {
    return service({
        url: "/fcg_message/getSummary",
        method: 'get',
        params
    })
}