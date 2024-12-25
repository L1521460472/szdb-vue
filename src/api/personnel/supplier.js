/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-19 09:19:28
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-25 15:44:17
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
// 开通、冻结人事供应商
export function getOpenOrClose(data) {
  return request({
    url: `/system/supplier/openOrClose/${data.id}/${data.type}`,
    method: 'POST',
  })
}
// 查询加、解密人事供应商授权用户
export function getSqEncipher(data) {
  return request({
    url: `/system/supplier/sqEncipher`,
    method: 'POST',
    data: data
  })
}
// 加、解密人事供应商
export function getEncipher(data) {
  return request({
    url: `/system/supplier/encipher`,
    method: 'POST',
    data: data
  })
}
// 一键清空人事供应商授权
export function getClearEmpty(ids) {
  return request({
    url: `/system/supplier/clearEmpty/${ids}`,
    method: 'POST',
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
