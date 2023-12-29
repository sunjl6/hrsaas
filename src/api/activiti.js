import request from '@/utils/request'

// 通过xml字符串上传bpmn
export function uploadBpmnByStr(data) {
  return request({
    url: '/activiti/definition/uploadBpmnByStr', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}

// 分页查询流程定义
export function pageListProcessDefinition(params) {
  return request({
    url: '/activiti/definition/pageListProcessDefinition', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 删除流程定义 definition/del/{id}
export function delDeployedById(id) {
  return request({
    url: '/activiti/definition/del/' + id, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE'
  })
}
// 上传bpmn文件 /definition/uploadBpmnByStream
export function uploadBpmnByStream(data) {
  return request({
    url: '/activiti/definition/uploadBpmnByStream', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 下载bpmn文件
export function downloadBpmn(params) {
  return request({
    url: '/activiti/definition/downloadBpmn', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    params
  })
}
// 流程实例里面不带参数启动流程实例 /instance/startInstanceById
export function startInstanceById(params) {
  return request({
    url: '/activiti/instance/startInstanceById', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 分页获取所有实例 GET/instance/pageList
export function getAllProcessInstanceByPage(params) {
  return request({
    url: '/activiti/instance/pageList', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 激活实例
export function actInstance(params) {
  return request({
    url: '/activiti/instance/actInstance', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}

// 挂起实例
export function suspendInstance(params) {
  return request({
    url: '/activiti/instance/suspendInstance', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}
// 删除实例
export function delInstatnce(params) {
  return request({
    url: '/activiti/instance/delInstatnce', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'DELETE',
    params
  })
}
