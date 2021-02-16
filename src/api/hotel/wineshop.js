import request from '@/utils/request'

// 查询酒店列表
export function listWineshop(query) {
  return request({
    url: '/hotel/wineshop/list',
    method: 'get',
    params: query
  })
}

// 查询酒店详细
export function getWineshop(hotelId) {
  return request({
    url: '/hotel/wineshop/' + hotelId,
    method: 'get'
  })
}

// 新增酒店
export function addWineshop(data) {
  return request({
    url: '/hotel/wineshop',
    method: 'post',
    data: data
  })
}

// 修改酒店
export function updateWineshop(data) {
  return request({
    url: '/hotel/wineshop',
    method: 'put',
    data: data
  })
}

// 查询酒店下拉树结构
export function hotelTreeselect() {
  return request({
    url: '/hotel/wineshop/treeselect',
    method: 'get'
  })
}

// 角色状态修改
export function changeWinshopStatus(hotelId, status) {
  const data = {
    hotelId,
    status
  }
  return request({
    url: '/hotel/wineshop/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除酒店
export function delWineshop(hotelId) {
  return request({
    url: '/hotel/wineshop/' + hotelId,
    method: 'delete'
  })
}

// 导出酒店
export function exportWineshop(query) {
  return request({
    url: '/hotel/wineshop/export',
    method: 'get',
    params: query
  })
}
