import request from '@/utils/request'

// 查询订单管理列表
export function listOrders(query) {
  return request({
    url: '/hotel/orders/list',
    method: 'get',
    params: query
  })
}

// 查询订单管理详细
export function getOrders(ordersId) {
  return request({
    url: '/hotel/orders/' + ordersId,
    method: 'get'
  })
}

// 新增订单管理
export function addOrders(data) {
  return request({
    url: '/hotel/orders',
    method: 'post',
    data: data
  })
}

// 修改订单管理
export function updateOrders(data) {
  return request({
    url: '/hotel/orders',
    method: 'put',
    data: data
  })
}

// 删除订单管理
export function delOrders(ordersId) {
  return request({
    url: '/hotel/orders/' + ordersId,
    method: 'delete'
  })
}

// 导出订单管理
export function exportOrders(query) {
  return request({
    url: '/hotel/orders/export',
    method: 'get',
    params: query
  })
}

// 查询用户数
export function getEarnMoney() {
  return request({
    url: '/hotel/orders/money',
    method: 'get'
  })
}

// 查询订单数
export function getOrderCount() {
  return request({
    url: '/hotel/orders/orderCount',
    method: 'get'
  })
}

// 查询订单图表
export function getOrderRadderChart() {
  return request({
    url: '/hotel/orders/orderRadderChart',
    method: 'get'
  })
}

// 查询订单金额图表
export function getOrderBarChartCost() {
  return request({
    url: '/hotel/orders/orderBarChartCost',
    method: 'get'
  })
}
