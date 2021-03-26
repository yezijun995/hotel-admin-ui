import request from '@/utils/request'

// 查询房间类型列表
export function listRoomType(query) {
  return request({
    url: '/hotel/roomType/list',
    method: 'get',
    params: query
  })
}

// 查询房间类型详细
export function getRoomType(roomTypeId) {
  return request({
    url: '/hotel/roomType/' + roomTypeId,
    method: 'get'
  })
}

// 新增房间类型
export function addRoomType(data) {
  return request({
    url: '/hotel/roomType',
    method: 'post',
    data: data
  })
}

// 修改房间类型
export function updateRoomType(data) {
  return request({
    url: '/hotel/roomType',
    method: 'put',
    data: data
  })
}

// 查询酒店下拉树结构
export function roomTypeTreeselect() {
  return request({
    url: '/hotel/roomType/treeselect',
    method: 'get'
  })
}

// 删除房间类型
export function delRoomType(roomTypeId) {
  return request({
    url: '/hotel/roomType/' + roomTypeId,
    method: 'delete'
  })
}

// 导出房间类型
export function exportRoomType(query) {
  return request({
    url: '/hotel/roomType/export',
    method: 'get',
    params: query
  })
}

// 导出房间类型
export function getPieChartRoomType(query) {
  return request({
    url: '/hotel/roomType/pieChart',
    method: 'get'
  })
}
