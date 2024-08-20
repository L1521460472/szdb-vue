/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-04-12 10:01:35
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-04-12 10:13:41
 */
import request from '@/utils/request'

// 规则制度获取 
export function getInfo(data) {
    return request({
      url: '/institutionally/info/getInfo',
      method: 'post',
      data: data
    })
}

// 规则制度修改
export function upInfo(data) {
  return request({
    url: '/institutionally/info/upInfo',
    method: 'post',
    data: data
  })
}