/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-05-27 16:09:46
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-25 14:35:13
 */
import request from '@/utils/request'

// 查询财务-支出管理列表   支出类型 1.团队支出 2.基础费用
export function expenditureList(query,pageNum,pageSize) {
  return request({
    url: '/finance/expenditure/list?expenditureType=' + query+ '&pageNum='+ pageNum + '&pageSize=' + pageSize,
    method: 'GET',
  })
}
// 删除
export function delExpenditure(id) {
  return request({
    url: '/finance/expenditure/' + id,
    method: 'post',
  })
}
// 查询财务员工成本管理列表
export function getPage(data) {
  return request({
    url: '/system/cost/list',
    method: 'GET',
    data
  })
}
// 新增财务员工成本管理
export function getAdd(data) {
  return request({
    url: '/system/cost',
    method: 'POST',
    data: data
  })
}

// 修改财务员工成本管理
export function getEdit(data) {
  return request({
    url: '/system/cost',
    method: 'PUT',
    data: data
  })
}

// 删除财务员工成本管理
export function getDelete(id) {
  return request({
    url: '/system/cost/' + id,
    method: 'DELETE',
  })
}

// 财务员工成本管理详情
export function getDetail(id) {
  return request({
    url: '/system/cost/' + id,
    method: 'GET',
  })
}

// 导出员工成本管理
export function getExport(data) {
  return request({
    url: '/system/cost/export',
    method: 'POST',
    data: data
  })
}