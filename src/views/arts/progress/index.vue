<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="客户名称" label-width="80px" style="width: 280px" prop="projectEnterpriseName">
          <el-input
              v-model="queryParams.projectEnterpriseName"
              placeholder="请输入客户名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="项目代码" label-width="80px" style="width: 280px" prop="projectCode">
          <el-input
              v-model="queryParams.projectCode"
              placeholder="请输入项目代码"
              clearable
          />
        </el-form-item>
        <el-form-item label="需求名称" label-width="80px" style="width: 280px" prop="projectId">
          <el-select
            v-model="queryParams.projectId"
            placeholder="需求名称"
            filterable
            clearable
            style="width: 240px"
          >
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" label-width="80px" style="width: 280px" prop="deptId">
          <el-cascader
              v-model="queryParams.deptId"
              :options="departmentList"
              :props="props"
              filterable
              :show-all-levels="false"
              @change="handleChangeDept"
              />
        </el-form-item>
        <el-form-item label="制作人" label-width="80px" style="width: 280px" prop="producerId">
          <el-select
            v-model="queryParams.producerId"
            placeholder="制作人"
            clearable
            filterable
            style="width: 240px"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="time">
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
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
     </el-row>

     <el-table v-loading="loading" :data="rateList" @selection-change="handleSelectionChange" border>
        <el-table-column type="index" label="序号" width="55" align="center" fixed="left" />
        <el-table-column label="客户名称" align="center" min-width="100" prop="projectEnterpriseName" fixed="left" v-if="columns[0].visible" />
        <el-table-column label="项目代码" align="center" min-width="100" prop="projectCode" fixed="left" v-if="columns[1].visible" />
        <el-table-column label="需求名称" align="center" min-width="100" prop="projectName" fixed="left" v-if="columns[2].visible" >
          <template #default="scope">
            <span @click="handleProjectOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考原画" align="center" min-width="100" prop="fileUrl" fixed="left" v-if="columns[2].visible" >
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="defaultUrl" fit="fit" />
          </template>
        </el-table-column>
        <el-table-column label="制作人" align="center" prop="producerName" fixed="left" v-if="columns[3].visible" />
        <el-table-column label="开始日期" align="center" width="110" prop="createTime" fixed="left" v-if="columns[4].visible" />
        <el-table-column label="结束日期" align="center" width="110" prop="endTime" fixed="left" v-if="columns[5].visible" />
        <el-table-column label="当前阶段" align="center" prop="projectStage" fixed="left" v-if="columns[6].visible" />
        <el-table-column label="进度" align="center" prop="projectRate" fixed="left" v-if="columns[7].visible" >
          <template #default="scope">
            <span>{{ scope.row.projectRate }} <span v-if="scope.row.projectRate">%</span></span>
           </template>
        </el-table-column>
        <el-table-column label="商务人天" width="100" align="center" prop="commerceDay" fixed="left" />
        <el-table-column label="计划用时(天)" width="100" align="center" prop="plannedTime" fixed="left" v-if="columns[8].visible" />
        <el-table-column label="实际用时(天)" width="100" align="center" prop="actualTime" fixed="left" v-if="columns[9].visible" />
        <el-table-column :label="item.label" min-width="160" align="center" v-for="(item,index) in columnList" :key="index" >
          <template #default="scope">
            <div style="display: flex;align-items: center;width: 100%;margin-bottom: 5px;" v-for="v in scope.row.artsProjectRateDataListResponses[index].artsProjectRates">
              <div style="width: 50px;">{{ v.projectStageName }}</div>
              <div style="width: 50px;">{{ v.timeConsuming }}</div>
              <el-image style="width: 100px; height: 50px" :src="v.rateFile" :preview-src-list="[v.rateFile]" :z-index="9999" preview-teleported/>
            </div>
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

     <!-- 添加或修改岗位对话框 -->
     <el-dialog :title="title" v-model="open" width="60%" append-to-body>
        <el-form ref="rateRef" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="制作人" prop="producerId">
                <el-select
                  v-model="form.producerId"
                  placeholder="制作人"
                  clearable
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in userOptions"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-box-title">
            <div>工作事项 </div>
            <div><el-button :icon="Plus" @click="handleAddRate">新增</el-button></div>
          </div>
          <div class="dialog-box-banner">
            <el-card class="box-card" v-for="(item,index) in form.artsProjectRateAddListRequestList" :key="index">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目名称">
                    <el-select
                      v-model="item.projectId"
                      placeholder="项目名称"
                      clearable
                      style="width: 240px"
                    >
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.id"
                        :label="item.projectName"
                        :value="item.id"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="阶段">
                    <el-select v-model="item.projectStage" placeholder="岗位状态" clearable style="width: 200px">
                      <el-option
                          v-for="dict in project_stage"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="进度(%)">
                    <el-input v-model="item.projectRate" placeholder="请输入进度" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用时(天)">
                    <el-input v-model="item.time" placeholder="请输入用时" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="height: 200px;display: flex;justify-content: center;align-items: center;background-color: #e5e5e5;">
                    <el-image v-if="item.rateFile" style="width: 100%;height: 200px;" :src="item.rateFile" :fit="fit" />
                    <div v-else>请上传工作截图</div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="display: flex;justify-content: center;align-items: center;height: 40px;margin-top: 10px;">
                    <el-button :icon="Plus" @click="openUpload(index)">工作截图</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-form>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
           </div>
        </template>
     </el-dialog>
     <!-- 上传文件对话框 -->
     <el-dialog :title="upload.title" v-model="upload.open" :close-on-click-modal="false" width="400px" append-to-body>
         <el-upload
            ref="uploadRef"
            :limit="1"
            accept="jpg,png,svg,gif,webp"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
         >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
               </div>
            </template> -->
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

