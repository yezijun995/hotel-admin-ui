import request from '@/utils/request'

// 查询客户列表
export function listAccount(query) {
  return request({
    url: '/system/account/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getAccount(accountId) {
  return request({
    url: '/system/account/' + accountId,
    method: 'get'
  })
}

// 新增客户
export function addAccount(data) {
  return request({
    url: '/system/account',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateAccount(data) {
  return request({
    url: '/system/account',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delAccount(accountId) {
  return request({
    url: '/system/account/' + accountId,
    method: 'delete'
  })
}

// 导出客户
export function exportAccount(query) {
  return request({
    url: '/system/account/export',
    method: 'get',
    params: query
  })
}