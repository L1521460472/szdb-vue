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
      <el-form-item label="姓名" prop="name">
        <el-input
               v-model="queryParams.name"
               placeholder="请输入姓名"
               clearable
               style="width: 240px"
            />
      </el-form-item>
      <el-form-item label="岗位" prop="post">
        <!-- <el-select
          v-model="queryParams.projectId"
          placeholder="岗位"
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
               v-model="queryParams.post"
               placeholder="请输入岗位"
               clearable
               style="width: 240px"
            />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.statusList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="离职时间" prop="time">
        <el-date-picker
          v-model="queryParams.time"
          type="date"
          placeholder="离职时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
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
            @click="handleAddOpen"
          >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="供应商名称" align="center" prop="supplierName">
      </el-table-column>
      <el-table-column label="归属城市" align="center" prop="locationCity" />
      <el-table-column label="供应商等级" align="center" prop="supplierLevel" />
      <el-table-column label="供应商规模" align="center" prop="supplierScale" />
      <el-table-column label="联系人" align="center" prop="supplierScale" />
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="职务" align="center" prop="positionLiaisonPerson" />
      <el-table-column label="入库时间" align="center" prop="storageTime" />
      <el-table-column label="备注" align="center" prop="remark" />
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
      :width="'80%'"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="rateRef" :model="formInfo.data" :rules="formInfo.data.rules" label-width="110px">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="供应商基础信息" name="1">
              <el-row>
                <el-col :span="8">
                    <el-form-item label="公司名称" prop="name">
                      <el-input v-model="formInfo.data.name" placeholder="请输入公司名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所在城市">
                      <el-select v-model="formInfo.data.post" multiple placeholder="请选择所在城市">
                          <el-option
                            v-for="item in postOptions"
                            :key="item.postId"
                            :label="item.postName"
                            :value="item.postId"
                            :disabled="item.status == 1"
                          ></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商规模">
                      <el-select v-model="formInfo.data.post" multiple placeholder="请选择供应商规模">
                          <el-option
                            v-for="item in postOptions"
                            :key="item.postId"
                            :label="item.postName"
                            :value="item.postId"
                            :disabled="item.status == 1"
                          ></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="对接人" prop="mobile">
                      <el-input v-model="formInfo.data.mobile" placeholder="请输入对接人" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="对接人职位:" prop="rank">
                      <el-input v-model="formInfo.data.rank" placeholder="请输入供应商规模:" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码" prop="mobile">
                      <el-input v-model="formInfo.data.mobile" placeholder="请输入手机号码" maxlength="30" />
                    </el-form-item>
                </el-col>
              </el-row>
       
              <el-row>
                <el-col :span="8">
                    <el-form-item label="供应商等级:" prop="rank">
                      <el-input v-model="formInfo.data.rank" placeholder="请输入供应商等级:" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务范围" prop="mobile">
                      <el-input v-model="formInfo.data.mobile" placeholder="请输入业务范围" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入库时间" prop="time1">
                      <el-date-picker
                        v-model="queryParams.time1"
                        type="date"
                        placeholder="入库时间"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="公司经营地址" prop="salary">
                      <el-input v-model="formInfo.data.salary" placeholder="请输入公司经营地址" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="公司介绍" prop="time2">
                    <el-input v-model="formInfo.data.resignationReason" placeholder="请输入公司介绍" maxlength="30" />
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="供应商LOGO" prop="status">
                    <el-upload
                      ref="uploadRef1"
                      class="avatar-uploader"
                      :show-file-list="false"
                      :headers="upload1.headers"
                      :action="upload1.url"
                      :disabled="upload1.isUploading"
                      :auto-upload="true"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                    >
                      <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商营业执照" prop="remarks">
                    <el-upload
                      ref="uploadRef2"
                      class="avatar-uploader"
                      :show-file-list="false"
                      :headers="upload2.headers"
                      :action="upload2.url"
                      :disabled="upload2.isUploading"
                      :auto-upload="true"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                    >
                      <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商资质证书" prop="remarks">
                    <el-upload
                      ref="uploadRef3"
                      class="avatar-uploader"
                      :show-file-list="false"
                      :headers="upload3.headers"
                      :action="upload3.url"
                      :disabled="upload3.isUploading"
                      :auto-upload="true"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                    >
                      <img v-if="imageUrl3" :src="imageUrl3" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="供应商财务信息" name="2">
            <el-row>
              <el-col :span="12">
                <el-form-item label="发票抬头" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入发票抬头" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发票抬头" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入发票抬头" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开户银行" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入开户银行" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行账号" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入银行账号" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位地址" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入单位地址" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话号码" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入电话号码" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>  
      </el-form>
    </Dialog>
  </div>
</template>

<script>

import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { ref, getCurrentInstance, defineComponent,onBeforeUnmount, shallowRef, onMounted} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";
import { getToken } from "@/utils/auth";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    const activeNames = ref(['1'])
    const handleChange = (val) => {
      console.log(val)
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
      activeNames,
      handleChange,
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
.app-container{
  height: calc(100vh - 84px) !important;
  min-height: calc(100vh - 84px) !important;
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

