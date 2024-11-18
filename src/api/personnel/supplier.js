import request from '@/utils/request'

// 查询人事供应商列表
export function getPage(data) {
    return request({
      url: '/system/supplier/list',
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

// 新增人事考勤报表
export function getAdd(data) {
  return request({
    url: '/system/supplier',
    method: 'POST',
    data: data
  })
}

// 修改人事考勤报表
export function getEdit(data) {
  return request({
    url: '/system/supplier',
    method: 'PUT',
    data: data
  })
}

// 删除人事考勤报表
export function getDelete(id) {
  return request({
    url: '/system/supplier/' + id,
    method: 'DELETE',
  })
}

// 人事考勤报表详情
export function getDetail(id) {
  return request({
    url: '/system/supplier/' + id,
    method: 'GET',
  })
}

// 导出人事考勤报表列表
export function getExport(data) {
  return request({
    url: '/system/supplier/export',
    method: 'POST',
    data: data
  })
}
// 导入人事考勤报表列表
export function getImport(data) {
  return request({
    url: '/system/supplier/import',
    method: 'POST',
    data: data
  })
}
