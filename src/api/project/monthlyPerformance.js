/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-25 09:46:03
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-25 09:47:45
 */
import request from '@/utils/request'

// 月绩效列表
export function listAchievements(data) {
  return request({
    url: '/arts/rate/achievements/list',
    method: 'post',
    data: data
  })
}