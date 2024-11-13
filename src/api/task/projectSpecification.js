import request from '@/utils/request'

// 查询制作规范列表
export function getPage(data) {
    return request({
      url: '/system/standard/list',
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

// 新增制作规范
export function getAdd(data) {
  return request({
    url: '/system/standard',
    method: 'POST',
    data: data
  })
}

// 修改制作规范
export function getEdit(data) {
  return request({
    url: '/system/standard',
    method: 'PUT',
    data: data
  })
}

// 删除制作规范
export function getDelete(id) {
  return request({
    url: '/system/standard/' + id,
    method: 'DELETE',
  })
}

// 制作规范详情
export function getDetail(id) {
  return request({
    url: '/system/standard/' + id,
    method: 'GET',
  })
}

// 导出制作规范列表
export function getExport(data) {
  return request({
    url: '/system/standard/export',
    method: 'POST',
    data: data
  })
}
