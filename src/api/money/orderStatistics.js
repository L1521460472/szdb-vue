/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 09:26:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-12-24 17:10:42
 */
import request from '@/utils/request'

// 查询项目列表
export function listProject(query) {
    return request({
      url: '/finance/achievements/orderStatistics',
      method: 'post',
      data: query
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
// 项目统计
export function projectStatistics(data) {
    return request({
      url: '/arts/project/projectStatistics',
      method: 'post',
      data: data
    })
}
// 首页绩效统计
export function performanceStatistics(data) {
    return request({
      url: '/home/statistics/performanceStatistics',
      method: 'post',
      data: data
    })
}