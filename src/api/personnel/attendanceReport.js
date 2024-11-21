import request from '@/utils/request'

// 查询人事考勤报表列表
export function getPage(data) {
    return request({
      url: '/system/report/list',
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
    url: '/system/report',
    method: 'POST',
    data: data
  })
}

// 修改人事考勤报表
export function getEdit(data) {
  return request({
    url: '/system/report',
    method: 'PUT',
    data: data
  })
}

// 删除人事考勤报表
export function getDelete(id) {
  return request({
    url: '/system/report/' + id,
    method: 'DELETE',
  })
}

// 人事考勤报表详情
export function getDetail(id) {
  return request({
    url: '/system/report/' + id,
    method: 'GET',
  })
}

// 导出人事考勤报表列表
export function getExport(data) {
  return request({
    url: '/system/report/export',
    method: 'POST',
    data: data
  })
}
// 导入人事考勤报表列表
export function getImport(data) {
  return request({
    url: '/system/report/import',
    method: 'POST',
    data: data
  })
}
// 获取未确认的考勤报表
export function getUnconfirmed() {
  return request({
    url: '/system/report/getUnconfirmed',
    method: 'GET',
  })
}
// 确认考勤报表
export function getConfirmed() {
  return request({
    url: '/system/report/confirmed',
    method: 'GET',
  })
}
