/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-10 16:55:13
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-25 16:02:00
 */
import request from '@/utils/request'

// 资源日历列表
export function listCalendar(data) {
  return request({
    url: '/arts/project/calendar',
    method: 'post',
    data: data
  })
}
// 项目分工列表
export function listDivide(data) {
  return request({
    url: '/arts/project/divide',
    method: 'post',
    data: data
  })
}
// 人员排期列表
export function listScheduling(data) {
  return request({
    url: '/arts/project/scheduling',
    method: 'post',
    data: data
  })
}