import service from '@/utils/request'

// 新建下级账号
export const createFcgTenantUser = (data) => {
  return service({
    url: "/fcg_tenant_user/create",
    method: 'post',
    data
  })
}

// 删除下级账号
export const deleteFcgTenantUser = (data) => {
  return service({
    url: "/fcg_tenant_user/delete",
    method: 'delete',
    data
  })
}

// 更新下级账号信息
export const updateFcgTenantUser = (data) => {
  return service({
    url: "/fcg_tenant_user/update",
    method: 'put',
    data
  })
}

// 根据ID获取下级账号详情
export const findFcgTenantUser = (params) => {
  return service({
    url: "/fcg_tenant_user/find",
    method: 'get',
    params
  })
}

// 分页获取下级账号列表
export const getFcgTenantUserList = (params) => {
  return service({
    url: "/fcg_tenant_user/getList",
    method: 'get',
    params
  })
}

// 重置下级账号密码
export const resetFcgTenantUserPassword = (data) => {
  return service({
    url: "/fcg_tenant_user/resetPassword",
    method: 'put',
    data
  })
}
