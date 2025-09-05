import service from '@/utils/request'

// 创建SysCommonProvinceInfo
export const createSysCommonProvinceInfo = (data) => {
     return service({
         url: "/common_province_info/create",
         method: 'post',
         data
     })
 }


// 删除SysCommonProvinceInfo
 export const deleteSysCommonProvinceInfo = (data) => {
     return service({
         url: "/common_province_info/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCommonProvinceInfo
 export const deleteSysCommonProvinceInfoByIds = (data) => {
     return service({
         url: "/common_province_info/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCommonProvinceInfo
 export const updateSysCommonProvinceInfo = (data) => {
     return service({
         url: "/common_province_info/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCommonProvinceInfo
 export const findSysCommonProvinceInfo = (params) => {
     return service({
         url: "/common_province_info/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCommonProvinceInfo列表
 export const getSysCommonProvinceInfoList = (params) => {
     return service({
         url: "/common_province_info/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCommonProvinceInfo
  export const batchSysCommonProvinceInfoOperation = (data) => {
      return service({
          url: "/common_province_info/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCommonProvinceInfoSummary = (params) => {
    return service({
        url: "/common_province_info/getSummary",
        method: 'get',
        params
    })
}