<template>
  <div id="app">
    <div class="container">
      <el-alert
        title="请注意流程的id不要和以前的重复。上传BPMN文件之前请先查询下 流程id是否存在"
        type="warning"
        style="width: 50%;"
        @close="closeWarning"
      />
      <!-- 创建一个canvas画布 npmn-js是通过canvas实现绘图的，并设置ref让vue获取到element -->
      <div ref="canvas" class="bpmn-canvas" />
      <div id="js-properties-panel" class="bpmn-js-properties-panel" />
    </div>
    <!-- 把操作按钮写在这里面 -->
    <div class="action">
      <el-upload action class="upload-demo" :before-upload="openBpmn">
        <el-button icon="el-icon-folder-opened" />
      </el-upload>
      <el-button class="new" icon="el-icon-circle-plus" @click="newDiagram" />
      <el-button icon="el-icon-download" @click="downloadBpmn" />
      <el-button icon="el-icon-picture" @click="downloadSvg" />
      <el-button icon="el-icon-upload" @click="deployBpmnjs" />
      <a ref="downloadLink" hidden />
    </div>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 工具栏相关
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import propertiesPanelModule from 'bpmn-js-properties-panel'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import activitiModdleDescriptor from '@/api/bpmnjs/activiti.json'
// 引入
import propertiesProviderModule from 'houtaroy-bpmn-js-properties-panel-activiti/lib/provider/activiti'

import { uploadBpmnByStr } from '@/api/activiti'
export default {
  data() {
    return {
      bpmnModeler: null,
      canvas: null,
      // 流程图初始模板代码
      bpmnTemplate: `<?xml version="1.0" encoding="UTF-8"?>
<definitions 
  xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
  xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" 
  xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:activiti="http://activiti.org/bpmn" 
  id="m1577635100724" 
  name="" 
  targetNamespace="http://www.activiti.org/testm1577635100724"
>
  <process id="process" processType="None" isClosed="false" isExecutable="true">
    <extensionElements>
      <activiti:properties>
        <activiti:property name="a" value="1" />
      </activiti:properties>
    </extensionElements>
    <startEvent id="_2" name="start" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_leave">
    <bpmndi:BPMNPlane id="BPMNPlane_leave" bpmnElement="leave">
      <bpmndi:BPMNShape id="BPMNShape__2" bpmnElement="_2">
        <omgdc:Bounds x="144" y="368" width="32" height="32" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="149" y="400" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
    }
  },
  // 生命周期钩子，在组件加载完成后调用init函数进行创建初始化Bpmn-js建模器
  mounted() {
    this.bpmninit()
  },
  methods: {
    // 关闭上方提示文字
    closeWarning() {},
    // 直接发送api请求部署现在画的bpmnjs
    deployBpmnjs() {
      this.bpmnModeler.saveXML((err, xml) => {
        if (!err) {
          this.$confirm('确认是否部署这个BPM文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await uploadBpmnByStr({ 'xmlStr': xml })
            this.$message({
              type: 'success',
              message: '部署成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消部署'
            })
          })
        }
      })
    },
    bpmninit() {
      // 获取画布 element
      this.canvas = this.$refs.canvas

      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        // 设置bpmn的绘图容器为上门获取的画布 element
        container: this.canvas,

        // 加入工具栏支持
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [propertiesProviderModule, propertiesPanelModule],
        moddleExtensions: {
          activiti: activitiModdleDescriptor
          // camunda: camundaModdleDescriptor
        }
      })

      this.initDiagram(this.bpmnTemplate)
    },
    initDiagram(bpmn) {
      // 将xml导入Bpmn-js建模器
      this.bpmnModeler.importXML(bpmn, err => {
        if (err) {
          this.$Message.error('打开模型出错,请确认该模型符合Bpmn2.0规范')
        }
      })
    },
    getFilename(xml) {
      const start = xml.indexOf('process')
      let filename = xml.substr(start, xml.indexOf('>'))
      filename = filename.substr(filename.indexOf('id') + 4)
      filename = filename.substr(0, filename.indexOf('"'))
      return filename
    },

    download({ name = 'diagram.bpmn', data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink
      // 把输就转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      console.log(data)
      if (data) {
        // 将数据给到链接
        downloadLink.href =
            'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        // 设置文件名
        downloadLink.download = name
        // 触发点击事件开始下载
        downloadLink.click()
      }
    },
    downloadBpmn() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.bpmn`
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: xml })
        }
      })
    },
    downloadSvg() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.svg`

          // 从建模器画布中提取svg图形标签
          let context = ''
          const djsGroupAll = this.$refs.canvas.querySelectorAll('.djs-group')
          for (const item of djsGroupAll) {
            context += item.innerHTML
          }
          // 获取svg的基本数据，长宽高
          const viewport = this.$refs.canvas
            .querySelector('.viewport')
            .getBBox()

          // 将标签和数据拼接成一个完整正常的svg图形
          const svg = `
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="${viewport.width}"
                height="${viewport.height}"
                viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
                version="1.1"
                >
                ${context}
              </svg>
            `
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: svg })
        }
      })
    },

    openBpmn(file) {
      const reader = new FileReader()
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        // 读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result)
      }
      return false
    },
    async createNewDiagram(bpmn) {
      // 将字符串转换成图显示出来;
      this.bpmnModeler.importXML(bpmn, err => {
        if (err) {
          this.$Message.error('打开模型出错,请确认该模型符合Bpmn2.0规范')
        }
      })
    },
    newDiagram() {
      this.createNewDiagram(this.bpmnTemplate)
    }
  }
}
</script>

<style scoped>
.container {
  /* 使用网格作为背景 */
  background: white;
  overflow: auto;
  background-image: linear-gradient(
      90deg,
      rgba(220, 220, 220, 0.5) 6%,
      transparent 0
    ),
    linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
  width: 100%;
  height: calc(100vh - 50px);
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.bpmn-canvas {
  width: 100%;
  height: 100vh;
}

.action {
  position: fixed;
  bottom: 10px;
  left: 220px;
  display: flex;
}
.upload-demo {
  margin-right: 10px;
}

.bpmn-js-properties-panel {
  position: absolute;
  top: 0;
  right: 0px;
  width: 300px;
  height: 95%;
  overflow-y:auto
}
</style>
