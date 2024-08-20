/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 09:26:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-02-19 17:54:41
 */
import request from '@/utils/request'

// 月度绩效列表
export function listAchievements(data) {
  return request({
    url: '/finance/achievements/list',
    method: 'post',
    data: data
  })
}

// 查询企业列表
export function listCategoryDetail(id) {
    return request({
        url: '/arts/category/' + id,
        method: 'get',
    })
}

// 部门列表
export function deptList(query) {
    return request({
      url: 'system/user/deptTree',
      method: 'GET',
      params: query
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