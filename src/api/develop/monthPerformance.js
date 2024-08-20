import request from '@/utils/request'

// 月绩效列表
export function performanceList(data) {
  return request({
    url: '/develop/performance/list',
    method: 'post',
    data: data
  })
}