<script setup name="Progress">
import { listRate,addRate,getRate,userList,listProject,getProject } from "@/api/project/progress";
import { deptList } from "@/api/money/orderStatistics";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";
import {Grid,Expand,Plus,UserFilled,Setting,MoreFilled,Picture,WarnTriangleFilled} from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance();
const { project_stage } = proxy.useDict("project_stage");
const router = useRouter();
import defaultUrl from '../../../assets/logo/image.png';

const rateList = ref([]);
const userOptions = ref([]);//成员
const projectOptions = ref([]);//项目列表
const departmentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const uploadRef = ref(null);
const userId = ref(Cookies.get("userId"));
// 列显隐信息
const columns = ref([
 { key: 0, label: `项目企业`, visible: true },
 { key: 1, label: `项目代码`, visible: true },
 { key: 2, label: `项目名称`, visible: true },
 { key: 3, label: `制作人`, visible: true },
 { key: 4, label: `开始日期`, visible: true },
 { key: 5, label: `结束日期`, visible: true },
 { key: 6, label: `当前阶段`, visible: true },
 { key: 7, label: `进度`, visible: true },
 { key: 8, label: `计划用时(天)`, visible: true },
 { key: 9, label: `实际用时(天)`, visible: true },
]);
const props = {
  value: 'id',
  // expandTrigger: 'hover',
  checkStrictly : true
}
/*** 上传文件*/
const upload = reactive({
 // 是否显示弹出层（用户导入）
 open: false,
 // 弹出层标题（用户导入）
 title: "",
 // 是否禁用上传
 isUploading: false,
 // 是否更新已经存在的用户数据
 updateSupport: 0,
 // 设置上传的请求头部
 headers: { Authorization: "Bearer " + getToken() },
 // 上传的地址
 url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
 index: 0,
});
const columnList = ref([])
const time = ref('')
const chooseDay = ref(null)
const data = reactive({
 form: {
  producerId: '',
  artsProjectRateAddListRequestList: [
    {
      projectId:null,
      projectStage:null,
      projectRate:null,
      time:null,
      rateFile:null,
    }
  ]
 },
 queryParams: {
   pageNum: 1,
   pageSize: 50,
   projectId: null,
   producerId: null,
   startTime: '',
   endTime: '',
 },
 rules: {
  producerId: [{ required: true, message: "制作人不能为空", trigger: "blur" }],
  projectId: [{ required: true, message: "项目名称不能为空", trigger: "change" }],
  projectStage: [{ required: true, message: "阶段不能为空", trigger: "change" }],
  projectRate: [{ required: true, message: "进度不能为空", trigger: "blur" }],
  time: [{ required: true, message: "用时不能为空", trigger: "blur" }],
 }
});

watch(
  () => !open.value,
  (val) => {
    projectOptions.value = projectOptions.value.map((item)=>{
      item.disabled = false;
      return item
    })
  }
);

const { queryParams, form, rules } = toRefs(data);

 /** 查询部门列表 */
 function getDeptTreeList() {
  deptList().then(response => {
    departmentList.value = response.data;
 });
};

//部门下拉选择
const handleChangeDept = (value) => {
//   console.log(value)
  queryParams.value.deptId = value.slice(-1)[0]
}

