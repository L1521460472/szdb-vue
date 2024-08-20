import request from '@/utils/request'

// 模板列表
export function listTemplate(query) {
  return request({
    url: '/arts/template/list',
    method: 'get',
    params: query
  })
}

// 删除模板
export function delTemplate(id) {
return request({
    url: '/arts/template/' + id,
    method: 'delete'
})
}