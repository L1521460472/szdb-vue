<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-15 16:03:38
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目企业" prop="id">
        <el-select v-model="queryParams.id" placeholder="项目企业" filterable style="width: 200px">
            <el-option
                v-for="item in listTypeInfo.categoryList"
                :key="item.id"
                :label="item.categoryName"
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="50" align="center" type="index" />
      <!-- <el-table-column label="合同编号" align="center" prop="contractNumber" /> -->
      <el-table-column label="项目名称" align="center" prop="itemName">
        <!-- <template #default="scope">
          <span v-for="item in listTypeInfo.projectList" :key="item.id">
            <span v-if="item.id == scope.row.projectId"> {{ item.projectName }}</span>
          </span>
        </template> -->
      </el-table-column>
      <el-table-column label="项目类型" align="center" prop="type">
        <template #default="scope">
          <span v-if="scope.row.type == 1">美术</span>
          <span v-else-if="scope.row.type == 2">开发</span>
        </template>
      </el-table-column>
      <el-table-column label="合同日期" align="center" prop="contractTime" />
      <el-table-column label="创建日期" align="center" prop="createTime" />
      <el-table-column label="附件" align="center" prop="fileUrl">
        <template #default="scope">
          <span v-if="scope.row.fileUrl" style="cursor: pointer;color: #409eff;">附件.{{ scope.row.fileUrl.slice(scope.row.fileUrl.lastIndexOf('.') + 1) }}</span>
          <el-image style="width: 100%; height: 23px;position: absolute;top: 12px;left: 0;z-index: 1;opacity: 0;" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" preview-teleported/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
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
      :close-on-click-modal="dialogInfo.closeOnClickModal"
      width="500px"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="contractRef" :model="formInfo.data" :rules="formInfo.rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目名称" prop="itemId">
              <el-select v-model="formInfo.data.itemId" placeholder="项目名称" @change="handleChange" filterable clearable>
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
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="合同日期" prop="contractTime">
              <el-date-picker
                v-model="formInfo.data.contractTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择合同日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件" class="fileUpload" prop="fileUrl">
              <el-upload
                ref="uploadRef"
                accept=".jpg,.png,.svg,.gif,.webp,.pdf"
                :headers="upload.headers"
                :action="upload.url"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :auto-upload="true"
                drag
                >
                  <el-icon class="el-icon--upload"><Plus /></el-icon>
                  <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
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
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
    <!-- 预览 -->
    <Dialog
      :visible="dialogInfo1.visible"
      :title="dialogInfo1.title"
      :btnList="dialogInfo1.btnList"
      :width="'50%'"
      @close="dialogInfo1.visible = false"
      @handleClick="handleClick"
    > 
    {{ formInfo.data.type.substring(0,5) }}
    <iframe
      v-if="formInfo.data.type == 'application/pdf' || formInfo.data.type == 'text/plain'"
      :src="formInfo.data.url + '#toolbar=0'"
      type="application/x-google-chrome-pdf"
      width="100%"
      frameborder="0"
      scrolling="auto"
      height="550px" />
      <el-image
        v-if="formInfo.data.type.substring(0,5) == 'image'"
        :src="formInfo.data.url"
        :zoom-rate="1.2"
        :initial-index="4"
        fit="cover"
      />
    </Dialog>
  </div>
</template>

<script name="Contract">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
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
.app-container{
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}

.fileUpload :deep(.el-upload .el-upload-dragger){
  padding: 0 !important;
}
.fileUpload :deep(.el-form-item__content){
  line-height: 0 !important;
  .el-upload-list{
    .el-upload-list__item-file-name {
      height: 14px;
      line-height: 14px;
    }
  } 
}
.fileUpload :deep(.el-upload .el-upload-dragger .el-icon--upload){
  margin-bottom: 0 !important;
}
</style>

