/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-04-12 10:25:12
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-04-12 10:47:19
 */
import request from '@/utils/request'

// 合同列表
export function contractList(data) {
  return request({
    url: '/finance/contract/list',
    method: 'post',
    data: data
  })
}
// 新增合同
export function addContract(data) {
  return request({
    url: '/finance/contract/add',
    method: 'post',
    data: data
  })
}
// 修改合同
export function updateContract(data) {
  return request({
    url: '/finance/contract/update',
    method: 'post',
    data: data
  })
}
// 删除合同
export function deleteContract(ids) {
  return request({
    url: `/finance/contract/${ids}`,
    method: 'post',
  })
}