import service from '@/utils/request'

// 创建SysCommonCityInfo
export const createSysCommonCityInfo = (data) => {
     return service({
         url: "/common_city_info/create",
         method: 'post',
         data
     })
 }


// 删除SysCommonCityInfo
 export const deleteSysCommonCityInfo = (data) => {
     return service({
         url: "/common_city_info/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCommonCityInfo
 export const deleteSysCommonCityInfoByIds = (data) => {
     return service({
         url: "/common_city_info/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCommonCityInfo
 export const updateSysCommonCityInfo = (data) => {
     return service({
         url: "/common_city_info/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCommonCityInfo
 export const findSysCommonCityInfo = (params) => {
     return service({
         url: "/common_city_info/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCommonCityInfo列表
 export const getSysCommonCityInfoList = (params) => {
     return service({
         url: "/common_city_info/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCommonCityInfo
  export const batchSysCommonCityInfoOperation = (data) => {
      return service({
          url: "/common_city_info/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCommonCityInfoSummary = (params) => {
    return service({
        url: "/common_city_info/getSummary",
        method: 'get',
        params
    })
}