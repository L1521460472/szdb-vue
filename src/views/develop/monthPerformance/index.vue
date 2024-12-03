<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-08-06 10:52:05
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="month">
        <!-- <el-select v-model="queryParams.month" placeholder="月份" clearable style="width: 200px">
            <el-option
                v-for="item in listTypeInfo.dateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select> -->
          <el-date-picker
              v-model="queryParams.month"
              type="monthrange"
              range-separator="~"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleChangeTime"
            />
      </el-form-item>
      <el-form-item label="制作人" prop="userId">
        <el-select v-model="queryParams.userId" placeholder="制作人" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectId">
            <el-select v-model="queryParams.projectId" placeholder="项目名称" filterable clearable style="width: 200px">
                <el-option
                   v-for="item in listTypeInfo.projectList"
                   :key="item.projectId"
                   :label="item.projectName"
                   :value="item.projectId"
                />
             </el-select>
          </el-form-item>
          <el-form-item label="制作部门" prop="deptId">
            <el-cascader
                v-model="queryParams.deptId"
                :options="listTypeInfo.deptList"
                :props="queryProps"
                :show-all-levels="false"
                @change="handleChangeDept"
                />
          </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData" row-key="id" :expand-row-keys="expands" @expand-change="expandChange" border>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin-left: 128px;">
            <el-table :data="props.row.list" :show-header="false" border>
              <el-table-column label="名称" align="center" prop="assignmentName" />
              <el-table-column label="状态" align="center" prop="status">
                <template #default="scope">
                    <span v-if="scope.row.status == 1">正常</span>
                    <span v-if="scope.row.status == 2">异常</span>
                </template>
              </el-table-column>
              <el-table-column label="流程" align="center" prop="flowPathName" />
              <el-table-column label="进度" align="center" prop="schedule" />
              <el-table-column label="项目组" align="center" prop="productionDepartment" />
              <el-table-column label="工作人天" align="center" prop="workDay" />
              <el-table-column label="绩效人天" align="center" prop="estimateDay" />
              <el-table-column label="计划开始日期" align="center" prop="plannedStartTime" />
              <el-table-column label="计划结束日期" align="center" prop="plannedEndTime" />
            </el-table>
            <!-- <div class="totle">
              <div style="margin-right: 20px;color: #606266;word-break: break-word;font-weight: 600;">总实际人天：{{ props.row.workDay }}</div>
              <div style="margin-right: 20px;color: #606266;word-break: break-word;font-weight: 600;">总制作人天：{{ props.row.estimateDay }}</div>
            </div> -->
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="序号" width="55" align="center" type="index" /> -->
      <el-table-column label="制作人" align="center" width="80" prop="userName" />
      <el-table-column label="名称" align="center" prop="assignmentName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <!-- <span v-for="item in listTypeInfo.projectList" :key="item.id">
            <span v-if="item.id == scope.row.projectId"> {{ item.projectName }}</span>
          </span> -->
        </template>
      </el-table-column>
      <el-table-column label="流程" align="center" prop="invoiceTime" />
      <el-table-column label="进度" align="center" prop="name" />
      <el-table-column label="项目组" align="center" prop="name" />
      <el-table-column label="工作人天" align="center" prop="workDay">
        <template #default="scope">
          <span v-if="scope.row.isExpandeds">{{ scope.row.workDay }} (合计)</span>
          <span v-else>{{ scope.row.workDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绩效人天" align="center" prop="estimateDay">
        <template #default="scope">
          <span v-if="scope.row.isExpandeds">{{ scope.row.estimateDay }} (合计)</span>
          <span v-else>{{ scope.row.estimateDay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始日期" align="center" prop="name" />
      <el-table-column label="计划结束日期" align="center" prop="name" />
      <!-- <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
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
.totle{
  padding: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
</style>

