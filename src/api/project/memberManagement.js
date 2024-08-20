/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-20 09:41:34
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-20 11:11:14
 */
import request from '@/utils/request'

// 内部成员列表
export function listHeadquarters(query) {
  return request({
    url: '/arts/headquarters/list',
    method: 'get',
    params: query
  })
}

// 外部成员列表
export function listExternal(query) {
  return request({
      url: '/arts/external/list',
      method: 'get',
      params: query
  })
}
// 新增本部成员
export function addHeadquarters(data) {
  return request({
    url: '/arts/headquarters',
    method: 'post',
    data: data
  })
}
// 新增外部成员
export function addExternal(data) {
  return request({
    url: '/arts/external',
    method: 'post',
    data: data
  })
}
// 修改外部成员
export function editExternal(data) {
  return request({
    url: '/arts/external',
    method: 'put',
    data: data
  })
}