<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-17 16:31:47
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门" prop="deptId">
          <!-- <el-select
            v-model="queryParams.deptId"
            placeholder="部门"
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in listTypeInfo.depList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
          </el-select> -->
          <el-cascader
            style="width: 220px"
            v-model="queryParams.deptId"
            :options="listTypeInfo.depList"
            :props="props"
            :show-all-levels="false"
            @change="handleChangeDept"
            />
      </el-form-item>
      <el-form-item label="制作人" prop="producerId">
          <el-select
            v-model="queryParams.producerId"
            placeholder="制作人"
            filterable
            clearable
            style="width: 220px"
          >
          <el-option
            v-for="item in listTypeInfo.userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
          </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入名称"
          clearable
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item label="日期" prop="month">
          <el-date-picker
              style="width: 280px"
              v-model="queryParams.month"
              type="monthrange"
              range-separator="~"
              start-placeholder="计划开始日期"
              end-placeholder="计划结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleChangeTime"
            />
      </el-form-item>
      <el-form-item label="项目状态" prop="projectState">
          <el-select
            v-model="queryParams.projectState"
            placeholder="项目状态"
            clearable
            style="width: 220px"
          >
            <el-option
                v-for="dict in listTypeInfo.stateList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
          <!-- <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
          >新增</el-button> -->
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData" row-key="id" :expand-row-keys="expands" @expand-change="expandChange" @sort-change="handleSortChange" border :default-sort="{ prop: 'producerDay', order: 'descending' }">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin-left: 183px;">
            <el-table :data="props.row.achievementList" :show-header="false" border>
              <el-table-column label="名称" align="center" prop="name" />
              <el-table-column label="状态" align="center" prop="projectState">
                <template #default="scope">
                  <span style="color: #42ec18;" v-if="scope.row.projectState == '1'">正常</span>
                  <span style="color: #ff9725;" v-else-if="scope.row.projectState == '2'">紧张</span>
                  <span style="color: #f71702;" v-else-if="scope.row.projectState == '3'">延期</span>
                  <span style="color: #0d06db;" v-else>已完成</span>
                </template>
              </el-table-column>
              <el-table-column label="流程" align="center" prop="flowName" />
              <el-table-column label="进度" align="center" prop="progress">
                <template #default="scope">
                  <span>{{ scope.row.progress + '%' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="项目组" align="center" prop="deptName" />
              <el-table-column label="制作人天" align="center" prop="producerDay" />
              <el-table-column label="绩效人天" align="center" prop="performanceDay" />
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
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="制作人" align="center" width="80" prop="producerName" />
      <el-table-column label="名称" align="center" prop="label" />
      <el-table-column label="订单状态" align="center" prop="label">
        <!-- <template #default="scope">
          <span>{{ scope.row.producerName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="流程" align="center" prop="label" />
      <el-table-column label="进度" align="center" prop="label" />
      <el-table-column label="项目组" align="center" prop="label" />
      <el-table-column label="制作人天" align="center" prop="producerDay" sortable />
      <el-table-column label="绩效人天" align="center" prop="performanceDay" sortable />
      <el-table-column label="计划开始时间" align="center" prop="startTime" sortable />
      <el-table-column label="计划结束时间" align="center" prop="endTime" sortable />
      <!-- <el-table-column :label="item.label" min-width="110" align="center" v-for="(item,index) in columnList" :key="index" >
          <template #default="scope">
            <span>{{ scope.row.achievementList[index].achievement }}</span>
           </template>
        </el-table-column> -->
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

<script name="MonthlyPerformance">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

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
</style>

