<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-09-27 15:45:35
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectId">
          <el-select
            v-model="queryParams.projectId"
            placeholder="项目名称"
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in listTypeInfo.projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
          </el-select>
        </el-form-item>
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
            @click="handleAdd"
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
            <el-tooltip content="提交" placement="top" v-if="scope.row.approveStatus == 1 || scope.row.approveStatus == 4">
                <el-button link type="primary" icon="Position" @click="handleSubmit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="撤回" placement="top" v-if="scope.row.approveStatus == 2">
                <el-button link type="primary" icon="RefreshLeft" @click="handleRecall(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top" v-if="scope.row.approveStatus == 1 || scope.row.approveStatus == 4">
                <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top" v-if="scope.row.approveStatus == 3">
                <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.approveStatus !== 3">
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
      :width="dialogInfo.width"
      :close-on-click-modal="false"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
    <el-form ref="rateRef" :model="formInfo.data" :disabled="formInfo.disabled" :rules="formInfo.rules" label-width="80px">
          
          <div class="dialog-box-title">
            <div>任务事项 </div>
            <div><el-button icon="Plus" v-if="type == 'add'" @click="handleAddRate">新增</el-button></div>
          </div>
          <div class="dialog-box-banner">
            <el-card :class="{boxCardView:type !='add'}" class="box-card" v-for="(item,index) in formInfo.data.artsProjectRateAddListRequestList" :key="index">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目名称" required>
                    <el-select
                      v-model="item.projectId"
                      placeholder="项目名称"
                      filterable
                      clearable
                      style="width: 240px"
                      @change="handleProjectId(item.projectId,index)"
                    >
                      <el-option
                        v-for="item in listTypeInfo.projectList"
                        :key="item.projectId"
                        :label="item.projectName"
                        :value="item.projectId"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="阶段" required>
                    <el-select v-model="item.projectStage" placeholder="参与阶段" clearable style="width: 200px">
                      <!-- <el-option
                          v-for="dict in project_stage"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                          :disabled="dict.disabled"
                      /> -->
                      <el-option
                          v-for="dict in listTypeInfo.stateList"
                          :key="dict.stageName"
                          :label="dict.stageName"
                          :value="dict.stageName"
                          :disabled="dict.disabled"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="制作工时" required>
                    <el-input v-model="item.time1" type="number" :step="0.1" min="0" placeholder="请输入制作工时" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="绩效人天" required>
                    <el-input v-model="item.time" type="number" :step="0.1" min="0" placeholder="请输入绩效人天" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="进度(%)" required>
                    <el-input v-model="item.projectRate" type="number" min="0" placeholder="请输入进度" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="日报日期">
                    <el-date-picker
                      v-model="item.taskTime"
                      type="date"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择日报日期"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input v-model="item.remarks" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="height: 200px;display: flex;justify-content: center;align-items: center;background-color: #e5e5e5;">
                    <el-image v-if="item.rateFile" style="width: 100%;height: 200px;" :src="item.rateFile" fit="fill" />
                    <div v-else>请上传工作截图</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="display: flex;justify-content: center;align-items: center;height: 40px;margin-top: 10px;">
                    <el-button icon="Plus" @click="openUpload(index)">工作截图</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-card>
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
    <!-- 上传文件对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" :close-on-click-modal="false" width="400px" append-to-body>
        <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <template #tip>
              <div class="el-upload__tip text-center">
                <div class="el-upload__tip">
                    <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                </div>
                <span>仅允许导入xls、xlsx格式文件。</span>
                <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
              </div>
          </template> -->
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>
  </div>
</template>

<script name="Mytask">
// import {Grid,Expand,Plus,UserFilled,Setting,MoreFilled,Picture,WarnTriangleFilled} from '@element-plus/icons-vue'
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const { project_stage } = instance.useDict("project_stage");

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
      project_stage,
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
.app-container {
  padding: 20px;
  height: calc(100vh - 84px);
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
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
  width: 49%;
  height: 430px;
  margin-bottom: 20px;
}
.boxCardView{
  width: 100%;
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

