import request from '@/utils/request'

// 查询代办列表  type: 1 我的代办  2 我发起的
export function listInfo(data) {
    return request({
      url: '/prepare/info/list',
      method: 'post',
      data: data
    })
}

// 完成待办
export function infoOperate(data) {
  return request({
    url: '/prepare/info/operate',
    method: 'post',
    data: data
  })
}

// 完成待办
export function delOperate(id) {
  return request({
    url: '/prepare/info/' + id,
    method: 'post',
  })
}