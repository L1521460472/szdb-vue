/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-07-03 16:20:48
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-07-03 16:21:03
 */
import request from '@/utils/request'

// 财务报表
export function financeData(data) {
  return request({
    url: '/finance/reportForms/data',
    method: 'post',
    data: data
  })
}