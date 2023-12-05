import request from '@/utils/request'

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/authority/product/file/upload', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data,
    type: 'change'
  })
}

// 删除文件
export function deleteFile(data) {
  return request({
    url: '/authority/product/file/delete', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data // 需要传入{url:httpxxxx}
  })
}
