import service from '@/utils/request'

// 创建SysEnterprise
export const createSysEnterprise = (data) => {
     return service({
         url: "/enterprise/create",
         method: 'post',
         data
     })
 }


// 删除SysEnterprise
 export const deleteSysEnterprise = (data) => {
     return service({
         url: "/enterprise/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysEnterprise
 export const deleteSysEnterpriseByIds = (data) => {
     return service({
         url: "/enterprise/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysEnterprise
 export const updateSysEnterprise = (data) => {
     return service({
         url: "/enterprise/update",
         method: 'put',
         data
     })
 }


// 用id查询SysEnterprise
 export const findSysEnterprise = (params) => {
     return service({
         url: "/enterprise/find",
         method: 'get',
         params
     })
 }


// 分页获取SysEnterprise列表
 export const getSysEnterpriseList = (params) => {
     return service({
         url: "/enterprise/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysEnterprise
  export const batchSysEnterpriseOperation = (data) => {
      return service({
          url: "/enterprise/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysEnterpriseSummary = (params) => {
    return service({
        url: "/enterprise/getSummary",
        method: 'get',
        params
    })
}