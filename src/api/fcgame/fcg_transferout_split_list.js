import service from '@/utils/request'

// 创建FcgTransferoutSplitList
export const createFcgTransferoutSplitList = (data) => {
     return service({
         url: "/fcg_transferout_split_list/create",
         method: 'post',
         data
     })
 }


// 删除FcgTransferoutSplitList
 export const deleteFcgTransferoutSplitList = (data) => {
     return service({
         url: "/fcg_transferout_split_list/delete",
         method: 'delete',
         data
     })
 }

// 批量删除FcgTransferoutSplitList
 export const deleteFcgTransferoutSplitListByIds = (data) => {
     return service({
         url: "/fcg_transferout_split_list/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新FcgTransferoutSplitList
 export const updateFcgTransferoutSplitList = (data) => {
     return service({
         url: "/fcg_transferout_split_list/update",
         method: 'put',
         data
     })
 }


// 用id查询FcgTransferoutSplitList
 export const findFcgTransferoutSplitList = (params) => {
     return service({
         url: "/fcg_transferout_split_list/find",
         method: 'get',
         params
     })
 }


// 分页获取FcgTransferoutSplitList列表
 export const getFcgTransferoutSplitListList = (params) => {
     return service({
         url: "/fcg_transferout_split_list/getList",
         method: 'get',
         params
     })
 }

 // 批量操作FcgTransferoutSplitList
  export const batchFcgTransferoutSplitListOperation = (data) => {
      return service({
          url: "/fcg_transferout_split_list/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getFcgTransferoutSplitListSummary = (params) => {
    return service({
        url: "/fcg_transferout_split_list/getSummary",
        method: 'get',
        params
    })
}