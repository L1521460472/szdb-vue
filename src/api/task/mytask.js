/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-07 17:26:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-24 10:32:36
 */
import request from '@/utils/request'

// 查询任务列表
export function listTask(data) {
    return request({
      url: '/home/task/list',
      method: 'post',
      data: data
    })
}

// 新增任务获取进度详情
export function getInfo() {
  return request({
    url: '/home/task/getInfo',
    method: 'GET',
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/home/task',
    method: 'post',
    data: data
  })
}

// 修改任务
export function editTask(data) {
  return request({
    url: '/home/task/edit',
    method: 'post',
    data: data
  })
}

// 操作 提交、撤回
export function operate(data) {
  return request({
    url: '/home/task/operate',
    method: 'post',
    data: data
  })
}

// 任务详情
export function getTask(id) {
  return request({
    url: '/home/task/' + id,
    method: 'post',
  })
}
// 任务详情
export function delTask(id) {
  return request({
    url: '/home/task/' + id,
    method: 'DELETE',
  })
}