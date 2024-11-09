<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-09 18:20:35
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="projectName">
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
               v-model="queryParams.projectName"
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
      <el-table-column label="项目名称" align="center" prop="projectName">
      <!-- <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="制作人" align="center" prop="producerName" />
      <el-table-column label="当前阶段" align="center" prop="projectStage" />
      <el-table-column label="当前进度" align="center" prop="projectRate" >
        <template #default="scope">
          <span>{{ scope.row.projectRate }} <span v-if="scope.row.projectRate">%</span></span>
          </template>
      </el-table-column>
      <el-table-column label="所用工时(天)" align="center" width="100" prop="timeConsuming" />
      <el-table-column label="工作截图" align="center" width="130" prop="producerTime">
        <template #default="scope">
          <el-image style="width: 100px; height: 50px" :src="scope.row.rateFile" :preview-src-list="[scope.row.rateFile]" preview-teleported/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" prop="createTime" />
      <el-table-column label="审批状态" align="center" prop="approveStatus">
        <template #default="scope">
          <span v-if="scope.row.approveStatus == 1">待提交</span>
          <span v-if="scope.row.approveStatus == 2">待审核</span>
          <span v-if="scope.row.approveStatus == 3">审核通过</span>
          <span v-if="scope.row.approveStatus == 4">已撤回</span>
        </template>
      </el-table-column>
      <el-table-column label="审批备注" align="center" prop="approveRemarks" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="审核" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleApproval(scope.row)"></el-button>
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
    <el-form ref="rateRef" :model="formInfo.data" :rules="formInfo.data.rules" label-width="80px">
          <div style="margin: 10px 0;"><span style="margin-right: 20px;">制作人</span>   {{ formInfo.data.producerName }}</div>
          <div class="dialog-box-title">
            <div>任务事项 </div>
            <div style="display: flex;">
              <div style="width: 120px;display: flex;align-items: center; justify-content: center;background-color: #0da9f7;font-weight: 400;color: #000;"><span style="margin-right: 10px;color: #333;">商务天</span> {{ num1 }}</div>
              <div style="width: 120px;display: flex;align-items: center; justify-content: center;background-color: #ffc000;font-weight: 400;color: #fff;"><span style="margin-right: 10px;color: #fff;">剩余人天</span> {{ num2 }}</div>
            </div>
            <!-- <div><el-button icon="Plus" v-if="type == 'add'" @click="handleAddRate">新增</el-button></div> -->
          </div>
          <div class="dialog-box-banner">
            <quill-editor
                ref="myQuillEditor"
                class="ql-editor"
                v-model:content="content"
                :options="editorOption"
                contentType="html"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)"
              />
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
import {QuillEditor, Quill } from '@vueup/vue-quill'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
// import quillTool from '@/utils/quillTool.js'
// Quill.register(quillTool, true)
Quill.register('modules/ImageExtend', ImageExtend)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";


export default defineComponent({
  components: { QuillEditor },
  setup() {
    const instance = getCurrentInstance()?.proxy;

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
      // project_stage,
      handleClick,
      handleEvent,
      ...mainForm(instance),
      ...mainTable(instance),
      ...baseDialog(instance),
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

