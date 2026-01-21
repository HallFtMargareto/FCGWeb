import service from '@/utils/request'

// 创建FcgTenantChannelSubmitRecord
export const createFcgTenantChannelSubmitRecord = (data) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/create",
         method: 'post',
         data
     })
 }


// 删除FcgTenantChannelSubmitRecord
 export const deleteFcgTenantChannelSubmitRecord = (data) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgTenantChannelSubmitRecord
 export const deleteFcgTenantChannelSubmitRecordByIds = (data) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgTenantChannelSubmitRecord
 export const updateFcgTenantChannelSubmitRecord = (data) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgTenantChannelSubmitRecord
 export const findFcgTenantChannelSubmitRecord = (params) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgTenantChannelSubmitRecord列表
 export const getFcgTenantChannelSubmitRecordList = (params) => {
     return service({
         url: "/fcg_tenant_channel_submit_record/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgTenantChannelSubmitRecord
  export const batchFcgTenantChannelSubmitRecordOperation = (data) => {
      return service({
          url: "/fcg_tenant_channel_submit_record/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgTenantChannelSubmitRecordSummary = (params) => {
    return service({
        url: "/fcg_tenant_channel_submit_record/getSummary",
        method: 'get',
        params
    })
}