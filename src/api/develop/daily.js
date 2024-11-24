import request from '@/utils/request'

// 查询人事考勤报表列表
export function getPage(data) {
    return request({
      url: '/system/rate/list',
      method: 'GET',
    })
}
// 部门树
export function getUserAssignment(query) {
  return request({
    url: '/develop/assignment/getUserAssignment',
    method: 'POST',
    params: query
  })
}

// 新增人事考勤报表
export function getAdd(data) {
  return request({
    url: '/system/rate',
    method: 'POST',
    data: data
  })
}

// 修改人事考勤报表
export function getEdit(data) {
  return request({
    url: '/system/rate',
    method: 'PUT',
    data: data
  })
}

// 删除人事考勤报表
export function getDelete(id) {
  return request({
    url: '/system/rate/' + id,
    method: 'DELETE',
  })
}

// 人事考勤报表详情
export function getDetail(id) {
  return request({
    url: '/system/rate/' + id,
    method: 'GET',
  })
}

// 导出人事考勤报表列表
export function getExport(data) {
  return request({
    url: '/system/rate/export',
    method: 'POST',
    data: data
  })
}
// 导入人事考勤报表列表
export function getImport(data) {
  return request({
    url: '/system/rate/import',
    method: 'POST',
    data: data
  })
}
// 获取未确认的考勤报表
export function getUnconfirmed() {
  return request({
    url: '/system/rate/getUnconfirmed',
    method: 'GET',
  })
}
// 确认考勤报表
export function getConfirmed() {
  return request({
    url: '/system/rate/confirmed',
    method: 'GET',
  })
}
