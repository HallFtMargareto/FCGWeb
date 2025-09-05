import service from '@/utils/request'

// 创建SysCommonFeedback
export const createSysCommonFeedback = (data) => {
     return service({
         url: "/common_feedback/create",
         method: 'post',
         data
     })
 }


// 删除SysCommonFeedback
 export const deleteSysCommonFeedback = (data) => {
     return service({
         url: "/common_feedback/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCommonFeedback
 export const deleteSysCommonFeedbackByIds = (data) => {
     return service({
         url: "/common_feedback/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCommonFeedback
 export const updateSysCommonFeedback = (data) => {
     return service({
         url: "/common_feedback/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCommonFeedback
 export const findSysCommonFeedback = (params) => {
     return service({
         url: "/common_feedback/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCommonFeedback列表
 export const getSysCommonFeedbackList = (params) => {
     return service({
         url: "/common_feedback/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCommonFeedback
  export const batchSysCommonFeedbackOperation = (data) => {
      return service({
          url: "/common_feedback/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCommonFeedbackSummary = (params) => {
    return service({
        url: "/common_feedback/getSummary",
        method: 'get',
        params
    })
}