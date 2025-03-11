/*
 * @Description: 入离职
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-15 09:47:05
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-15 12:06:38
 */
import request from '@/utils/request'

// 查询人事入离职列表
export function getPage(query) {
    return request({
      url: '/system/exit/list',
      method: 'GET',
      params: query
    })
}
// 查询人事入离职列表统计
export function getStatistics(data) {
    return request({
      url: '/system/exit/dataStatistics',
      method: 'POST',
      data: data
    })
}
// 部门树
export function deptList(query) {
  return request({
    url: 'system/user/deptTree',
    method: 'GET',
    params: query
  })
}

// 新增入离职
export function getAdd(data) {
  return request({
    url: '/system/exit',
    method: 'POST',
    data: data
  })
}

// 修改入离职
export function getEdit(data) {
  return request({
    url: '/system/exit',
    method: 'PUT',
    data: data
  })
}

// 删除入离职
export function getDelete(id) {
  return request({
    url: '/system/exit/' + id,
    method: 'DELETE',
  })
}

// 入离职详情
export function getDetail(id) {
  return request({
    url: '/system/exit/' + id,
    method: 'GET',
  })
}

