/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-07 19:43:54
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-25 14:48:33
 */
import request from '@/utils/request'

// 获取学习统计列表
export function getPage(data) {
    return request({
      url: '/system/user/LearningStatistics',
      method: 'POST',
      data: data
    })
}

// 员工手册进度详情
export function getDetail() {
  return request({
    url: '/home/task/getInfo',
    method: 'GET',
  })
}

// 一键推送
export function getAdd(data) {
  return request({
    url: '/system/user/push/' + data,
    method: 'POST',
    // data: data
  })
}

// 修改员工手册
export function getEdit(data) {
  return request({
    url: '/system/manual',
    method: 'PUT',
    data: data
  })
}

// 删除员工手册
export function getDelete(id) {
  return request({
    url: '/system/manual/' + id,
    method: 'DELETE',
  })
}

// 查询员工进度
export function getLearn(data) {
  return request({
    url: '/system/manual/getLearn',
    method: 'POST',
    data: data
  })
}

// 添加员工进度
export function getLearnAdd(id) {
  return request({
    url: '/system/manual/addLearn/' + id,
    method: 'POST',
  })
}

// 查询员工手册列表
export function getPage1(data) {
  return request({
    url: '/system/manual/list',
    method: 'GET',
    data: data
  })
}