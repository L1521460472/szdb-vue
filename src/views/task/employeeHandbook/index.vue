<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-04 10:30:01
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-06 18:01:43
-->
<template>
  <div class="app-container">
    <div class="top-box">
      <el-button type="primary" @click="handleTabsAdd">新增</el-button>
      <el-button type="success" @click="handleTabsEdits">编辑</el-button>
      <el-button type="danger" @click="handleTabsDelete">删除</el-button>
    </div>
    <div class="box">
      <div style="padding-top: 16px;">
        <div>您的学习任务已完成 {{ count }}%</div>
        <el-progress :percentage="count" />
      </div>
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane :label="item.title" :name="index" v-for="(item,index) in tabLists">
          <!-- <el-image v-if="item.manualFile" :src="item.manualFile" :preview-src-list="[item.manualFile]" fit="contain" /> -->
          <div style="width: 100%;height: 100%;" v-if="item.manualFile">
            {{ item.manualFile }}
            <iframe
            v-if="isPdf"
            :src="item.manualFile"
            type="application/x-google-chrome-pdf"
            width="100%"
            frameborder="0"
            scrolling="auto"
            height="100%" />
            <el-image
              v-else
              :src="item.manualFile"
              :zoom-rate="1.2"
              :preview-src-list="[item.manualFile]"
              :initial-index="4"
              fit="cover"
            />
          </div>
          <div style="width: 100%;height: 380px;line-height: 380px;text-align: center;" v-else> 请上传图稿 </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="box-text">
        <el-input
          :readonly="disabled"
          v-model="textareaValue"
          type="textarea"
          @change="handleChange"
        />
      </div> -->
    </div>
    <!-- 添加tabs标签对话框 -->
    <el-dialog :title="tltle" v-model="tabsOpen" :close-on-click-modal="false" width="400px" append-to-body>
        <el-form :model="tabsform" ref="tabsRef" label-width="80px">
          <el-form-item label="文件名称" prop="title" :rules="
          {
            required: true,
            message: '请输入文件名称',
            trigger: 'blur',
          }
         ">
            <div class="tabs-text">
                <el-input
                  v-model="tabsform.title"
                />
              </div>
          </el-form-item>
          <el-form-item label="文件" prop="fileName" class="fileUpload">
            <el-upload
              ref="uploadRef2"
              :limit="1"
              accept=".pdf"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="true"
              drag
            >
              <el-icon class="el-icon--upload"><Plus /></el-icon>
              <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
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
          </el-form-item>
        </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitTabsForm">确 定</el-button>
               <el-button @click="tabsOpen = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
  </div>
</template>
<script setup>
import { ref,onMounted, computed } from 'vue'
import { getPage, getAdd, getEdit, getDelete, getDetail,getLearn,getLearnAdd } from "@/api/task/employeeHandbook";
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
 const tltle = ref('新增')
 const type = ref('add')
 const activeName = ref(0)
 const count = ref(0)
 const percentageAll = ref(0)
 const tabsOpen = ref(false)
 const isPdf = ref(false)
 const tabLists = ref([])
 const percentage = computed(()=>{
  return (Number(activeName.value) + 1) / percentageAll.value * 100
 })
 //添加标签
const tabsform = reactive({
  title:'',
  name:'',
  fileName:'',
  url:'',
})
 /*** 上传文件*/