/** 查询进度列表 */
function getList() {
 loading.value = true;
 listRate(queryParams.value).then(response => {
   rateList.value = response.rows;
   if(response.rows.length > 0){
    columnList.value = response.rows[0].artsProjectRateDataListResponses.map((item)=>{
      item.label = item.time
      return item
    })
   }
   total.value = response.total;
   loading.value = false;
 });
}
/** 查询成员列表 */
function getuserList() {
  userList().then(response => {
    userOptions.value = response.rows;
 });
};
/** 查询项目列表 */
function getProjectList() {
 listProject().then(res => {
   projectOptions.value = res.rows;
 });
};
/** 时间查询 */
function handleChangeTime(val) {
 queryParams.value.startTime = val[0];
 queryParams.value.endTime = val[1];
};
/** 时间查询 */
function handleCalendarChange(val) {
 const [pointDay] = val
 chooseDay.value = pointDay;
};
/** 获得焦点 */
function handleFocus(val) {
  chooseDay.value = null;
};
/** 时间限制范围查询 */
function disabledDate(time) {
 if(!chooseDay.value){
   return false
 }
 let timeRange = 30;
 const con1 = new Date(chooseDay.value).getTime() - timeRange * 24 * 60 * 60 * 1000;
 const con2 = new Date(chooseDay.value).getTime() + timeRange * 24 * 60 * 60 * 1000;
 return time < con1 || time > con2;
};
/** 时间初始化 */
function getTime() {
 const end = new Date()
 const start = new Date()
 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
 queryParams.value.startTime = proxy.parseTime(start,'{y}-{m}-{d}')
 queryParams.value.endTime = proxy.parseTime(end,'{y}-{m}-{d}')
 time.value = [proxy.parseTime(start,'{y}-{m}-{d}'), proxy.parseTime(end,'{y}-{m}-{d}')]
};
/** 新增工作进度 */
function handleAddRate() {
  form.value.artsProjectRateAddListRequestList.push({
    projectId:null,
    projectStage:null,
    projectRate:null,
    time:null,
    rateFile:null,
  })
};

//项目详情弹框
const handleProjectOpen = (row)=>{
  router.push({ path: "/arts/project", query: { id: row.projectId } });
}

//上传文件弹框
const openUpload = (index)=>{
  upload.index = index;
  upload.title = "上传";
  upload.open = true;
}
/** 提交上传文件 */
function submitFileForm() {
 proxy.$refs["uploadRef"].submit();
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
 upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  form.value.artsProjectRateAddListRequestList[upload.index].rateFile = response.url
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
};
/** 取消按钮 */
function cancel() {
 open.value = false;
 reset();
}
/** 表单重置 */
function reset() {
 form.value = {
  projectId:null,
  producerId:null,
  artsProjectRateAddListRequestList: [
    {
      projectId:null,
      projectStage:null,
      projectRate:null,
      time:null,
      rateFile:null,
    }
  ]
 };
 proxy.resetForm("rateRef");
}
/** 搜索按钮操作 */
function handleQuery() {
 queryParams.value.pageNum = 1;
 getList();
}
/** 重置按钮操作 */
function resetQuery() {
 proxy.resetForm("queryRef");
 handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
 ids.value = selection.map(item => item.postId);
 single.value = selection.length != 1;
 multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {//disabled
 reset();
 getRate().then(response => {
   if(response.code == 200){
    if(response.data.length > 0){
      form.value.producerId = Number(userId.value)
      projectOptions.value = projectOptions.value.map((item)=>{
        response.data.map((v)=>{
          if(item.id !== v.projectId){
            item.disabled = true;
          }
        })
        return item
      })
    }
   }
 });
 open.value = true;
 title.value = "工作进度";
}
//每日进度详情
const getRateDetail = (row)=>{
  
}
/** 修改按钮操作 */
function handleUpdate(row) {
 reset();
 const postId = row.postId || ids.value;
 getRate(postId).then(response => {
   form.value = response.data;
   open.value = true;
   title.value = "工作进度";
 });
}
/** 提交按钮 */
function submitForm() {
 proxy.$refs["rateRef"].validate(valid => {
   if (valid) {
    // addRate(form.value).then(response => {
    //   proxy.$modal.msgSuccess("新增成功");
    //   open.value = false;
    //   getList();
    // });
   }
 });
}
getTime();
getList();
getuserList();
getDeptTreeList();
getProjectList();
</script>
<style lang="scss" scoped>
.app-container{
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
.dialog-box-title{
  width: 100%;
  height: 40px;
  display: flex;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}
.dialog-box-banner{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.box-card{
  width: 49%;
  height: 400px;
  margin-bottom: 20px;
}
.el-form :deep(.el-form-item__label) {
  font-weight: 400 !important;
}
</style>