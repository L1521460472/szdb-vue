/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-05-27 16:09:46
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-25 14:35:13
 */
import request from '@/utils/request'

// 查询财务-支出管理列表   支出类型 1.团队支出 2.基础费用
export function expenditureList(query,pageNum,pageSize) {
  return request({
    url: '/finance/expenditure/list?expenditureType=' + query+ '&pageNum='+ pageNum + '&pageSize=' + pageSize,
    method: 'GET',
  })
}
// 删除
export function delExpenditure(id) {
  return request({
    url: '/finance/expenditure/' + id,
    method: 'post',
  })
}