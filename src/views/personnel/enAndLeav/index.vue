<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-20 12:01:09
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
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="queryParams.deptId"
          :options="listTypeInfo.depList"
          :props="props"
          filterable
          :show-all-levels="false"
          @change="handleChangeDept1"
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
          type="monthrange"
          placeholder="离职时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleChangeTime"
        />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAddOpen"
          >新增</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="姓名" align="center" prop="name">
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
            <span style="color: #f71702;" v-if="scope.row.status == 1">离职</span>
            <span style="color: #0d06db;" v-else>在职</span>
          </template>
      </el-table-column>
      <el-table-column label="岗位" align="center" prop="post" />
      <!-- <el-table-column label="部门" align="center" prop="deptId">
        <template #default="scope">
            <span>{{ scope.row.deptId == 1 ? '离职' : '在职' }}</span>
          </template>
      </el-table-column> -->
      <el-table-column label="职级" align="center" prop="rank" />
      <el-table-column label="联系电话" align="center" prop="mobile" width="120" />
      <el-table-column label="入职时间" align="center" prop="createTime" width="160" />
      <el-table-column label="入职薪资" align="center" prop="salary" />
      <el-table-column label="离职时间" align="center" prop="resignTime" width="110" />
        <!-- <template #default="scope">
          <span>{{ scope.row.status == 1 ? scope.row.resignTime : '' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="离职原因" align="center" prop="resignationReason" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip> -->
          </template>
      </el-table-column>
    </el-table>

    <div style="display: flex;align-items: center;justify-content: space-between;">
      <div v-show="total > 0">
        <span style="font-weight: 600;margin-right: 20px;"> 数据统计</span>  
        在职：<span style="margin-right: 40px;color: #0d06db;">{{ atWork }}</span>
        离职：<span style="margin-right: 40px;color: #f71702;">{{ resign }}</span>
        离职率：<span style="margin-right: 40px;color: #42ec18;">{{ resignationRate }}</span>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    

    <Dialog
      :visible="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :width="'40%'"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="rateRef" :model="formInfo.data" :rules="formInfo.data.rules" label-width="80px">
          <el-row>
               <el-col :span="12">
                  <el-form-item label="姓名" prop="name">
                     <el-input v-model="formInfo.data.name" placeholder="请输入姓名" maxlength="30" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                <el-form-item label="岗位">
                     <el-select v-model="formInfo.data.post" placeholder="请选择">
                        <el-option
                           v-for="item in postOptions"
                           :key="item.postId"
                           :label="item.postName"
                           :value="item.postName"
                           :disabled="item.status == 1"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="职级" prop="rank">
                     <el-input v-model="formInfo.data.rank" placeholder="请输入职级" maxlength="30" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="formInfo.data.mobile" placeholder="请输入联系电话" maxlength="30" />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <!-- <el-col :span="12">
                  <el-form-item label="入职时间" prop="time1">
                    <el-date-picker
                      v-model="queryParams.time1"
                      type="date"
                      placeholder="入职时间"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
               </el-col> -->
               <el-col :span="12">
                  <el-form-item label="入职薪资" prop="salary">
                    <el-input v-model="formInfo.data.salary" placeholder="请输入入职薪资" maxlength="30" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="formInfo.data.status" placeholder="请选择状态" clearable filterable disabled>
                    <el-option
                        v-for="item in listTypeInfo.statusList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
                <el-form-item label="离职时间" prop="time2">
                  <el-date-picker
                    v-model="queryParams.time2"
                    type="date"
                    placeholder="离职时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="离职原因" prop="resignationReason">
                  <el-input v-model="formInfo.data.resignationReason" placeholder="请输入离职原因" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="formInfo.data.remarks" placeholder="请输入备注" maxlength="30" />
                </el-form-item>
              </el-col>
          </el-row>
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
  height: calc(100vh - 136px) !important;
  min-height: calc(100vh - 136px) !important;
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
</style>

