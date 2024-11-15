<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-15 18:22:35
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" fixed="left" />
      <el-table-column label="姓名" align="center" prop="projectEnterpriseName" fixed="left">
        <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="responsibleDepartmentName" />
      <el-table-column label="职位" align="center" prop="responsibleUserName" />
      <el-table-column label="考勤状态" align="center" prop="projectName" />
      <el-table-column label="入职时间" align="center" prop="responsibleUserName" />
      <el-table-column label="应出勤天数" align="center" prop="responsibleUserName" />
      <el-table-column label="核算工资出勤天数" align="center" prop="responsibleUserName" />
      <el-table-column label="加班（小时）" align="center" prop="responsibleUserName" />
      <el-table-column label="事假" align="center" prop="responsibleUserName" />
      <el-table-column label="病假" align="center" prop="responsibleUserName" />
      <el-table-column label="年假" align="center" prop="responsibleUserName" />
      <el-table-column label="婚/丧/陪产假" align="center" prop="responsibleUserName" />
      <el-table-column label="全勤奖" align="center" prop="responsibleUserName" />
      <el-table-column label="迟到次数" align="center" prop="responsibleUserName" />
      <el-table-column label="缺卡次数" align="center" prop="responsibleUserName" />
      <el-table-column label="考勤扣款" align="center" prop="responsibleUserName" />
      <el-table-column label="年假剩余（小时）" align="center" prop="responsibleUserName" />
      <el-table-column label="调休剩余（小时）" align="center" prop="responsibleUserName" />
      <el-table-column label="备注" align="center" prop="projectRemarks" />
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="详情" placement="top">
                <el-button link type="primary" icon="view" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="发送确认" placement="top">
                <el-button link type="primary" icon="Promotion" @click="handlePromotion(scope.row)"></el-button>
            </el-tooltip> -->
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

    <!-- 考勤明细对话框 -->
    <el-dialog title="考勤明细" v-model="visible" :close-on-click-modal="false" width="80%" append-to-body>
      <!-- <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="Search"
            style="margin-bottom: 20px"
          />
      </div> -->
      <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="日期" prop="workDate">
        <el-date-picker
          v-model="queryParams.workDate"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button icon="Refresh" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>
      <el-table v-loading="loading" :data="detailTableData" v-if="!loading">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="55" align="center" type="index" fixed="left" />
      <el-table-column label="姓名" align="center" prop="name">
        <!-- <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="上班打卡时间" align="center" prop="startDate" />
      <el-table-column label="下班打卡时间" align="center" prop="endDate" />
      <el-table-column label="日期" align="center" prop="date" />
      <!-- <el-table-column label="请假" align="center" prop="responsibleUserName" />
      <el-table-column label="职位" align="center" prop="responsibleUserName" />
      <el-table-column label="出勤天数" align="center" prop="responsibleUserName" />
      <el-table-column label="休息天数" align="center" prop="responsibleUserName" />
      <el-table-column label="工作时长（分钟）" align="center" prop="responsibleUserName" />
      <el-table-column label="迟到次数" align="center" prop="responsibleUserName" />
      <el-table-column label="迟到时长（分钟）" align="center" prop="responsibleUserName" />
      <el-table-column label="备注" align="center" prop="projectRemarks" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="发送确认" placement="top">
                <el-button link type="primary" icon="Promotion" @click="handlePromotion(scope.row)"></el-button>
            </el-tooltip>
          </template>
      </el-table-column> -->
    </el-table>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="visible = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>
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
.app-container{
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
.boxBj{
  width: 100%;
  height: 100%;
  background-color: red;
  color: yellow;
  display: inline-block;
}
</style>

