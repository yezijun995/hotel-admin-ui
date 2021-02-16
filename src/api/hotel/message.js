import request from '@/utils/request'

// 查询留言管理列表
export function listMessage(query) {
  return request({
    url: '/hotel/message/list',
    method: 'get',
    params: query
  })
}

// 查询留言管理详细
export function getMessage(messageId) {
  return request({
    url: '/hotel/message/' + messageId,
    method: 'get'
  })
}

// 新增留言管理
export function addMessage(data) {
  return request({
    url: '/hotel/message',
    method: 'post',
    data: data
  })
}

// 修改留言管理
export function updateMessage(data) {
  return request({
    url: '/hotel/message',
    method: 'put',
    data: data
  })
}

// 删除留言管理
export function delMessage(messageId) {
  return request({
    url: '/hotel/message/' + messageId,
    method: 'delete'
  })
}

// 导出留言管理
export function exportMessage(query) {
  return request({
    url: '/hotel/message/export',
    method: 'get',
    params: query
  })
}