/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-05-27 16:09:46
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-20 14:44:38
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
export function getPage(name,dep,time,page,size) {
  return request({
    url: '/finance/cost/list'+ '?name=' + name + '&department=' + dep + '&wagesTime=' + time + '&pageNum=' + page+ '&pageSize=' + size,
    // url: '/finance/cost/list',
    method: 'GET',
  })
}
// 新增财务员工成本管理
export function getAdd(data) {
  return request({
    url: '/finance/cost',
    method: 'POST',
    data: data
  })
}

// 修改财务员工成本管理
export function getEdit(data) {
  return request({
    url: '/finance/cost',
    method: 'PUT',
    data: data
  })
}

// 删除财务员工成本管理
export function getDelete(id) {
  return request({
    url: '/finance/cost/' + id,
    method: 'DELETE',
  })
}

// 财务员工成本管理详情
export function getDetail(id) {
  return request({
    url: '/finance/cost/' + id,
    method: 'GET',
  })
}

// 导出员工成本管理
export function getExport(data) {
  return request({
    url: '/finance/cost/export',
    method: 'POST',
    data: data
  })
}

// 获取未确认的考勤报表
export function getNotice() {
  return request({
    url: '/finance/cost/notice',
    method: 'GET',
  })
}
// 确认考勤报表
export function confirmNotice() {
  return request({
    url: '/finance/cost/confirmNotice',
    method: 'GET',
  })
}
// 一键推送
export function getPush(id) {
  return request({
    url: '/finance/cost/push/' + id,
    method: 'GET',
  })
}