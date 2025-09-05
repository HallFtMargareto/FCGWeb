import service from '@/utils/request'

// 创建SysCommonMobileInfo
export const createSysCommonMobileInfo = (data) => {
     return service({
         url: "/common_mobile_info/create",
         method: 'post',
         data
     })
 }


// 删除SysCommonMobileInfo
 export const deleteSysCommonMobileInfo = (data) => {
     return service({
         url: "/common_mobile_info/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCommonMobileInfo
 export const deleteSysCommonMobileInfoByIds = (data) => {
     return service({
         url: "/common_mobile_info/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCommonMobileInfo
 export const updateSysCommonMobileInfo = (data) => {
     return service({
         url: "/common_mobile_info/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCommonMobileInfo
 export const findSysCommonMobileInfo = (params) => {
     return service({
         url: "/common_mobile_info/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCommonMobileInfo列表
 export const getSysCommonMobileInfoList = (params) => {
     return service({
         url: "/common_mobile_info/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCommonMobileInfo
  export const batchSysCommonMobileInfoOperation = (data) => {
      return service({
          url: "/common_mobile_info/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCommonMobileInfoSummary = (params) => {
    return service({
        url: "/common_mobile_info/getSummary",
        method: 'get',
        params
    })
}