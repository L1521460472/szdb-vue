/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-04-17 11:13:05
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-19 09:33:59
 */
import request from '@/utils/request'

// 订单列表
export function orderList(data) {
  return request({
    url: '/develop/order/hierarchy',
    method: 'post',
    data: data
  })
}
// 新增/修改订单
export function addOrUpOrder(data) {
  return request({
    url: '/develop/order/addOrUp',
    method: 'post',
    data: data
  })
}
// 订单详情
export function orderDetail(id) {
  return request({
    url: `/develop/order/getById/${id}`,
    method: 'get',
  })
}
// 订单详情
export function orderDelDetail(id) {
  return request({
    url: `/develop/order/del/${id}`,
    method: 'post',
  })
}
// 根据订单id查询相应总任务统计
export function getTaskCount(id) {
  return request({
    url: `/develop/order/getByIdCount/${id}`,
    method: 'get',
  })
}
// 根据订单查询相应任务列表
export function taskList(data) {
  return request({
    url: `/develop/assignment/list`,
    method: 'post',
    data: data
  })
}

// 新增/修改任务
export function addOrUpTask(data) {
  return request({
    url: '/develop/assignment/addOrUp',
    method: 'post',
    data: data
  })
}
// 任务详情
export function taskDetail(id) {
  return request({
    url: `/develop/assignment/getById/${id}`,
    method: 'get',
  })
}
// 新增/修改成员
export function addOrUpMember(data) {
  return request({
    url: '/develop/member/addOrUp',
    method: 'post',
    data: data
  })
}
// 删除成员
export function delMember(data) {
  return request({
    url: '/develop/member/del/'+ data,
    method: 'post',
    // data: data
  })
}
// 删除任务
export function delAssignment(data) {
  return request({
    url: '/develop/assignment/del/'+ data,
    method: 'get',
    // data: data
  })
}
// 导入任务
export function importAssignment(data) {
  return request({
    url: '/develop/assignment/import/'+ data,
    method: 'post',
    // data: data
  })
}