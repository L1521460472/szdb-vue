/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-08-06 11:55:19
 */
import { ref, reactive, watch, nextTick } from "vue";
import { getInfo,addTask,editTask } from "@/api/task/mytask";
import { getToken } from "@/utils/auth";
import { cloneDeep } from "lodash";
// import { useRouter } from 'vue-router'
export default function ($vm) {
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "新增",
    width: "64%",
    btnList: [
      {
        label: "保存",
        type: "primary",
        icon: "",
        event: "confirm",
        show: true,
      },
      {
        label: "保存并提交",
        type: "primary",
        icon: "",
        event: "confirmSave",
        show:  true,
      },
      { label: "取消", type: "", icon: "", event: "close", show: true },
    ],
  });
  /**
   * @description: 基础表单配置
   */
  const formInfo = reactive({
    ref: {},
    span: 12,
    data: {
      type: 1,
      producerId: '',
      artsProjectRateAddListRequestList: [
        {
          projectId:null,
          projectStage:null,
          projectRate:null,
          makeTime:null,
          time:null,
          taskTime:null,
          rateFile:null,
        }
      ],
      approveRecordVo:{
        approveName:null,
        time:null,
        attributeVoList:[],
      }
    },
    disabled: false,
    fieldList: [
    ],
    rules: {},
    labelWidth: "150px",
  });
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

  /**
   * @description: 监听弹窗表单disabled属性，为true时，隐藏弹窗【确定】按钮
   * @param {*}
   * @return {*}
   */
  watch(
    () => !formInfo.disabled,
    (val) => {
      dialogInfo.btnList[1].show = val;
    }
  );
  watch(
    () => dialogInfo.visible,
    (val) => {
      if (!val) {
        // let obj = formInfo.data;
        // Object.keys(obj).forEach((k) => {
        //   obj[k] = null;
        // });
        $vm.listTypeInfo.projectList = $vm.listTypeInfo.projectList.map((item)=>{
          item.disabled = false;
          return item
        })
      }
      
    }
  );

  /** 搜索按钮操作 */
  const handleQuery = () => {
    $vm.queryParams.pageNum = 1;
    $vm.getList();
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    $vm.resetForm("queryRef");
    handleQuery();
  }

  const dataList = ref([])

  /** 新增按钮操作 */
  const handleAdd = (row) => {
    formInfo.disabled = false;
    formInfo.data.type = 1
    formInfo.data.producerId = ''
    formInfo.data.artsProjectRateAddListRequestList = [
      {
        projectId:null,
        projectStage:null,
        projectRate:null,
        time:null,
        taskTime:null,
        remarks:null,
        rateFile:null,
      }
    ]
    formInfo.data.approveRecordVo = {
      approveName:null,
      time:null,
      attributeVoList:[],
    }
    getInfo().then(async(response) => {
      $vm.listTypeInfo.projectList = response.rows
      $vm.listTypeInfo.stateList = response.rows.artsProjectStages
      // if(response.rows.length > 0){
      //   // formInfo.data.producerId = Number(userId.value)
      //   dataList.value = cloneDeep(response.rows)
      //   const list = await response.rows.map((v)=>v.projectId)
      //   $vm.listTypeInfo.projectList = $vm.listTypeInfo.projectList.map((item)=>{
      //     if(!list.includes(item.id)){
      //       item.disabled = true
      //     }
      //     return item
      //   })
      // }else{
      //   $vm.listTypeInfo.projectList = $vm.listTypeInfo.projectList.map((item)=>{
      //     item.disabled = true;
      //     return item
      //   })
      // }
    });
    $vm.type = 'add';
    dialogInfo.width = '64%';
    dialogInfo.btnList[0].show = true;
    dialogInfo.btnList[1].show = true;
    dialogInfo.visible = true;
    dialogInfo.title = "新建任务";
  }
  /** 关闭弹窗 */
  const close = () => {
    dialogInfo.visible = false;
  };
  /** 保存 */
  const confirm = () => {
    let isTrue = true;
    formInfo.data.artsProjectRateAddListRequestList.map((item)=>{
      if(item.projectId == null || item.projectId == ''){
        isTrue = false
        return $vm.$modal.msgWarning("项目名称不能为空");
      }else if(item.projectStage == null || item.projectStage == ''){
        isTrue = false
        return $vm.$modal.msgWarning("阶段不能为空");
      }else if(item.projectRate == null || item.projectRate == ''){
        isTrue = false
        return $vm.$modal.msgWarning("进度不能为空");
      }else if(item.time == null || item.time == ''){
        isTrue = false
        return $vm.$modal.msgWarning("用时不能为空");
      }else{
        isTrue = true
      }
    })
    if(isTrue){
      formInfo.data.type = 1;
      if($vm.type == 'add'){
        addTask(formInfo.data).then(response => {
          if(response.code == 200){
            $vm.getList()
            $vm.$modal.msgSuccess("保存成功");
          }
        });
      }else{
        const params = {
          timeConsuming:formInfo.data.artsProjectRateAddListRequestList[0].time,
          taskTime:formInfo.data.artsProjectRateAddListRequestList[0].taskTime,
          rateFile:formInfo.data.artsProjectRateAddListRequestList[0].rateFile,
          approveRemarks:'',
          id:formInfo.data.id,
          projectStageRate:formInfo.data.artsProjectRateAddListRequestList[0].projectRate,
          type:1,
          projectStageName:formInfo.data.artsProjectRateAddListRequestList[0].projectStage,
          projectId:formInfo.data.artsProjectRateAddListRequestList[0].projectId,
          makeTime:formInfo.data.artsProjectRateAddListRequestList[0].makeTime,
          remarks:formInfo.data.artsProjectRateAddListRequestList[0].remarks
        }
        editTask(params).then(response => {
          if(response.code == 200){
            $vm.getList()
            $vm.$modal.msgSuccess("保存成功");
          }
        });
      }
      dialogInfo.visible = false;
    }
  };
  /** 保存并提交 */
  const confirmSave = () => {
    let isTrue = true;
    formInfo.data.artsProjectRateAddListRequestList.map((item)=>{
      if(item.projectId == null || item.projectId == ''){
        isTrue = false
        return $vm.$modal.msgWarning("项目名称不能为空");
      }else if(item.projectStage == null || item.projectStage == ''){
        isTrue = false
        return $vm.$modal.msgWarning("阶段不能为空");
      }else if(item.projectRate == null || item.projectRate == ''){
        isTrue = false
        return $vm.$modal.msgWarning("进度不能为空");
      }else if(item.time == null || item.time == ''){
        isTrue = false
        return $vm.$modal.msgWarning("用时不能为空");
      }else{
        isTrue = true
      }
    })
    if(isTrue){
      formInfo.data.type = 2;
      if($vm.type == 'add'){
        addTask(formInfo.data).then(response => {
          if(response.code == 200){
            $vm.getList()
            $vm.$modal.msgSuccess("提交成功");
          }
        });
      }else{
        const params = {
          timeConsuming:formInfo.data.artsProjectRateAddListRequestList[0].time,
          taskTime:formInfo.data.artsProjectRateAddListRequestList[0].taskTime,
          rateFile:formInfo.data.artsProjectRateAddListRequestList[0].rateFile,
          approveRemarks:'',
          id:formInfo.data.id,
          projectStageRate:formInfo.data.artsProjectRateAddListRequestList[0].projectRate,
          type:2,
          projectStageName:formInfo.data.artsProjectRateAddListRequestList[0].projectStage,
          projectId:formInfo.data.artsProjectRateAddListRequestList[0].projectId,
          remarks:formInfo.data.artsProjectRateAddListRequestList[0].remarks
        }
        editTask(params).then(response => {
          if(response.code == 200){
            $vm.getList()
            $vm.$modal.msgSuccess("提交成功");
          }
        });
      }
      dialogInfo.visible = false;
    }
  };

  /** 新增工作进度 */
  const handleAddRate = ()=> {
    formInfo.data.artsProjectRateAddListRequestList.push({
      projectId:null,
      projectStage:null,
      projectRate:null,
      time:null,
      taskTime:null,
      rateFile:null,
    })
  };

  //上传文件弹框
  const openUpload = (index)=>{
    upload.index = index;
    upload.title = "上传";
    upload.open = true;
  }
  /** 提交上传文件 */
  function submitFileForm() {
    $vm.$refs["uploadRef"].submit();
  };
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
    formInfo.data.artsProjectRateAddListRequestList[upload.index].rateFile = response.url
    upload.open = false;
    upload.isUploading = false;
    $vm.$refs["uploadRef"].handleRemove(file);
  };
  const getTwo = (val)=>{
    if(val.length > 2){
      val = val.substring(val.length - 2 )
    }
    return val
  }
  // 改变项目值获取阶段
  const handleProjectId = (val,index)=>{
    var arr = $vm.listTypeInfo.projectList.filter(item=>item.projectId == val)
    $vm.listTypeInfo.stateList = arr[0].artsProjectStages
    formInfo.data.artsProjectRateAddListRequestList[index].projectStage = ''
    // dataList.value.map(async(item)=>{
    //   if(item.projectId == val){
    //     const list = await item.artsProjectStages.map((v)=>v.stageName)
    //     $vm.project_stage = $vm.project_stage.map((item)=>{
    //       if(!list.includes(item.value)){
    //         item.disabled = true
    //       }
    //       return item
    //     })
    //   }
    // })
  }

  return {
    dialogInfo,
    formInfo,
    upload,
    dataList,
    handleQuery,
    resetQuery,
    handleAdd,
    close,
    confirm,
    confirmSave,
    handleAddRate,
    openUpload,
    submitFileForm,
    handleFileUploadProgress,
    handleFileSuccess,
    getTwo,
    handleProjectId
  };
}
