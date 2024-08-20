/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-06-13 11:40:46
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-06-13 16:19:15
 */
import request from '@/utils/request'

// 考勤列表
export function attendanceList(query) {
  return request({
    url: '/personnel/attendance/list',
    method: 'get',
    params: query
  })
}
// 考勤明细列表
export function attendanceDetail(data) {
  return request({
    url: '/personnel/attendance/getDetail',
    method: 'post',
    data: data
  })
}