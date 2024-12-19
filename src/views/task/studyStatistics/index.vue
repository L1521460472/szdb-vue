<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-06 20:23:21
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-19 10:23:34
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="入职时间" prop="month">
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
      <el-form-item label="姓名" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
            clearable
            prefix-icon="Search"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in listTypeInfo.enableList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
          </el-select>
        </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button icon="Position" @click="handlePush">一键推送</el-button>
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

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="姓名" align="center" prop="name">
        <!-- <template #default="scope">
          <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="入职时间" align="center" min-width="120" prop="entryTime" />
      <el-table-column label="学习状态" align="center" min-width="150" prop="status">
        <template #default="scope">
          <span>{{ scope.row.status == 0 ? '未完成' : '已完成' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="item.manualName" min-width="110" align="center" v-for="(item,index) in columnList" :key="index" >
        <template #default="scope">
          <span v-if="scope.row.manualCompletion[item.id] == 1">已学习</span>
          <span v-else>未学习</span>
        </template>
      </el-table-column>
      <el-table-column label="学习完成率" align="center" min-width="150" prop="completionRate">
      <template #default="scope">
          <span><el-progress :percentage="scope.row.completionRate" /></span>
        </template>
      </el-table-column>
      <el-table-column label="最后学习时间" align="center" min-width="160" prop="lastTime" />
      <!-- <el-table-column label="推送学习提醒" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="推送" placement="top">
                <el-button link type="primary" icon="Position" @click="handleDelete(scope.row)"></el-button>
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

