/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-07 17:26:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-07 20:50:40
 */
import request from '@/utils/request'

// 查询审批列表
export function listApprove(data) {
    return request({
      url: '/home/approve/list',
      method: 'post',
      data: data
    })
}

// 审批
export function approveOperate(data) {
  return request({
    url: '/home/approve/operate',
    method: 'post',
    data: data
  })
}

// 审批详情
export function getTask(id) {
  return request({
    url: '/home/task/' + id,
    method: 'GET',
  })
}
// 待办-未处理消息数量
export function getProcessingDays(id) {
  return request({
    url: '/home/approve/processingDays/' + id,
    method: 'post',
  })
}