/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-20 15:10:56
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-15 15:27:04
 */
import request from '@/utils/request'

// 回款明细列表
export function collectionList(query) {
  return request({
    url: '/finance/collection/list',
    method: 'GET',
    params: query
  })
}
// 新增回款明细
export function addCollection(data) {
  return request({
    url: '/finance/collection',
    method: 'post',
    data: data
  })
}
// 待回款/待开票金额
export function CollectionPrepare(data) {
  return request({
    url: '/finance/collection/prepare',
    method: 'post',
    data: data
  })
}
// 删除回款明细
export function delCollection(id) {
  return request({
    url: '/finance/collection/del/' + id,
    method: 'POST'
  })
}