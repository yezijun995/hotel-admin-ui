import request from '@/utils/request'

// 查询房间管理列表
export function listRoom(query) {
  return request({
    url: '/hotel/room/list',
    method: 'get',
    params: query
  })
}

// 查询房间管理详细
export function getRoom(roomId) {
  return request({
    url: '/hotel/room/' + roomId,
    method: 'get'
  })
}

// 新增房间管理
export function addRoom(data) {
  return request({
    url: '/hotel/room',
    method: 'post',
    data: data
  })
}

// 修改房间管理
export function updateRoom(data) {
  return request({
    url: '/hotel/room',
    method: 'put',
    data: data
  })
}

// 删除房间管理
export function delRoom(roomId) {
  return request({
    url: '/hotel/room/' + roomId,
    method: 'delete'
  })
}

// 导出房间管理
export function exportRoom(query) {
  return request({
    url: '/hotel/room/export',
    method: 'get',
    params: query
  })
}
