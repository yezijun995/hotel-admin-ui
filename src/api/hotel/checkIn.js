import request from '@/utils/request'

// 查询入住退房登记管理列表
export function listCheckIn(query) {
  return request({
    url: '/hotel/checkIn/list',
    method: 'get',
    params: query
  })
}

// 查询入住退房登记管理详细
export function getCheckIn(checkInId) {
  return request({
    url: '/hotel/checkIn/' + checkInId,
    method: 'get'
  })
}

// 新增入住退房登记管理
export function addCheckIn(data) {
  return request({
    url: '/hotel/checkIn',
    method: 'post',
    data: data
  })
}

// 修改入住退房登记管理
export function updateCheckIn(data) {
  return request({
    url: '/hotel/checkIn',
    method: 'put',
    data: data
  })
}

// 入住登记管理
export function checkIn(data) {
  return request({
    url: '/hotel/checkIn/in',
    method: 'put',
    data: data
  })
}

// 退房登记管理
export function checkOut(checkInId) {
  return request({
    url: '/hotel/checkIn/checkOut/' + checkInId,
    method: 'delete'
  })
}

// 删除入住退房登记管理
export function delCheckIn(checkInId) {
  return request({
    url: '/hotel/checkIn/' + checkInId,
    method: 'delete'
  })
}

// 取消入住退房登记管理
export function cancel(checkInId) {
  return request({
    url: '/hotel/checkIn/cancel/' + checkInId,
    method: 'delete'
  })
}

// 导出入住退房登记管理
export function exportCheckIn(query) {
  return request({
    url: '/hotel/checkIn/export',
    method: 'get',
    params: query
  })
}
