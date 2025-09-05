import service from '@/utils/request'

// 创建SysCardTag
export const createSysCardTag = (data) => {
     return service({
         url: "/card_tag/create",
         method: 'post',
         data
     })
 }


// 删除SysCardTag
 export const deleteSysCardTag = (data) => {
     return service({
         url: "/card_tag/delete",
         method: 'delete',
         data
     })
 }

// 批量删除SysCardTag
 export const deleteSysCardTagByIds = (data) => {
     return service({
         url: "/card_tag/deleteByIds",
         method: 'delete',
         data
     })
 }

// 更新SysCardTag
 export const updateSysCardTag = (data) => {
     return service({
         url: "/card_tag/update",
         method: 'put',
         data
     })
 }


// 用id查询SysCardTag
 export const findSysCardTag = (params) => {
     return service({
         url: "/card_tag/find",
         method: 'get',
         params
     })
 }


// 分页获取SysCardTag列表
 export const getSysCardTagList = (params) => {
     return service({
         url: "/card_tag/getList",
         method: 'get',
         params
     })
 }

 // 批量操作SysCardTag
  export const batchSysCardTagOperation = (data) => {
      return service({
          url: "/card_tag/batchOperation",
          method: 'post',
          data
      })
  }

// 获取统计数据
export const getSysCardTagSummary = (params) => {
    return service({
        url: "/card_tag/getSummary",
        method: 'get',
        params
    })
}