<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-09-14 10:50:21
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="制作部门" prop="productionDepartmentId">
          <!-- <el-select
            v-model="queryParams.productionDepartmentId"
            placeholder="制作部门"
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in listTypeInfo.depList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
          </el-select> -->
          <el-cascader
            v-model="queryParams.productionDepartmentId"
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
      <el-form-item label="日期" prop="producerId">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            @focus="handleFocus"
            @change="handleChangeTime"
            @calendar-change="handleCalendarChange"
          />
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

    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTabs">
      <!-- -----------------------------------------------------------------------------------资源日历-------------------------------------------------------------------- -->
      <el-tab-pane label="资源日历" name="first">
        <div class="gantt-box" style="height: 100%">
          <div class="ganttComponent" :id="refName" :ref="refName" v-if="tableData.data.length>0"></div>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getCalendarList"
          />
        </div>
      </el-tab-pane>
      <!-- -----------------------------------------------------------------------------------项目分工-------------------------------------------------------------------- -->
      <el-tab-pane label="项目分工" name="second">
        <el-table v-loading="loading" :data="projectTableData" :span-method="handleSpanMethod" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="项目企业" align="center" prop="projectEnterpriseName">
          <!-- <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="项目名称" align="center" prop="requirementName" />
          <el-table-column :label="item.dictLabel" align="center" v-for="(item,index) in listTypeInfo.stageList" :key="index">
          <template #default="scope">
              <span>{{ scope.row.list[item.dictCode + '-stageMakeUserName'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remarks" />
        </el-table>

        <pagination
          v-show="projectTotal > 0"
          :total="projectTotal"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <!-- -----------------------------------------------------------------------------------人员排期-------------------------------------------------------------------- -->
      <el-tab-pane label="人员排期" name="third">
        <el-table v-loading="loading" :data="personnelTableData" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="制作人员" align="center" min-width="150" prop="producerName" show-overflow-tooltip>
          <!-- <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="本周项目" align="center" min-width="100" prop="projectName" />
          <el-table-column label="进行中需求" align="center" min-width="160" prop="ongoingNeed" />
          <el-table-column label="排队需求" align="center" min-width="160" prop="lineUpNeedOne" />
          <el-table-column label="排队需求2" align="center" min-width="160" prop="lineUpNeedTwo" />
        </el-table>

        <pagination
          v-show="personnelTotal > 0"
          :total="personnelTotal"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getSchedulingList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="Gantt">
// import {Grid,Expand,Plus,UserFilled,Setting,MoreFilled,Picture,WarnTriangleFilled} from '@element-plus/icons-vue'
import { ref,  getCurrentInstance, defineComponent} from "vue";
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const activeName = ref('first')
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    const handleClickTabs = (tab,event)=>{
      activeName.value = tab.props.name
      if(tab.props.name === 'second'){
        
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
      props,
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
$baseBackground:transparent;
$deepBackground:#EEF1F4;
$selectedBackground:#E2E5EA;
$fontBoldColor:#333;
$baseFontColor:#62666D;
$hoverBackground:#E2E5EA;
$borderColor:#D4D7E5;
.el-tabs :deep(.el-tabs__content){
  width: 100%;
  // height: 630px;
  height: 66vh;
  .el-tab-pane{
    width: 100%;
    height: 100%;
  }
  #pane-second {
    height: 100%;
    overflow-y: auto;
  }
  #pane-second .el-table {
    // flex: 1;
    height: calc(100% - 52px);
  }
  #pane-third {
    height: 100%;
    display: flex !important;
    flex-direction: column;
    overflow: hidden;
  }
  #pane-third .el-table {
    flex: 1;
  }
}
  .box {
    padding: 15px;
    .el-col {
      margin-bottom: 15px;
    }
  }



.gantt-box{
    position: relative;
    .full-screen-box{
        cursor: pointer;
        position: absolute;
        right: 20px;
        bottom: 20px;
        font-size: 40px;
    }
}
.ganttComponent{
    position: relative;
    min-height: 550px;
    height:calc(100% - 100px);
    padding-top: 10px;
    margin-bottom: 10px;
    :deep(.gantt_layout_cell){
        background: $baseBackground;
    }
    :deep(.gantt_layout_cell_border_bottom){
        border-bottom: none;
    }
    :deep(.gantt_layout_cell_border_top){
        border-top: none;
    }
    :deep(.gantt_layout_cell_border_right){
        border-right: none;
    }
    :deep(.gantt_layout_cell_border_left){
        border-left: none;
    }
    :deep(.gantt_row){
        border-bottom: none;
        background: $baseBackground;
        &:hover{
            background-color: transparent;
        }
    }
    :deep(.gantt_grid_data .gantt_cell){
        color: $baseFontColor;
        font-size: 14px;
    }
    :deep(.custom-project){
        position: absolute;
        height: 32px;
        line-height: 32px;
        color: #fff;
        text-align: center;
        border: none !important;
        border-radius: 4px;
        font-weight: 500;
        font-size: 14px;
        margin-top: 5px;
        box-sizing: border-box;
        cursor: pointer;
    }
    :deep(.gantt_grid_scale .gantt_grid_head_cell){
        color: $fontBoldColor;
        font-size: 14px;
        font-weight: 600;
        &:first-of-type{
            text-align: left;
            padding-left: 25px;
        }
    }
    :deep(.gantt_grid_scale){
        background: $baseBackground;
        border: none;
    }
    :deep(.gantt_task_scale){
      // width: 40px !important;
        background: $baseBackground;
        border: none;
    }
    :deep(.gantt_scale_line){
        border: none;
    }
    :deep(.gantt_scale_cell){
      // width: 40px !important;
        //border: none;
        // border-bottom: 1px solid $borderColor;
        // border-right: 1px solid $borderColor;
        // border-top: 1px solid $borderColor;
        // color: #62666D;
        // font-size: 14px;
        // &:first-of-type{
        //     border-left:  1px solid $borderColor;
        // }
        // &.month-box{
        //     text-align: left;
        //     border:none;
        //     background:#285DE2;
        // }
    }
    :deep(.gantt_grid_head_cell:first-of-type){
      text-align:center;
      padding-left: 0;
    }
    :deep(.weekend){
      background-color: #f4f7f4 !important;
    }
    :deep(.gantt_task_row){
        border: none;
        background: $baseBackground;
    }
    :deep(.gantt_task_cell){
        border: none;
    }
    :deep(.gantt_task_row.gantt_selected){
        background: $selectedBackground !important;
    }
    :deep(.gantt_row.gantt_selected){
        background: $selectedBackground !important;
    }
    :deep(.gantt_task_content){
        font-size: 14px;
        font-weight: bold;
    }
    :deep(.gantt_task_inline_color.gantt_selected){
        box-shadow: none !important;
    }
}




  .gantt_tooltip{
    padding: 20px;
    padding-bottom: 13px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.15);
    border-radius: 4px;
}
.gantt_tooltip_task_name{
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 7px;
    color: #373737;
}
.gantt_tooltip_task_content{
    font-size: 14px;
    height: 28px;
    line-height: 28px;
    color: #62666D;
}
.gantt-name-box{
    box-sizing: border-box;
    display: block;
    width: 100%;
    text-align: left;
    padding-left: 19px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.gantt-name-click{
    cursor: pointer;
    &:hover{
        color: #e5e5e5;
    }
}
#priority-box{
    margin-top: 12px;
    display: block;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    padding: 0 16px;
    border-radius: 12px;
}
.priority-P1{
    color: #FF3900;
    background: #FFF1ED;
}
.priority-P2{
    color: #FF8400;
    background: #FFF2E5;
}
.priority-P3{
    color: #285DE2;
    background: #E6EDFF;
}
.priority-P4{
    color: #4FA401;
    background: #F3FFE8;
}
.gantt-error{
    display: none;
}
// .app-container :deep(.el-tabs__content) #pane-second {
//   height: 66vh;
//   display: flex !important;
//   flex-direction: column;
//   overflow: hidden;
// }
// .app-container :deep(.el-tabs__content) #pane-second .el-table {
//   flex: 1;
// }
// .app-container :deep(.el-tabs__content) #pane-third {
//   height: 66vh;
//   display: flex !important;
//   flex-direction: column;
//   overflow: hidden;
// }
// .app-container :deep(.el-tabs__content) #pane-third .el-table {
//   flex: 1;
// }
</style>

