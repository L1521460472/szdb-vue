/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-24 17:01:56
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { taskList,orderDetail,orderDelDetail,taskDetail,addOrUpMember,getTaskCount,delMember,delAssignment,importAssignment } from "@/api/develop/orderList";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const oId = ref(0);
  const orderId = ref(null);
  const orderName = ref(null);
  const parentName = ref(null);
  const taskIndex = ref(0);
  const memberIndex = ref(0);
  const ids = ref([]);
  const date = ref([]);
  const taskIds = ref([]);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    projectId: undefined,
    orderByColumn: 'plannedStartTime',
    isAsc: 'desc',
    assignmentName: undefined,
    userId: undefined,
    plannedStartTime: undefined,
    plannedEndTime: undefined,
  })
  const totalObj = ref({
    ultimatelyDay: null,
    supplementDay: null,
    planDay: null,
    orderName: null,
    orderRemarks: null,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const taskTableData = ref([]);
  /** 查询表格列表 */
  const getList = (orderId,orderByColumn,isAsc) => {
    loading.value = true;
    oId.value = orderId
    const params = {
      orderId: oId.value,
      assignmentName: queryParams.value.assignmentName,
      userId: queryParams.value.userId,
      plannedStartTime: queryParams.value.plannedStartTime,
      plannedEndTime: queryParams.value.plannedEndTime,
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
      orderByColumn: queryParams.value.orderByColumn,
      isAsc: queryParams.value.isAsc,
    }
    taskList(params).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 根据订单id查询任务统计 */
  const getCount = () => {
    getTaskCount(oId.value).then(response => {
      totalObj.value = response.data;
    });
  }
  /** 通过条件过滤节点  */
  const filterNode = (value, data) => {
    console.log(value,data)
    if (!value) return true;
    return data.orderName.indexOf(value) !== -1;
  };
  /** 根据名称筛选部门树 */
  watch(orderName, val => {
    $vm.$refs["deptTreeRef"].filter(val);
  });
  /** 节点单击事件 */
  const handleNodeClick = (data,v,p)=> {
    orderId.value = data.orderId
    queryParams.value.productionDepartmentId = null
    if(!(v.parent.data instanceof Array)){
      parentName.value = v.parent.data.orderName
    }
    // if(data.children === null){
    //   queryParams.value.productionDepartmentId = data.id
    //   queryParams.value.categoryId = data.parentId
    // }else{
    //   queryParams.value.categoryId = data.id;
    // }
    getList(data.orderId);
    setTimeout(() => {
      getCount()
    }, 100);
  };
  /** 节点修改事件 */
  const handleTreeUpdate = (data,v,p)=> {
    // console.log(data)
    orderDetail(data.orderId).then(response => {
      if(response.data){
        $vm.formInfo.data = response.data
        $vm.formInfo.data.unitPrice = response.data.artsProjectFinance.unitPrice
        $vm.formInfo.data.fabrication = response.data.artsProjectFinance.fabrication
        $vm.formInfo.data.outsourcingAmount = response.data.artsProjectFinance.outsourcingAmount
        $vm.formInfo.data.orderAmount = response.data.artsProjectFinance.orderAmount
        $vm.formInfo.data.remarks = response.data.artsProjectFinance.remarks
        $vm.formInfo.data.isContractor = response.data.artsProjectFinance.isContractor
        $vm.formInfo.data.projectId = response.data.artsProjectFinance.projectId
        $vm.formInfo.data.commerceDay = response.data.artsProjectFinance.commerceDay
        // $vm.formInfo.data.chargeUserId = [response.data.chargeUserId]
        $vm.open = true;
      }
    });
  };
  /** 节点删除事件 */
  const handleTreeDelete = (data,v,p)=> {
    console.log(data)
    $vm.$modal.confirm('是否确认删除"' + data.orderName + '"的订单？').then(function () {
      return orderDelDetail(data.orderId);
    }).then(() => {
      $vm.getOrderList();
  
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  };
  /** 任务多选框选中数据 */
  function handleSelectionChangeTask(selection) {
    taskIds.value = selection.map(item => item.id);
  }
  /** 成员多选框选中数据 */
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id);
  }
  /** sort排序 */
  function handleSortChange({ column, prop, order }) {
    console.log(column, prop, order)
    queryParams.value.orderByColumn = prop
    if(order == 'descending'){
      queryParams.value.isAsc = 'desc'
    }else if(order == 'ascending'){
      queryParams.value.isAsc = 'asc'
    }else{
      queryParams.value.isAsc = undefined
    }
    getList(oId.value,prop,queryParams.value.isAsc)
  }
  /** 新建订单 */
  const handleAddOrder = (data,v,p)=> {
    $vm.open = true;
  };
  /** 新增成员 */
  const handleAddMember = (id)=> {
    $vm.taskId = id;
    $vm.addMemberOpen = true;
  };
  /** 删除任务 */
  const handleDelAll = ()=> {
    const taskIdAll = taskIds.value;
    $vm.$modal.confirm('是否确认删除任务').then(function () {
      return delAssignment(taskIdAll);
    }).then(() => {
      getList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  };
  /** 导入任务 */
  // const handleImport = ()=> {
  //   const taskIdAll = taskIds.value;
  //   $vm.$modal.confirm('是否确认删除任务').then(function () {
  //     return importAssignment(taskIdAll);
  //   }).then(() => {
  //     getList();
  //     $vm.$modal.msgSuccess("删除成功");
  //   }).catch(() => {});
  // };
  /** 删除成员 */
  const handleDelMember = ()=> {
    const roleIds = ids.value;
    $vm.$modal.confirm('是否确认删除成员').then(function () {
      return delMember(roleIds);
    }).then(() => {
      getList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  };
  /** 修改成员 */
  const handleChange = (row)=> {
    row.stageList = row.stageName.split(',')
    addOrUpMember(row).then(response => {
      $vm.$modal.msgSuccess("操作成功");
    })
  };
  /** 修改成员截图 */
  const handleChange1 = (scope)=> {
    // console.log(scope)
    tableData.value.map((item,index)=>{
      if(item.id == scope.row.assignmentsId){
        taskIndex.value = index;
        memberIndex.value = scope.$index;
      }
    })
    // row.stageList = row.stageName.split(',')
    // addOrUpMember(row).then(response => {
    //   $vm.$modal.msgSuccess("操作成功");
    // })
  };
  /** 文件上传成功处理 */
  const handleFileSuccess1 = (response, file, fileList) => {
    tableData.value[taskIndex.value].developOrderMembers[memberIndex.value].thumbnail = response.url
    $vm.upload.open = false;
    $vm.upload.isUploading = false;
    $vm.$refs["uploadRef"].handleRemove(file);

    tableData.value[taskIndex.value].developOrderMembers[memberIndex.value].stageList = tableData.value[taskIndex.value].developOrderMembers[memberIndex.value].stageName.split(',')
    addOrUpMember(tableData.value[taskIndex.value].developOrderMembers[memberIndex.value]).then(response => {
      $vm.$modal.msgSuccess("操作成功");
    })
  };
  /** 任务修改 */
  const handleUpdate = (row) => {
    // console.log(row)
    taskDetail(row.id).then(response => {
      $vm.formInfoTask.data = response.data;
      // $vm.formInfoTask.data.exceedingExpectations = response.data.exceedingExpectations + '';
      if(response.data.artsProjectFlowPathName == null){
        $vm.formInfoTask.data.artsProjectFlowPathName = []
       }else{
        $vm.formInfoTask.data.artsProjectFlowPathName = response.data.artsProjectFlowPathName.split(',')
       }
      $vm.taskOpen = true;
    });
  }
  /** 删除 */
  const handleDelete = (row) => {
    console.log(row)
  }
  /** 删除成员截图 */
  const handleDeleteUserImg = (scope) => {
    // console.log(scope)
    scope.row.thumbnail = ''
    tableData.value.map((item,index)=>{
      if(item.id == scope.row.assignmentsId){
        taskIndex.value = index;
        memberIndex.value = scope.$index;
      }
    })
    tableData.value[taskIndex.value].developOrderMembers[memberIndex.value].stageList = tableData.value[taskIndex.value].developOrderMembers[memberIndex.value].stageName.split(',')
    addOrUpMember(tableData.value[taskIndex.value].developOrderMembers[memberIndex.value]).then(response => {
      $vm.$modal.msgSuccess("操作成功");
    })
  }
  /** 展开表格 */
  const expandChange = (row,expandedRows) => {
    // console.log(row,expandedRows)
  }
  /** 自定义class */
  const cellClassName = ({ row, column, rowIndex, columnIndex }) => {
    // console.log(row,column,rowIndex,columnIndex)
    if(columnIndex == 8){
      return 'fileUploads'
    }
  }
  function getDaysInCurrentMonth(year,month) {
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth() + 1; // 月份从0开始，所以要加1
    const days = new Date(year, month, 0).getDate();
    return days;
  }
  /** 时间查询 */
  function handleChangeTime(val) {
    val[1] = val[1].slice(0,-2) + getDaysInCurrentMonth(val[1].slice(0,4),val[1].slice(5,7))
    queryParams.value.plannedStartTime = val[0];
    queryParams.value.plannedEndTime = val[1];
  };
  /** 搜索按钮操作 */
  const handleQuery = () => {
    $vm.queryParams.pageNum = 1;
    getList(oId.value);
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    $vm.resetForm("queryRef");
    handleQuery();
  }

  onMounted(() => {
    setTimeout(() => {
      getList(oId.value)
      getCount()
    }, 400);
  });


  return {
    tableData,
    taskTableData,
    total,
    oId,
    orderName,
    parentName,
    showSearch,
    loading,
    queryParams,
    totalObj,
    ids,
    date,
    taskIds,
    orderId,
    getList,
    filterNode,
    handleNodeClick,
    handleUpdate,
    handleDelete,
    handleTreeUpdate,
    handleTreeDelete,
    handleAddOrder,
    handleAddMember,
    handleChange,
    handleChange1,
    cellClassName,
    expandChange,
    handleFileSuccess1,
    handleSelectionChangeTask,
    handleSelectionChange,
    handleSortChange,
    handleDelAll,
    handleDelMember,
    handleDeleteUserImg,
    handleChangeTime,
    handleQuery,
    resetQuery,
  };
}
