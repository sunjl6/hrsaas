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
// 无参启动流程实例 /instance/startInstanceById
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
// 获取当前用户所有task
export function getUserAllTasks() {
  return request({
    url: '/activiti/task/userTask', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 获取当前所有task
export function AllTasks() {
  return request({
    url: '/activiti/task/taskList', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 完成任务 /task/finsihTask  参数taskid
export function finsihTask(params) {
  return request({
    url: '/activiti/task/finsihTask', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET',
    params
  })
}

// 带参数启动实例
export function startInstanceByIdAndVariable(processInstatnceId, data) {
  return request({
    url: '/activiti/instance/startInstanceByIdAndVariable?processInstatnceId=' + processInstatnceId, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}

// 动态渲染表单 /task/formDataRender
export function formDataRender(taskId) {
  return request({
    url: '/activiti/task/formDataRender?taskId=' + taskId, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 保存表单并且完成task  /task/formDataSave
// 参数 String taskid，String formData
export function formDataSave(params) {
  return request({
    url: '/activiti/task/formDataSave', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    params
  })
}
// 查看流程定义的所有节点信息
export function getProcessNodeByDeploymentId(deploymentId) {
  return request({
    url: '/activiti/definition/getProcessNodeByDeploymentId?deploymentId=' + deploymentId, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'GET'
  })
}
// 修改节点信息
export function modifyProcessNodeByDeploymentId(deploymentId, data) {
  return request({
    url: '/activiti/definition/modifyProcessNodeByDeploymentId?deploymentId=' + deploymentId, // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
