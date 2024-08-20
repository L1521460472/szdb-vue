<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-25 10:44:46
-->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTabs">
      <el-tab-pane label="我的待办" name="first">
        <el-table v-loading="loading" :data="tableData">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="50" align="center" type="index" />
          <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
              <span v-if="scope.row.type == 1">简历</span>
              <span v-if="scope.row.type == 2">制作</span>
            </template>
          </el-table-column>
          <el-table-column label="事项" align="center" prop="prepareName">
          <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.prepareName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发起人" align="center" prop="userName" />
          <el-table-column label="结束时间" align="center" prop="endTime" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <span v-if="scope.row.status == 1">待执行</span>
              <span v-if="scope.row.status == 2">已执行</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="完成待办" placement="top">
                    <el-button link type="primary" icon="SuccessFilled" @click="handleToDo(scope.row)"></el-button>
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
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="second">
        <el-table v-loading="loading" :data="tableDataList">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="50" align="center" type="index" />
          <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
              <span v-if="scope.row.type == 1">简历</span>
              <span v-if="scope.row.type == 2">制作</span>
            </template>
          </el-table-column>
          <el-table-column label="事项" align="center" prop="prepareName">
          <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.prepareName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参与人" align="center" prop="userName" />
          <el-table-column label="截止日期" align="center" prop="endTime" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <span v-if="scope.row.status == 1">待执行</span>
              <span v-if="scope.row.status == 2">已执行</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="撤回" placement="top" v-if="scope.row.status == 1">
                    <el-button link type="primary" icon="RefreshLeft" @click="handleRecall(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="handleDeleteTow(scope.row)"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalValue > 0"
          :total="totalValue"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getDataList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="MyTodo">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const activeName = ref('first')
    // tabs
    const handleClickTabs = (tab, event) => {
      // console.log(tab, event)
      if(tab.props.name == "first"){
        instance.getList()
      }else{
        instance.getDataList()
      }
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
      activeName,
      handleClickTabs,
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

