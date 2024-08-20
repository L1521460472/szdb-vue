<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-03 18:11:20
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

    <el-table v-loading="loading" :data="tableData" v-if="!loading">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" width="50" align="center" type="index" fixed="left" />
      <el-table-column :label="item.name" min-width="120" align="center" :fixed="index == 0 ? 'left': null" v-for="(item,index) in columnList" :key="index" >
          <template #default="scope">
            <span v-if="index == 0">{{ scope.row['1001'] }}</span>
            <span v-else-if="index == 1">{{ scope.row['1002'] }}</span>
            <span v-else-if="index == 2">{{ scope.row['1003'] }}</span>
            <span v-else-if="index == 3">{{ scope.row['1004'] }}</span>
            <span v-else-if="index == 4">{{ scope.row['1005'] }}</span>
            <span v-else-if="index == 5">{{ scope.row['177973307'] }}</span>
            <span v-else-if="index == 6">{{ scope.row['177973308'] }}</span>
            <span v-else-if="index == 7">{{ scope.row['177973309'] }}</span>
            <span v-else-if="index == 8">{{ scope.row['177973310'].toFixed(2) }}</span>
            <span v-else-if="index == 9">{{ scope.row['177973311'] }}</span>
            <span v-else-if="index == 10">{{ (scope.row['177973312'] / 60).toFixed(2) }}</span>
            <span v-else-if="index == 11" :class="{boxBj:scope.row['177973313'] > 3}">{{ scope.row['177973313'] }}</span>
            <span v-else-if="index == 12" :class="{boxBj:scope.row['177973314'] > 60}">{{ scope.row['177973314'] }}</span>
            <span v-else-if="index == 13">{{ scope.row['177973315'] }}</span>
            <span v-else-if="index == 14">{{ scope.row['177973316'] }}</span>
            <span v-else-if="index == 15" :class="{boxBj:scope.row['177973317'] > 0}">{{ scope.row['177973317'] }}</span>
            <span v-else-if="index == 16" :class="{boxBj:scope.row['177973318'] > 0}">{{ scope.row['177973318'] }}</span>
            <span v-else-if="index == 17" :class="{boxBj:scope.row['177973319'] > 0}">{{ scope.row['177973319'] }}</span>
            <span v-else-if="index == 18" :class="{boxBj:scope.row['177973320'] > 0}">{{ scope.row['177973320'] }}</span>
            <span v-else-if="index == 19" :class="{boxBj:scope.row['177973321'] > 0}">{{ scope.row['177973321'] }}</span>
            <span v-else-if="index == 20" :class="{boxBj:scope.row['177973322'] > 0}">{{ scope.row['177973322'] }}</span>
            <span v-else-if="index == 21">{{ scope.row['177973323'] }}</span>
            <span v-else-if="index == 22">{{ scope.row['177973324'] }}</span>
            <span v-else-if="index == 23"></span>
            <span v-else-if="index == 24"></span>
            <span v-else-if="index == 25"></span>
            <span v-else-if="index == 26"></span>
            <span v-else-if="index == 27"></span>
            <span v-else-if="index == 28"></span>
            <span v-else-if="index == 29"></span>
            <span v-else-if="index == 30"></span>
            <span v-else-if="index == 31"></span>
            <span v-else-if="index == 32">{{ scope.row['177973326'] }}</span>
            <span v-else-if="index == 33">{{ scope.row['177973327'] }}</span>
            <span v-else-if="index == 34">{{ scope.row['177973328'] }}</span>
            <span v-else-if="index == 35">{{ scope.row['177973329'] }}</span>
            <span v-else-if="index == 36">{{ scope.row['177973330'] }}</span>
            <span v-else-if="index == 37">{{ scope.row['177973331'] }}</span>
            <span v-else-if="index == 38">{{ scope.row['177973332'] }}</span>
            <span v-else-if="index == 39">{{ scope.row['177973333'] }}</span>
            <span v-else-if="index == 40">{{ scope.row['177973334'] }}</span>
            <span v-else-if="index == 41">{{ scope.row['177973335'] }}</span>
            <span v-else-if="index == 42">{{ scope.row['177973336'] }}</span>
            <span v-else-if="index == 43">{{ scope.row['177973337'] }}</span>
            <span v-else-if="index == 44">{{ scope.row['177973338'] }}</span>
            <span v-else-if="index == 45">{{ scope.row['177973339'] }}</span>
            <span v-else-if="index == 46">{{ scope.row['177973340'] }}</span>
            <span v-else-if="index == 47">{{ scope.row['177973341'] }}</span>
            <span v-else-if="index == 48">{{ scope.row['177973342'] }}</span>
            <span v-else-if="index == 49">{{ scope.row['177973343'] }}</span>
            <span v-else-if="index == 50">{{ scope.row['177973344'] }}</span>
            <span v-else-if="index == 51">{{ scope.row['177973345'] }}</span>
            <span v-else></span>
           </template>
        </el-table-column>
      <!-- <el-table-column label="姓名" align="center" prop="projectEnterpriseName">
        <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template>
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
      <el-table-column label="备注" align="center" prop="projectRemarks" /> -->
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
      <el-table-column label="序号" width="50" align="center" type="index" fixed="left" />
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

