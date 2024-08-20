<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-05-27 17:01:01
-->
<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门" prop="deptId">
          <el-select
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
          </el-select>
      </el-form-item>
      <el-form-item label="制作人" prop="producerId">
          <el-select
            v-model="queryParams.producerId"
            placeholder="制作人"
            filterable
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in listTypeInfo.userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
          </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
          >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="tableData">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="50" align="center" type="index" fixed="left" />
      <el-table-column label="姓名" align="center" prop="projectEnterpriseName">
        <!-- <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="考勤组" align="center" prop="projectName" />
      <el-table-column label="部门" align="center" prop="responsibleDepartmentName" />
      <el-table-column label="工号" align="center" prop="responsibleUserName" />
      <el-table-column label="职位" align="center" prop="responsibleUserName" />
      <el-table-column label="出勤天数" align="center" prop="responsibleUserName" />
      <el-table-column label="休息天数" align="center" prop="responsibleUserName" />
      <el-table-column label="工作时长（分钟）" align="center" prop="responsibleUserName" />
      <el-table-column label="迟到次数" align="center" prop="responsibleUserName" />
      <el-table-column label="迟到时长（分钟）" align="center" prop="responsibleUserName" />
      <!-- <el-table-column label="迟到次数" align="center" prop="responsibleUserName" /> -->
      <el-table-column label="备注" align="center" prop="projectRemarks" />
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

</style>

