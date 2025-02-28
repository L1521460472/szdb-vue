/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-24 17:24:28
 */
import { ref, reactive, watch, nextTick } from "vue";
import { listCategoryDetail,} from "@/api/project/project";
import { addOrUpOrder,addOrUpTask,addOrUpMember } from "@/api/develop/orderList";
import { cloneDeep, set } from 'lodash-es';
import {HOLIDAY} from '../../../arts/project/hooks/holiday.js'; 
import { getToken } from "@/utils/auth";
import { useRouter } from 'vue-router'
export default function ($vm) {
  const router = useRouter()
  const dialogVisible = ref(false);
  const title = ref("新建订单");
  const open = ref(false);
  const taskTitle = ref("新建任务");
  const taskOpen = ref(false);
  const addMemberOpen = ref(false);
  const loading = ref(false);
  const taskId = ref('');
  const activeNames = ref(['1','2','3'])
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "新建合同",
    width: "40%",
    closeOnClickModal: false,
    btnList: [
      {
        label: "确定",
        type: "primary",
        icon: "",
        event: "confirm",
        show: true,
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
      orderId: null,
      commerceDay: null,
      unitPrice: null,
      // chargeUserId: [],
    },
    disabled: false,
    fieldList: [],
    rules: {
      projectCode: [{ required: true, message: "项目编码不能为空", trigger: "blur" }],
      projectName: [{ required: true, message: "项目名称不能为空", trigger: "blur" }],
      projectEnterpriseName: [{ required: true, message: "项目企业不能为空", trigger: "blur" }],
      projectCategoryOneName: [{ required: true, message: "项目分类1不能为空", trigger: "blur" }],
      projectCategoryTwoName: [{ required: true, message: "项目分类2不能为空", trigger: "blur" }],
      projectApprovalTime: [{ required: true, message: "立项日期不能为空", trigger: "blur" }],
      plannedStartTime: [{ required: true, message: "计划开始日期不能为空", trigger: "blur" }],
      plannedEndTime: [{ required: true, message: "计划结束日期不能为空", trigger: "blur" }],
      //  projectExplanatory: [{ required: true, message: "注释不能为空", trigger: "blur" }],
      commerceDay: [{ required: true, message: "商务（天）不能为空", trigger: "blur" }],
      unitPrice: [{ required: true, message: "单价不能为空", trigger: "blur" }],
      fabrication: [{ required: true, message: "制作不能为空", trigger: "blur" }],
      outsourcingAmount: [{ required: true, message: "外包金额不能为空", trigger: "blur" }],
      orderAmount: [{ required: true, message: "订单金额不能为空", trigger: "blur" }],
      isContractor: [{ required: true, message: "是否包人不能为空", trigger: "blur" }],
      chargeUserId: [{ required: true, message: "项目成员不能为空", trigger: "blur" }],
      email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "blur"] }],
      phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
    },
    labelWidth: "150px",
  });
  const formInfoTask = reactive({
    ref: {},
    span: 12,
    data: {
      assignmentId: '',
      artsProjectFlowPathIdList: [],
    },
    disabled: false,
    fieldList: [],
    rules: {
      productionDepartmentId: [{ required: true, message: "制作部门不能为空", trigger: "blur" }],
      assignmentName: [{ required: true, message: "任务名称不能为空", trigger: "blur" }],
      artsProjectFlowPathName: [{ required: true, message: "项目流程不能为空", trigger: "blur" }],
      productionCycle: [{ required: true, message: "制作周期不能为空", trigger: "blur" }],
      plannedStartTime: [{ required: true, message: "计划开始日期不能为空", trigger: "blur" }],
      plannedEndTime: [{ required: true, message: "计划结束日期不能为空", trigger: "blur" }],
      // assignmentThumbnail: [{ required: true, message: "任务截图不能为空", trigger: "blur" }],
    },
    labelWidth: "150px",
  });
  const formInfoMember = reactive({
    ref: {},
    span: 12,
    data: {
      stageList: [],
      stageNames:[],
    },
    disabled: false,
    fieldList: [],
    rules: {
      stageList: [{ required: true, message: "负责阶段不能为空", trigger: "blur" }],
      userId: [{ required: true, message: "成员不能为空", trigger: "blur" }],
    },
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
    id: null,
  });
  /*** 上传文件*/
  const upload1 = reactive({
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
    url: import.meta.env.VITE_APP_BASE_API + "/develop/assignment/import/",
    id: null,
  });
  /**
   * @description: 监听弹窗表单disabled属性，为true时，隐藏弹窗【确定】按钮
   * @param {*}
   * @return {*}
   */
  // watch(
  //   () => !formInfo.disabled,
  //   (val) => {
  //     dialogInfo.btnList[1].show = val;
  //   }
  // );
  watch(
    () => open.value,
    (val) => {
      if (!val) {
        let obj = formInfo.data;
        Object.keys(obj).forEach((k) => {
          obj[k] = null;
        });
        // $vm.$refs["uploadRef"].clearFiles();
        // $vm.resetForm("projectRef");
      }
      
    },
  );
  watch(
    () => taskOpen.value,
    (val) => {
      if (!val) {
        let obj1 = formInfoTask.data;
        Object.keys(obj1).forEach((k) => {
          obj1[k] = null;
        });
        // $vm.$refs["uploadRef"].clearFiles();
        // $vm.resetForm("projectRef");
      }
    }
  );
  watch(
    () => addMemberOpen.value,
    (val) => {
      if (!val) {
        let obj2 = formInfoMember.data;
        Object.keys(obj2).forEach((k) => {
          obj2[k] = null;
        });
        formInfoMember.data.stageList = []
        formInfoMember.data.stageNames = []
      }
    }
  );

  /** 新增任务操作 */
  const handleAdd = () => {
    taskOpen.value = true;
  }
  /** 关闭订单弹窗 */
  const closeOrder = () => {
    open.value = false;
  };
  /** 订单保存 */
  const confirmOrder = () => {
    
    $vm.$refs["projectRef"].validate(valid => {
      if (valid) {
       $vm.$refs["projectRef1"].validate(valid => {
         if (valid) {
          $vm.$refs["projectRef2"].validate(valid => {
            if (valid) {
              const params = {
                ...formInfo.data,
                // chargeUserId: formInfo.data.chargeUserId.join(','),
                artsProjectFinance:{
                  id: formInfo.data.artsProjectFinance?.id || null,
                  commerceDay: formInfo.data.commerceDay,
                  unitPrice: formInfo.data.unitPrice,
                  fabrication: formInfo.data.fabrication,
                  outsourcingAmount: formInfo.data.outsourcingAmount,
                  orderAmount: formInfo.data.orderAmount,
                  projectId: formInfo.data.projectId,
                  remarks: formInfo.data.remarks,
                  isContractor: formInfo.data.isContractor,
                },//财务信息
              }
              // console.log(params)
              loading.value = true
              addOrUpOrder(params).then(response => {
                loading.value = false
                $vm.$modal.msgSuccess("操作成功");
                $vm.getOrderList();
                open.value = false;
              }).catch(() => {
                loading.value = false
              })
            }
          });
         }
       });
      }
    });
  };
  //删除图片
  const handleDeleteImg = ()=>{
    console.log('handleDeleteImg')
    formInfoTask.data.assignmentThumbnail = null
    upload.isUploading = false;
  }
  //上传文件弹框
  const openUpload = ()=>{
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
    formInfoTask.data.assignmentThumbnail = response.url
    upload.open = false;
    upload.isUploading = false;
    $vm.$refs["uploadRef"].handleRemove(file);
  };
    /** 导入数据 */
    const handleImport = () => {
      upload1.title = "导入任务";
      upload1.open = true;
    }
    /** 下载模板操作 */
    function importTemplate() {
      $vm.download("develop/assignment/importTemplate", {
      }, `finance_template_${new Date().getTime()}.xlsx`);
    };
    /** 提交导入任务文件 */
    function submitFileForm1() {
      $vm.$refs["uploadRef1"].submit();
    };
    /**导入任务文件上传中处理 */
    const handleFileUploadProgress1 = (event, file, fileList) => {
      upload1.isUploading = true;
    };
    /** 导入任务文件上传成功处理 */
    const handleFileSuccess1 = (response, file, fileList) => {
      // formInfoTask.data.assignmentThumbnail = response.url
      upload1.open = false;
      upload1.isUploading = false;
      $vm.$refs["uploadRef1"].handleRemove(file);
      $vm.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      $vm.getList($vm.oId);
    };
  
  /** 关闭订单弹窗 */
  const closeTask = () => {
    taskOpen.value = false;
  };
  const handleChangeDept = (value) => {
    //   console.log(value)
    formInfoTask.data.productionDepartmentId = value.slice(-1)[0]
  }
  /** 任务保存 */
  const confirmTask = () => {
    $vm.$refs["taskRef"].validate(valid => {
      if (valid) {
        if(Array.isArray(formInfoTask.data.productionDepartmentId)){
          formInfoTask.data.productionDepartmentId = formInfoTask.data.productionDepartmentId.slice(-1)[0]
        }
        if(Array.isArray(formInfoTask.data.artsProjectFlowPathIdList) && formInfoTask.data.artsProjectFlowPathIdList.length > 0){
          formInfoTask.data.artsProjectFlowPath = formInfoTask.data.artsProjectFlowPathIdList.join(',')
        }
        if(Array.isArray(formInfoTask.data.artsProjectFlowPathName)){
          formInfoTask.data.artsProjectFlowPathName = formInfoTask.data.artsProjectFlowPathName.join(',')
        }
        formInfoTask.data.orderId = $vm.oId;
        loading.value = true
        addOrUpTask(formInfoTask.data).then(response => {
          loading.value = false
          $vm.$modal.msgSuccess("操作成功");
          $vm.getList($vm.oId);
          taskOpen.value = false;
        }).catch(() => {
          loading.value = false
        })
      }
    });
  };
  /** 关闭成员弹窗 */
  const addMembercCncel = () => {
    addMemberOpen.value = false;
    formInfoMember.data.stageList = []
    formInfoMember.data.stageNames = []
  };
  /** 成员保存 */
  const submitAddMemberForm = () => {
    $vm.$refs["addMemberRef"].validate(valid => {
      if (valid) {
        formInfoMember.data.assignmentId = taskId.value;
        loading.value = true
        addOrUpMember(formInfoMember.data).then(response => {
          loading.value = false
          $vm.$modal.msgSuccess("操作成功");
          $vm.getList($vm.oId);
          addMemberOpen.value = false;
        }).catch(() => {
          loading.value = false
        })
      }
    });
  };

  // 可输入框
  const querySearch = (queryString, cb) => {
    const results = queryString
      ? $vm.listTypeInfo.categoryList.filter(createFilter(queryString))
      : $vm.listTypeInfo.categoryList
    cb(results)
  }
  const querySearch1 = (queryString, cb) => {
    const results = queryString
      ? $vm.listTypeInfo.codeList.filter(createFilter(queryString))
      : $vm.listTypeInfo.codeList
    // call callback function to return suggestions
    cb(results)
  }
  const createFilter = (queryString) => {
    return (restaurant) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      )
    }
  }
  const handleSelect = (item) => {
    // console.log(item)
    formInfo.data.projectEnterpriseId = item.id
    listCategoryDetail(item.id).then(response => {
      $vm.listTypeInfo.codeList = response.data.map((v)=>{
        v.value = v.categoryName
        v.link = v.id
        return v
      });
   });
  }
  //单价改变计算金额
  const handleChangePrice = (val) => {
    // console.log(val)
    if(formInfo.data.commerceDay){
      formInfo.data.orderAmount = Number(formInfo.data.commerceDay) * Number(formInfo.data.unitPrice)
    }
  }
  /** 改变开始日期触发 */
  const handleChangeStartDate = (val)=> {
    formInfo.data.plannedEndTime = getEndDate(val,formInfo.data.productionCycle)
    formInfoTask.data.plannedEndTime = getEndDate(val,formInfoTask.data.productionCycle)
  };
  /** 改变结束日期触发 */
  const handleChangeDate = (val)=> {
    if(new Date(formInfo.data.plannedStartTime).getTime() > new Date(val).getTime()){
      $vm.$modal.msgWarning('结束日期不能小于开始日期');
      formInfo.data.plannedEndTime = null;
      return
    }else{
      formInfo.data.productionCycle = getDay(formInfo.data.plannedStartTime,val)
    }
  };
  /** 改变结束日期触发 */
  const handleChangeDate1 = (val)=> {
    if(new Date(formInfoTask.data.plannedStartTime).getTime() > new Date(val).getTime()){
      $vm.$modal.msgWarning('结束日期不能小于开始日期');
      formInfoTask.data.plannedEndTime = null;
      return
    }else{
      formInfoTask.data.productionCycle = getDay(formInfoTask.data.plannedStartTime,val)
    }
  };
  /** 获取工作天数 */
  const getDay = (startTime,endTime)=> {                         
  var s = new Date(startTime),
      e = new Date(endTime);
  var _sw = s.getDay(),
      _ew = e.getDay();
  // console.log(s + "   " + e);
  if (s.getTime() <= e.getTime()) {
      if (s.getTime() == e.getTime() && _sw > 0 && _sw < 6) {
          console.log("同一天");
          return 1;
      } else if (s.getTime() == e.getTime() && (_sw == 0 || _sw == 6)) {
          console.log("同一天周末");
          return 0
      } else {
          var diffDay = (e - s) / (1000 * 60 * 60 * 24) + 1;
          var firWeekday = _sw < 6 && _sw > 0 ? 6 - _sw : 0; //第一周的工作日
          // console.log(firWeekday);
          var lastWeekday = (_ew > 0 ? _ew : 0) - (_ew == 6 ? 1 : 0); //最后一周的工作日
          var diffWeek = (diffDay - firWeekday - lastWeekday) > 0 ? Math.floor((diffDay - firWeekday - lastWeekday) / 7) : 0; //中间的周数
          var days = 0;
          var day1 = new Date('2023-10-07').getTime();
          var day2 = new Date('2023-10-08').getTime();
          for (var i = 0; i < HOLIDAY.length; i++) {                            //获取两个时间之间的工作日天数

            var holidaytime = new Date(HOLIDAY[i]).getTime();

            if (holidaytime >= s.getTime() && holidaytime <= e.getTime()) {    //如果两个时间之间包含节假日期就减去那天，得到需要的工作日天数

              days += 1;

            }

          }
          if (day1 >= s.getTime() && day1 <= e.getTime()) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
            days -= 1;
          }
          if (day2 >= s.getTime() && day2 <= e.getTime()) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
            days -= 1;
          }
          // console.log("days: " + days);
          // console.log("diff: " + diffWeek);
          if (diffWeek < 1) {
              // 周数小于1
              var __ew = _ew > 5 ? 5 : _ew;
              var __sw = _sw == 0 ? 1 : _sw;
              if (__ew >= __sw && diffDay < 7) {
                  // 同一周
                  return __ew - __sw + 1;
              } else {
                  // 跨周
                  return firWeekday + lastWeekday - days;
              }
          } else {
              return diffWeek * 5 + firWeekday + lastWeekday - days;
          }
      }
  } else {
      return -1; //日期区间错误
  }
  };
  /** 获取结束日期 */
  const getEndDate = (startTime,days)=> {   
    var s = cloneDeep(startTime)
    var week = Math.floor(days / 5);
    var _sw = new Date(startTime).getDay();
    // 开始日期判断为周末加上相应天数
    var sun = _sw == 0 ? 1 : 0;  //当天周日
    var saturday = _sw == 6 ? 2 : 0;  //当天周六
    // console.log(new Date(new Date(s).getTime()))                      
    startTime = startTime.split("-");
    //转换为MM-DD-YYYY格式
    var nDate = new Date(startTime[1] + "-" + startTime[2] + "-" + startTime[0]);
    var millSeconds = Math.abs(nDate) + days * 24 * 60 * 60 * 1000 + (week * 2 - 1 + sun + saturday) * 24 * 60 * 60 * 1000;
    // 结束日期判断为周末加上相应天数
    var _ew = new Date(millSeconds).getDay();
    var _sun = _ew == 0 ? 1 : 0  //结束为周日
    var _saturday = _ew == 6 ? 2 : 0  //结束为周六
    millSeconds = millSeconds + (_sun + _saturday) * 24 * 60 * 60 * 1000;
    //期间有节假日加上相应天数
    var _days = 0;
    var day1 = new Date('2023-10-07').getTime();
    var day2 = new Date('2023-10-08').getTime();
    for (var i = 0; i < HOLIDAY.length; i++) {                            
      var holidaytime = new Date(HOLIDAY[i]).getTime();
      if (holidaytime >= new Date(s).getTime() && holidaytime <= millSeconds) {    //如果两个时间之间包含节假日期就减去那天，得到需要的工作日天数
        _days += 1;
      }
    }
    if (day1 >= new Date(s).getTime() && day1 <= millSeconds) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
      _days -= 1;
    }
    if (day2 >= new Date(s).getTime() && day2 <= millSeconds) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
      _days -= 1;
    }
    millSeconds = millSeconds + _days * 24 * 60 * 60 * 1000;

    var rDate = new Date(millSeconds);

    
        // _ew = rDate.getDay();

    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    return year + "-" + month + "-" + date;
  };
  //流程value改变
  const handleFlowChange = (item) => {
    // console.log(item)
    item.map((v)=>{
      $vm.listTypeInfo.flowList.map((p)=>{
        if(p.flowPathName == v){
          formInfoTask.data.artsProjectFlowPathIdList.push(p.id)
        }
      })
    })
    // formInfo.data.projectCategoryTwoId = item.id
  }
  //流程输入框失去焦点改变
  const handleFlowBlur = (val) => {
    let value = val.target.value;
    if(value){
      formInfoTask.data.artsProjectFlowPathName.push(value)
    }
  }

  return {
    dialogVisible,
    dialogInfo,
    formInfo,
    formInfoTask,
    formInfoMember,
    upload,
    upload1,
    title,
    open,
    taskTitle,
    taskOpen,
    addMemberOpen,
    taskId,
    activeNames,
    loading,
    handleAdd,
    closeOrder,
    confirmOrder,
    openUpload,
    submitFileForm,
    handleFileUploadProgress,
    handleFileSuccess,
    handleImport,
    importTemplate,
    submitFileForm1,
    handleFileUploadProgress1,
    handleFileSuccess1,
    closeTask,
    confirmTask,
    querySearch,
    querySearch1,
    handleSelect,
    handleChangePrice,
    handleChangeStartDate,
    handleChangeDate,
    handleChangeDate1,
    handleFlowChange,
    handleFlowBlur,
    addMembercCncel,
    submitAddMemberForm,
    handleDeleteImg,
    handleChangeDept
  };
}
