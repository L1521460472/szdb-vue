<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-09-14 11:05:28
-->
<template>
  <div class="app-container">
    <el-button class="addTab" @click="handleImport">导入数据</el-button>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTabs">
      <el-tab-pane label="团队支出" name="first">
        <el-table v-loading="loading" :data="tableData" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="费用归属时间" align="center" prop="expenditureTime" />
          <el-table-column label="团队名称" align="center" prop="expenditureName" />
          <el-table-column label="总支出" align="center" prop="expenditureCost" />
          <el-table-column label="费用导入时间" align="center" prop="createTime" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
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
      <el-tab-pane label="基础费用" name="second">
        <el-table v-loading="loading" :data="tableDataList" border>
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
          @pagination="getDataList"
        />
      </el-tab-pane>
    </el-tabs>
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
        instance.upload.type = 1
      }else{
        instance.getDataList()
        instance.upload.type = 2
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

