/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 09:26:22
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-23 11:18:44
 */
import request from '@/utils/request'

// 查询项目树
export function listCategory(query) {
  return request({
    url: '/arts/category/list',
    method: 'get',
    params: query
  })
}
// 查询企业列表
export function listCategoryDetail(id) {
  return request({
    url: '/arts/category/' + id,
    method: 'get',
  })
}
// 查询企业列表
export function listCategoryByType(id) {
  return request({
    url: '/arts/category/byType/' + id,
    method: 'post',
  })
}
// 查询项目列表
export function listProject(query) {
  return request({
    url: '/arts/project/list',
    method: 'get',
    params: query
  })
}

// 新增项目
export function addProject(data) {
  return request({
    url: '/arts/project',
    method: 'post',
    data: data
  })
}

// 修改项目
export function editProject(data) {
  return request({
    url: '/arts/project',
    method: 'put',
    data: data
  })
}

// 删除项目
export function delProject(id) {
  return request({
    url: '/arts/project/' + id,
    method: 'delete'
  })
}

// 删除项目层级
export function delProjectCategory(id) {
  return request({
    url: '/arts/category/' + id,
    method: 'delete'
  })
}
// 修改项目层级
export function editProjectCategory(data) {
  return request({
    url: '/arts/category',
    method: 'put',
    data: data
  })
}

// 项目详情
export function getProject(id) {
  return request({
    url: '/arts/project/' + id,
    method: 'get'
  })
}

// 项目详情保存
export function getDetailsAdd(data) {
  return request({
    url: '/arts/project/detailsAdd',
    method: 'post',
    data: data
  })
}

// 设置封面
export function upProjectThumbnail(data) {
  return request({
    url: '/arts/project/upProjectThumbnail',
    method: 'post',
    data: data
  })
}

// 项目状态
export function upState(data) {
  return request({
    url: '/arts/project/upState',
    method: 'post',
    data: data
  })
}

// 设为模板
export function setTemplate(id) {
  return request({
    url: `/arts/project/${id}`,
    method: 'post',
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
// 部门树
export function deptList(query) {
  return request({
    url: 'system/user/deptTree',
    method: 'GET',
    params: query
  })
}
// 部门列表
export function departmentList(query) {
  return request({
    url: '/arts/project/fabricationDepartment',
    method: 'GET',
    params: query
  })
}
// 成员列表
export function userList(query) {
  return request({
    // url: '/system/user/all',
    url: '/system/user/list',
    method: 'GET',
    params: query
  })
}
// 项目所有流程
export function flowPathList(query) {
  return request({
    url: '/arts/project/flowPathList',
    method: 'GET',
    params: query
  })
}
// 数据字典
export function dictData(query) {
  return request({
    url: 'system/dict/data/list',//?pageNum=1&pageSize=10&dictType=project_stage
    method: 'GET',
    params: query
  })
}

// 批次
export function projectBatch() {
  return request({
    url: `/arts/project/projectBatch`,
    method: 'post',
  })
}

// 下载
export function download(query) {
  return request({
    url: 'common/download',//?pageNum=1&pageSize=10&dictType=project_stage
    method: 'GET',
    params: query
  })
}
// 查询财务-回款明细项目
export function artsList(query) {
  return request({
    url: '/finance/collection/artsList',
    method: 'GET',
    params: query
  })
}