const upload = reactive({
 // 是否显示弹出层（用户导入）
 open: false,
 // 弹出层标题（用户导入）
 title: "",
 // 是否禁用上传
 isUploading: false,
// 是否封面上传
 isCover: false,
 // 是否更新已经存在的用户数据
 updateSupport: 0,
 // 设置上传的请求头部
 headers: { Authorization: "Bearer " + getToken() },
 // 上传的地址
 url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
 id: null,
});
 const handleDisabled = ()=>{
  console.log('Disabled')
 }
 //项目详情tabs
  const handleClick = (tab, event) => {
    console.log(tab.index, event,activeName.value)
    if (tabLists.value[tab.index].manualFile && tabLists.value[tab.index].manualFile.slice(-3) === 'pdf') {
      isPdf.value = true
    } else {
      isPdf.value = false
    }
    getLearnAddData(tab.index)
  }
  const handleTabsEdit = (targetName, action) => {
    if (action === 'add') {
      tabsform.title = '';
      tabsOpen.value = true;
      upload.isCover = true;
      setTimeout(()=>{
        proxy.$refs["uploadRef2"].clearFiles()
      })
    } else if (action === 'remove') {
      tabLists.value.splice(targetName,1)
      activeName.value = tabLists.value.length - 1
    }
  }
  //tabs 新增
  const handleTabsAdd = () => {
    type.value = 'add'
    tltle.value = '新增'
    tabsform.title = '';
    tabsOpen.value = true;
    upload.isCover = true;
    setTimeout(()=>{
      proxy.$refs["uploadRef2"].clearFiles()
    })
  }
  // 修改
  const handleTabsEdits = () => {
    if(tabLists.value.length == 0) {
      proxy.$modal.msgError("没有可编辑的手册!");
    }
    type.value = 'edit'
    tltle.value = '修改'
    tabsform.title = tabLists.value[activeName.value].manualName;
    tabsform.url = tabLists.value[activeName.value].manualFile;
    if (tabLists.value[activeName.value].manualFile && tabLists.value[activeName.value].manualFile.slice(-3) === 'pdf') {
      isPdf.value = true
    } else {
      isPdf.value = false
    }
    tabsOpen.value = true;
    upload.isCover = true;
    setTimeout(()=>{
      proxy.$refs["uploadRef2"].clearFiles()
    })
  }
  // 删除
  const handleTabsDelete = () => {
    proxy.$modal.confirm('是否确认删除此员工手册？').then(function () {
      return getDelete(tabLists.value[activeName.value]?.id);
    }).then(() => {
      getPageData();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 添加tabs */
  const submitTabsForm =()=> {
  proxy.$refs["tabsRef"].validate(valid => {
   if (valid) {
    const params = {
      id: type.value == 'edit' ? tabLists.value[activeName.value]?.id : null,
      manualName: tabsform.title,
      manualFile: tabsform.url,
      manualManual: tabsform.content
    }
    if(type.value == 'add'){
      getAdd(params).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        getPageData()
      });
    }else{
      getEdit(params).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        getPageData()
      });
    }
    tabsOpen.value = false;
  }
 });
};
  /**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
 upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
    tabsform.url = response.url
    tabsform.fileName = response.originalFilename
    tabsform.name = response.originalFilename
    upload.isUploading = false;
};

/** 查询员工手册列表 */
const getPageData = ()=> {
  getPage().then(response => {
    tabLists.value = response.rows?.map((item, index)=>{
      item.name = index + '';
      item.title = item.manualName;
      item.content = item.manualManual;
      return item
    });
    percentageAll.value = response.rows.length
    activeName.value = 0
    if (tabLists.value[0].manualFile && tabLists.value[0].manualFile.slice(-3) === 'pdf') {
      isPdf.value = true
    } else {
      isPdf.value = false
    }
 });
};
/** 查询员工手册进度 */
const getLearnData = ()=> {
  getLearn().then(response => {
    console.log(response);
    count.value = response.data;
 });
};
/** 查询员工手册进度 */
const getLearnAddData = (idx)=> {
  getLearnAdd(tabLists.value[idx]?.id).then(response => {
    console.log(response);
    getLearnData()
 });
};

onMounted(() => {
  getPageData()
  getLearnData()
})

</script>
<style scoped lang="scss">
.top-box{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-tabs :deep(.el-tabs__new-tab){
  display: none;
}
.addTab{
  position: absolute;
  top: 4px;
  right: 20px;
  z-index: 99;
}
.box{
  height: calc(100vh - 164px);
  display: flex;
  flex-direction: column;
  .box-text{
    flex: 1;
    overflow-y: auto;
    .el-textarea{
      height: 100%;
      :deep(.el-textarea__inner){
        height: 100%;
      }
    }
  }
}
.el-tabs :deep(.el-tabs__content){
  width: 100%;
  // height: 630px;
  // height: 66vh;
  height: calc(100vh - 270px);
  .el-tab-pane{
    width: 100%;
    height: 100%;
  }
}
.fileUpload :deep(.el-upload .el-upload-dragger){
  padding: 0 !important;
}
.fileUpload :deep(.el-form-item__content){
  line-height: 0 !important;
  .el-upload-list{
     .el-upload-list__item-file-name {
       height: 16px;
       line-height: 16px;
     }
   } 
}
.fileUpload :deep(.el-upload .el-upload-dragger .el-icon--upload){
  margin-bottom: 0 !important;
  font-size: 100px;
}

</style>