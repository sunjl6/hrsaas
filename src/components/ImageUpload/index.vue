<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :http-request="upload"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div></template>

<script>
import { deleteFile } from '@/api/uploadFile'
import { uploadAvatar, getUserById } from '@/api/employees'
export default {
  data() {
    return {
      id: this.$route.params.id,
      fileList: [], // 图片地址设置为数组
      dialogImageUrl: '',
      dialogVisible: false,
      currentFileUid: ''
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  created() {
    this.getdefaultList()
  },
  methods: {
    // 生成一个默认的fileList 从员工的头像获取
    async getdefaultList() {
      const result = await getUserById(this.id)

      this.fileList.push({ url: result.avatar })
    },
    changeFile(file, fileList) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      // 为了避免被重复调用，我们如果上传成功了 那么 最新的列表里面就会有
      // 修改文件时触发
      // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
      // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
      // [] => [...fileList] [] => fileList.map()
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    //   this.fileList = fileList.map(item => item)
    },

    // 调用接口上传图片 绑定标签的:http-request="upload"
    // 这里的params 里面有我们需要的上传的 file 通过 params.file 获得上传的文件
    async upload(params) {
      if (params.file) {
        // 执行上传操作
        var formData = new FormData()
        formData.append('file', params.file)
        const url = await uploadAvatar(this.id, formData)
        this.getdefaultList()
        // 这里 通过上传前的uid 来判断这次上传成功的图片的uid 是否一样 如果一样 就把 返回的地址赋值给 this.fileList
        this.fileList = this.fileList.map((item) => {
          console.log(item.uid)
          console.log(this.currentFileUid)
          if (item.uid === this.currentFileUid) {
            return { url: url, upload: true }
          }
          return item
        })
      }
    },
    // 删除图片
    async handleRemove(file, fileList) {
      // file 是当前删除的文件
      // fileList 是删除的后的fileList
      // this.fileList 是当前filelist
      // 把当前的删除的图片从data 的 fileList 里取出调并且重新赋值
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // 同时把 远端的 bucket 里的文件也删除了
      console.log(file.url)
      var formData = new FormData()
      formData.append('url', file.url)
      await deleteFile(formData)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid // 在上传前把当前上传的图片的uid 参数 拿出来 赋值给 currentFileUid 方便后面检查
      return true
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
