/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-20 14:06:15
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-20 14:08:18
 */
import request from '@/utils/request'

// 开票记录列表
export function invoiceList(query) {
  return request({
    url: '/finance/invoice/list',
    method: 'GET',
    params: query
  })
}
// 新增开票记录
export function addInvoice(data) {
  return request({
    url: '/finance/invoice',
    method: 'post',
    data: data
  })
}
// 删除开票记录
export function delInvoice(id) {
  return request({
    url: '/finance/invoice/del/' + id,
    method: 'POST'
  })
}