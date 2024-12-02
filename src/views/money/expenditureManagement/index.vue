<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-27 10:26:02
-->
<template>
  <div class="app-container">
    <el-button class="addTab" @click="handleImport">导入数据</el-button>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTabs">
      <el-tab-pane label="基础费用" name="first">
        <el-table v-loading="loading" :data="tableData" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="费用归属时间" align="center" prop="expenditureTime" />
          <el-table-column label="费用名称" align="center" prop="expenditureName" />
          <el-table-column label="总支出" align="center" prop="expenditureCost" />
          <el-table-column label="费用导入时间" align="center" prop="createTime" />
          <!-- <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="撤回" placement="top" v-if="scope.row.status == 1">
                    <el-button link type="primary" icon="RefreshLeft" @click="handleRecall(scope.row)"></el-button>
                </el-tooltip>
              </template>
          </el-table-column> -->
        </el-table>
        <pagination
          v-show="totalValue > 0"
          :total="totalValue"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="工资数据" name="second">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="姓名" prop="name">
            <el-input
                  v-model="queryParams.name"
                  placeholder="请输入姓名"
                  clearable
                  style="width: 240px"
                />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-cascader
              v-model="queryParams.department"
              :options="listTypeInfo.departmentList"
              :props="props"
              filterable
              :show-all-levels="false"
              @change="handleChangeDept1"
              />
          </el-form-item>
          <el-form-item label="工资月份" prop="wagesTime">
            <el-date-picker
              v-model="queryParams.wagesTime"
              type="month"
              placeholder="工资月份"
              format="YYYY-MM"
              value-format="YYYY-MM"
            />
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 22px;">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" plain icon="Delete" @click="handleDelAll">批量删除</el-button>
          <el-button type="warning" plain icon="Upload" @click="handleImport1">导入工资</el-button>
          <el-button type="warning" plain icon="Upload" @click="handlePush">一键推送</el-button>
        </div>
        <el-table v-loading="loading" :data="tableDataList" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="部门" align="center" prop="department" />
          <el-table-column label="职位" align="center" prop="position" />
          <el-table-column label="工资月份" align="center" prop="wagesTime" />
          <el-table-column label="入职时间" align="center" prop="entryTime" />
          <el-table-column label="应发工资" align="center" prop="salary" />
          <el-table-column label="当月均摊" align="center" prop="monthlySpread" />
          <el-table-column label="法定天数" align="center" prop="legalDays" />
          <el-table-column label="税成本" align="center" prop="taxCost" />
          <el-table-column label="日成本" align="center" prop="dailyCost" />
          <el-table-column label="备注" align="center" prop="remarks" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
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
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getDataList"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 新增/编辑 -->
    <el-dialog
      v-model="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :width="'40%'"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
    <el-form ref="dialogRef" :model="formInfo.data" :rules="formInfo.rules" label-width="110px">
        <el-row>
          <el-col :span="12">
              <el-form-item label="姓名:" prop="name">
                <!-- <el-input v-model="formInfo.data.name" placeholder="请输入姓名" maxlength="30" /> -->
                <el-select v-model="formInfo.data.name" filterable placeholder="请选择姓名">
                    <el-option
                      v-for="item in listTypeInfo.userList"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="部门:" prop="department">
                <el-cascader
                  v-model="formInfo.data.department"
                  :options="listTypeInfo.departmentList"
                  :props="props"
                  filterable
                  :show-all-levels="false"
                  @change="handleChangeDept"
                  />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="职位:" prop="position">
                <el-input v-model="formInfo.data.position" placeholder="请输入职位" maxlength="30" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间:" prop="entryTime">
              <el-date-picker
                v-model="formInfo.data.entryTime"
                type="date"
                placeholder="入职时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="应发工资:" prop="salary">
                <el-input v-model="formInfo.data.salary" placeholder="请输入应发工资" maxlength="30" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="当月均摊:" prop="monthlySpread">
                <el-input v-model="formInfo.data.monthlySpread" placeholder="请输入当月均摊" maxlength="30" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="法定天数:" prop="legalDays">
                <el-input v-model="formInfo.data.legalDays" placeholder="请输入法定天数" maxlength="30" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="税成本:" prop="taxCost">
                <el-input v-model="formInfo.data.taxCost" placeholder="请输入税成本" maxlength="30" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="日成本:" prop="dailyCost">
                <el-input v-model="formInfo.data.dailyCost" placeholder="请输入日成本" maxlength="30" />
              </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="工资月份:" prop="wagesTime">
                <el-date-picker
                  v-model="formInfo.data.wagesTime"
                  type="month"
                  placeholder="工资月份"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注:" prop="entryTime">
              <el-input v-model="formInfo.data.remarks" placeholder="请输入备注" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
            <el-button @click="dialogInfo.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="50px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="日期" prop="date">
                    <el-date-picker
                      v-model="form.date"
                      type="month"
                      value-format="YYYY-MM"
                      placeholder="请选择"
                    />
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
        <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?type=' + upload.type + '&data=' + form.date"
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
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>

    <!-- 工资导入对话框 -->
    <el-dialog :title="upload1.title" v-model="upload1.open" width="500px" append-to-body>
        <el-form ref="reportRef" :model="formInfo.data" label-width="90px">
            <!-- <el-row>
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
            </el-row> -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件" class="fileUpload" prop="file">
                  <el-upload
                    style="width: 100%;"
                    ref="uploadRef1"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload1.headers"
                    :action="upload1.url"
                    :disabled="upload1.isUploading"
                    :on-progress="handleFileUploadProgress1"
                    :on-success="handleFileSuccess1"
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
                          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate1">下载模板</el-link>
                        </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitFileForm1">确 定</el-button>
              <el-button @click="upload1.open = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>
  </div>
</template>

<script name="ExpenditureManagement">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const activeName = ref('first')
    const props = {
      value: 'label',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    // tabs
    const handleClickTabs = (tab, event) => {
      // console.log(tab, event)
      if(tab.props.name == "first"){
        instance.getList()
        instance.upload.type = 1
      }else{
        instance.getDataList()
        // instance.upload.type = 2
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
      props,
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
.app-container{
  position: relative;
  height: calc(100vh - 84px);
}
.app-container .el-tabs{
  height: 100%;
}
.app-container .el-tab-pane{
  height: 100%;
  // display: flex !important;
  // flex-direction: column;
  // overflow: hidden;
}
#pane-first {
  height: 100%;
  overflow-y: auto;
}
#pane-first .el-table {
  // flex: 1;
  height: calc(100% - 52px);
}
#pane-second {
  height: 100%;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}
#pane-second .el-table {
  flex: 1;
}
.addTab{
  position: absolute;
  top: 16px;
  right: 20px;
  z-index: 99;
}
.app-container :deep(.el-tabs__content) {
  height: calc(100vh - 180px);
}
// .app-container {
//   padding: 20px;
//   height: calc(100vh - 84px);
// }

// .app-container :deep(.el-tabs__content) #pane-second {
//   height: 81vh;
//   display: flex !important;
//   flex-direction: column;
//   overflow: hidden;
// }
// .app-container :deep(.el-tabs__content) #pane-second .el-table {
//   flex: 1;
// }
// .el-col-20 {
//   height: 81vh;
//   display: flex !important;
//   flex-direction: column;
//   overflow: hidden;
// }

.el-tab-pane .el-table {
  flex: 1;
}
</style>

