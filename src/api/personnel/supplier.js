/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-19 09:19:28
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-10 17:28:55
 */
import request from '@/utils/request'

// 查询人事供应商列表
export function getPage(data) {
    return request({
      url: '/system/supplier/list?supplierName='+ data.supplierName + '&locationCity=' + data.locationCity + '&supplierLevel=' + data.supplierLevel + '&supplierScale='+ data.supplierScale + '&scopeBusiness=' + data.scopeBusiness,
      method: 'GET',
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

// 新增人事供应商
export function getAdd(data) {
  return request({
    url: '/system/supplier',
    method: 'POST',
    data: data
  })
}

// 修改人事供应商
export function getEdit(data) {
  return request({
    url: '/system/supplier',
    method: 'PUT',
    data: data
  })
}

// 删除人事供应商
export function getDelete(id) {
  return request({
    url: '/system/supplier/' + id,
    method: 'DELETE',
  })
}

// 人事供应商详情
export function getDetail(id) {
  return request({
    url: '/system/supplier/' + id,
    method: 'GET',
  })
}

// 导出人事供应商列表
export function getExport(data) {
  return request({
    url: '/system/supplier/export',
    method: 'POST',
    data: data
  })
}
// 导入人事供应商列表
export function getImport(data) {
  return request({
    url: '/system/supplier/import',
    method: 'POST',
    data: data
  })
}
