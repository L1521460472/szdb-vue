<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-13 10:12:27
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="standardName">
        <!-- <el-select
          v-model="queryParams.projectId"
          placeholder="文件名称"
          clearable
          style="width: 240px"
        >
        <el-option
          v-for="item in listTypeInfo.projectList"
          :key="item.projectId"
          :label="item.projectName"
          :value="item.projectId"
        />
        </el-select> -->
        <el-input
               v-model="queryParams.standardName"
               placeholder="请输入文件名称"
               clearable
               style="width: 240px"
            />
      </el-form-item>
      <!-- <el-form-item label="制作人" prop="producerId">
        <el-select v-model="queryParams.producerId" placeholder="制作人" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态" prop="approveStatus">
        <el-select v-model="queryParams.approveStatus" placeholder="请选择审批状态" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.approveStatusList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAddOpen"
          >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="制作规范文件名称" align="center" prop="standardName">
      </el-table-column>
      <el-table-column label="文件适用部门" align="center" prop="deptName" />
      <el-table-column label="发布时间" align="center" prop="createTime" />
      <el-table-column label="发布人员" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <Dialog
      :visible="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :width="'40%'"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="rateRef" :model="formInfo.data" :rules="formInfo.data.rules" label-width="120px">
            <el-form-item label="制作规范名称" prop="standardName" :rules="
              {
                required: true,
                message: '请输入制作规范名称',
                trigger: 'blur',
              }">
                <div class="tabs-text">
                  <el-input
                    v-model="formInfo.data.standardName"
                  />
                </div>
            </el-form-item>
            <el-form-item label="文件适用部门" prop="deptId" :rules="
              {
                required: true,
                message: '请输入文件适用部门',
                trigger: 'blur',
              }">
                <div class="tabs-text">
                  <el-cascader ref="refDep" v-model="formInfo.data.deptId" :options="departmentOptions" :props="props" filterable :show-all-levels="false" @change="handleChangeDept" clearable />
                </div>
            </el-form-item>
            <el-form-item label="内容规范" prop="fileName" class="fileUpload">
              <div style="border: 1px solid #ccc">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
                />
                <Editor
                  style="height: 500px; overflow-y: hidden;"
                  v-model="valueHtml"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="handleCreated"
                />
              </div>
            </el-form-item>
          <div class="dialog-box-banner">
            
          </div>
          <div class="dialog-box-title" v-if="type == 'view'">
            <div>审批备注 </div>
          </div>
          <div class="dialog-record" v-if="type == 'view'">
            <div class="dialog-record-top">
              <div class="dialog-record-box">{{ formInfo.data.approveRecordVo?.approveName? getTwo(formInfo.data.approveRecordVo.approveName) : '' }}</div> 
              <div class="dialog-record-name">{{ formInfo.data.approveRecordVo?.approveName }}</div>
              <div class="dialog-record-time">{{ formInfo.data.approveRecordVo?.time }}</div>
            </div>
            <div class="dialog-record-conter"><el-icon style="margin-right: 5px;"><Edit /></el-icon><span>编辑属性</span></div>
            <div class="dialog-record-bottom" v-for="(item,index) in formInfo.data.approveRecordVo?.attributeVoList" :key="index">
              <div style="margin-right: 40px;">{{ item.attributeName }}</div>
              <div style="margin-right: 10px;text-decoration: line-through;">{{ item.beforeEditing }}</div>
              <el-icon><Right /></el-icon>
              <div style="margin: 0 10px 0 10px;">{{ item.afterEditing }}</div>
              <div>{{ item.editingTime }}</div>
            </div>
          </div>
        </el-form>
    </Dialog>
  </div>
</template>

<script>
// import {Grid,Expand,Plus,UserFilled,Setting,MoreFilled,Picture,WarnTriangleFilled} from '@element-plus/icons-vue'
// import {QuillEditor, Quill } from '@vueup/vue-quill'
// import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
// import quillTool from '@/utils/quillTool.js'
// Quill.register(quillTool, true)
// Quill.register('modules/ImageExtend', ImageExtend)
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { ref, getCurrentInstance, defineComponent,onBeforeUnmount, shallowRef, onMounted} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getToken } from "@/utils/auth";

export default defineComponent({
  components: { Editor, Toolbar },
  setup() {
    const instance = getCurrentInstance()?.proxy;

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };
    // 内容 HTML
    const valueHtml = ref('')
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    

    editorConfig.MENU_CONF['uploadImage'] = {
      headers: { Authorization: "Bearer " + getToken() },
      fieldName: 'file',
      server: import.meta.env.VITE_APP_BASE_API + "/common/upload",
      // 自定义插入图片
      customInsert(res, insertFn) {
          insertFn(res.url, res.originalFilename, res.url)
      },
    }

    // 模拟 ajax 异步获取内容
    onMounted(() => {
        setTimeout(() => {
            valueHtml.value = ''
        }, 1500)
    })

    const toolbarConfig = {}

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    function customCheckImageFn(src, alt, url) {                                                    // JS 语法
      if (!src) {
        return
      }
      if (src.indexOf('http') !== 0) {
          return import.meta.env.VITE_APP_BASE_API + "/common/upload"
      }
      return true

      // 返回值有三种选择：
      // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
      // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
    } 

    // 转换图片链接
    function customParseImageSrc(src) {               // JS 语法
        if (src.indexOf('http') !== 0) {
            return `http://${src}`
        }
        return src
    }

    // 插入图片
    editorConfig.MENU_CONF['insertImage'] = {
        onInsertedImage(imageNode) {                    // JS 语法
            if (imageNode == null) return

            const { src, alt, url, href } = imageNode
            console.log('inserted image', src, alt, url, href)
        },
        checkImage: customCheckImageFn, // 也支持 async 函数
        parseImageSrc: customParseImageSrc, // 也支持 async 函数
    }
    // 编辑图片
    editorConfig.MENU_CONF['editImage'] = {
        onUpdatedImage(imageNode) {                    // JS 语法
            if (imageNode == null) return

            const { src, alt, url } = imageNode
            console.log('updated image', src, alt, url)
        },
        checkImage: customCheckImageFn, // 也支持 async 函数
        parseImageSrc: customParseImageSrc, // 也支持 async 函数
    }

    /* 事件回调统一处理 */
    const handleClick = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };
    const handleEvent = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };

    return {
      props,
      valueHtml,
      // project_stage,
      handleClick,
      handleEvent,
      ...mainForm(instance),
      ...mainTable(instance),
      ...baseDialog(instance),
      editorRef,
      valueHtml,
      mode: 'simple', // 或 'simple'  'default'
      toolbarConfig,
      editorConfig,
      handleCreated,
    }
  }
})

</script>

<style scoped lang="scss">
/* 富文本框汉化 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
:deep(.ql-editor){
  width: 100%;
  max-height: 300px;
}
.dialog-box-title{
  width: 100%;
  height: 40px;
  display: flex;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}
.dialog-box-banner{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.box-card{
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
.el-form :deep(.el-form-item__label) {
  font-weight: 400 !important;
}
.dialog-record{
  padding: 0 20px;
  .dialog-record-top{
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    .dialog-record-box{
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      background-color: plum;
      margin-right: 16px;
    }
    .dialog-record-name{
      margin-right: 30px;
    }
  }
  .dialog-record-conter{
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 12px 0;
    padding-left: 56px;
    box-sizing: border-box;
    color: #999;
  }
  .dialog-record-bottom{
    display: flex;
    align-items: center;
    border-left: 3px solid plum;
    margin: 12px 0 12px 56px;
    padding-left: 5px;
  }
}
</style>

