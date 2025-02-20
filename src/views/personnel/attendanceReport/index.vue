<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-28 18:12:36
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
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="queryParams.deptId"
          :options="listTypeInfo.depList"
          :props="props"
          filterable
          :show-all-levels="false"
          @change="handleChangeDept"
          />
      </el-form-item>
      <el-form-item label="考勤状态" prop="attendanceStatus">
        <el-select
          v-model="queryParams.attendanceStatus"
          placeholder="考勤状态"
          clearable
          style="width: 240px"
        >
        <el-option
          v-for="item in listTypeInfo.statusList"
          :key="item.value"
          :label="item.key"
          :value="item.value"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="考勤月份" prop="attendanceMonth">
        <el-date-picker
          v-model="queryParams.attendanceMonth"
          type="month"
          placeholder="考勤月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
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
            @click="handleAdd"
          >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Promotion"
            @click="handlePush"
        >一键推送</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" :columnsTs="columns" @getColumnList="getColumnList" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" fixed="left" />
      <el-table-column label="姓名" align="center" prop="name" fixed="left">
        <!-- <template #default="scope">
          <span style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="职位" align="center" prop="positionName" />
      <el-table-column label="考勤状态" align="center" prop="attendanceStatus">
      <template #default="scope">
          <span style="color: #0d06db;" v-if="scope.row.attendanceStatus == 1">已确认</span>
          <span style="color: #ff9725;" v-if="scope.row.attendanceStatus == 2">未确认</span>
          <span v-if="scope.row.attendanceStatus == 3">异常</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" align="center" prop="employmentTime" />
      <el-table-column label="应出勤天数" align="center" prop="attendanceDay" />
      <el-table-column label="核算工资出勤天数" align="center" prop="accountingAttendanceDay" />
      <el-table-column label="加班（小时）" align="center" prop="workOvertime" />
      <el-table-column label="事假" align="center" prop="compassionateLeave" />
      <el-table-column label="病假" align="center" prop="sickLeave" />
      <el-table-column label="年假" align="center" prop="annualLeave" />
      <el-table-column label="婚/丧/陪产假" align="center" prop="marriageBereavementPaternityLeave" />
      <el-table-column label="全勤奖" align="center" prop="totalManagementSystem" />
      <el-table-column label="迟到次数" align="center" prop="numberLatencies" />
      <el-table-column label="缺卡次数" align="center" prop="numberMissingCards" />
      <el-table-column label="考勤扣款" align="center" prop="attendanceDeduction" />
      <el-table-column label="年假剩余（小时）" align="center" prop="remainingAnnualLeave" />
      <el-table-column label="调休剩余（小时）" align="center" prop="remainingCompensatoryLeave" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
                <el-button link type="primary" icon="edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
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

    <!-- 考勤明细对话框 -->
    <el-dialog title="考勤明细" v-model="visible" :close-on-click-modal="false" width="900" append-to-body>
        <el-form ref="rateRef" :model="formInfo.data" :rules="formInfo.data.rules" label-width="125px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="formInfo.data.name" placeholder="请输入姓名" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="部门" prop="deptId">
                      <el-cascader
                        ref="cascaderRef"
                        v-model="formInfo.data.deptId"
                        :options="listTypeInfo.depList"
                        :props="props"
                        filterable
                        :show-all-levels="false"
                        @change="handleChangeDept1"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="职位" prop="positionName">
                      <el-input v-model="formInfo.data.positionName" placeholder="请输入职位" maxlength="30" />
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="入职时间" prop="employmentTime">
                    <el-date-picker
                      v-model="formInfo.data.employmentTime"
                      type="date"
                      placeholder="入职时间"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="应出勤天数" prop="attendanceDay">
                      <el-input v-model="formInfo.data.attendanceDay" placeholder="请输入应出勤天数" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核算工资出勤天数" prop="accountingAttendanceDay">
                      <el-input v-model="formInfo.data.accountingAttendanceDay" placeholder="请输入核算工资出勤天数" maxlength="30" />
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="加班（小时）" prop="workOvertime">
                      <el-input v-model="formInfo.data.workOvertime" placeholder="请输入加班（小时）" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="事假" prop="compassionateLeave">
                      <el-input v-model="formInfo.data.compassionateLeave" placeholder="请输入事假" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="病假" prop="sickLeave">
                      <el-input v-model="formInfo.data.sickLeave" placeholder="请输入病假" maxlength="30" />
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="年假" prop="annualLeave">
                      <el-input v-model="formInfo.data.annualLeave" placeholder="请输入年假" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="婚/丧/陪产假" prop="marriageBereavementPaternityLeave">
                    <el-input v-model="formInfo.data.marriageBereavementPaternityLeave" placeholder="请输入婚/丧/陪产假" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="全勤奖" prop="totalManagementSystem">
                    <el-input v-model="formInfo.data.totalManagementSystem" placeholder="请输入全勤奖" maxlength="30" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="迟到次数" prop="numberLatencies">
                    <el-input v-model="formInfo.data.numberLatencies" placeholder="请输入迟到次数" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="缺卡次数" prop="numberMissingCards">
                    <el-input v-model="formInfo.data.numberMissingCards" placeholder="请输入缺卡次数" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考勤扣款" prop="attendanceDeduction">
                    <el-input v-model="formInfo.data.attendanceDeduction" placeholder="请输入考勤扣款" maxlength="30" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="年假剩余（小时）" prop="remainingAnnualLeave">
                    <el-input v-model="formInfo.data.remainingAnnualLeave" placeholder="年假剩余（小时）" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="调休剩余（小时）" prop="remainingCompensatoryLeave">
                    <el-input v-model="formInfo.data.remainingCompensatoryLeave" placeholder="调休剩余（小时）" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考勤状态" prop="attendanceStatus">
                    <el-select v-model="formInfo.data.attendanceStatus" placeholder="请选择考勤状态" clearable filterable>
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
                <el-col :span="24">
                  <el-form-item label="备注" prop="remarks">
                    <el-input v-model="formInfo.data.remarks" placeholder="请输入备注" maxlength="30" />
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="handleConfirm">确 定</el-button>
              <el-button @click="visible = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>

      <!-- 报表导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="500px" append-to-body>
        <el-form ref="reportRef" :model="formInfo.data" :rules="formInfo.rules" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="归属月份" prop="attendanceMonth">
                  <el-date-picker
                    v-model="formInfo.data.attendanceMonth"
                    type="month"
                    placeholder="请选择归属月份"
                    format="YYYY-MM"
                    value-format="YYYY-MM"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件" class="fileUpload" prop="file">
                  <el-upload
                    style="width: 100%;"
                    ref="uploadRef"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload.headers"
                    :action="upload.url + '?attendanceMonth=' + formInfo.data.attendanceMonth"
                    :disabled="upload.isUploading"
                    :on-progress="handleFileUploadProgress"
                    :on-success="handleFileSuccess"
                    :auto-upload="false"
                    drag
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <template #tip>
                        <div class="el-upload__tip text-center">
                          <!-- <div class="el-upload__tip">
                              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                          </div> -->
                          <span>仅允许导入xls、xlsx格式文件。</span>
                          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
                        </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
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
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    const cascaderRef = ref(null)
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
      cascaderRef,
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
.boxBj{
  width: 100%;
  height: 100%;
  background-color: red;
  color: yellow;
  display: inline-block;
}
</style>

