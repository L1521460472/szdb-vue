/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 09:26:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-24 09:50:19
 */
import request from '@/utils/request'

// 查询每日进度列表
export function listRate(data) {
  return request({
    url: '/arts/rate/list',
    method: 'post',
    data: data
  })
}
// 新增每日进度
export function addRate(data) {
  return request({
    url: '/arts/rate',
    method: 'post',
    data: data
  })
}
// 项目进度详情
export function getRate() {
  return request({
    url: '/arts/rate/getInfo',
    method: 'GET',
  })
}
// 成员列表
export function userList(query) {
  return request({
    url: '/system/user/all',
    method: 'GET',
    params: query
  })
}
// 查询项目列表
// export function listProject(query) {
//   return request({
//     url: '/arts/project/list',
//     method: 'get',
//     params: query
//   })
// }
export function listProject(query) {
  return request({
    url: '/arts/project/projectList',
    method: 'get',
    params: query
  })
}
// 项目详情
export function getProject(id) {
  return request({
    url: '/arts/project/' + id,
    method: 'get'
  })
}