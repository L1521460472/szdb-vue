/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 09:26:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-02-25 10:52:29
 */
import request from '@/utils/request'

// 查询人事简历列表
export function listResume(query) {
  return request({
    url: '/personnel/resume/list',
    method: 'get',
    params: query
  })
}
// 查询岗位下拉列表
export function listPost(query) {
  return request({
    url: '/system/post/optionselect',
    method: 'get',
    params: query
  })
}

// 新增简历
export function addResume(data) {
  return request({
    url: '/personnel/resume',
    method: 'post',
    data: data
  })
}

// 修改简历
export function editResume(data) {
  return request({
    url: '/personnel/resume',
    method: 'put',
    data: data
  })
}

// 删除简历
export function delResume(id) {
  return request({
    url: '/personnel/resume/' + id,
    method: 'delete'
  })
}

// 简历详情
export function getResume(id) {
  return request({
    url: '/personnel/resume/' + id,
    method: 'get'
  })
}

// 上传文件
export function handleUpload(file) {
  return request({
    url: '/common/upload',
    method: 'post',
    params: file,
  })
}
// 上传多个文件
export function uploads(data) {
  return request({
    url: '/common/uploads',
    method: 'post',
    data: data
  })
}
// 简历推送
export function resumePush(data) {
  return request({
    url: '/personnel/resume/push',
    method: 'post',
    data: data
  })
}