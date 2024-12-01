/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-16 12:11:16
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { expenditureList,delExpenditure,getPage,getDelete,getDetail } from "@/api/money/expenditureManagement";
import { getToken } from "@/utils/auth";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const total = ref(0);
  const showSearch = ref(true);
  const type = ref('add');
  const taskIds = ref([]);
  const totalValue = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    name: '',
    department: '',
    wagesTime: '',
    type: 1,//1 我的代办  2 我发起的
  })
  const form = ref({
    date: null
  });
  const rules= reactive({
    date: [{ required: true, message: "日期不能为空", trigger: "blur" }],
  })
  /*** 用户导入参数 */
  const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "导入数据",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 支出类型 1.团队支出 2.基础费用
    type: 1,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + "/finance/expenditure/import"
  });

  /*** 工资导入参数 */
  const upload1 = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "导入数据",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 支出类型 1.团队支出 2.基础费用
    type: 1,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + "/finance/cost/import"
  });

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const tableDataList = ref([]);
  /** 查询基础费用列表 */
  const getList = () => {
    loading.value = true;
    queryParams.value.type = 1;
    expenditureList(1,queryParams.value.pageNum,queryParams.value.pageSize).then(response => {
      tableData.value = response.rows;
      totalValue.value = response.total;
      loading.value = false;
    });
  }
  /** 查询工资数据列表 */
  const getDataList = () => {
    loading.value = true;
    getPage(queryParams.value.name,queryParams.value.department,queryParams.value.wagesTime).then(response => {
      tableDataList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 删除数据 */
  // const handleDelete = (row) => {
  //   delExpenditure(row.id).then(response => {
  //     if(response.code == 200){
  //       getList()
  //       $vm.$modal.msgSuccess("删除成功");
  //     }
  //   });
  // }
  /** 一键推送 */
  const handlePush = () => {
    console.log('handlePush')
  }
  /** 导入数据 */
  const handleImport = () => {
    upload.open = true;
  }
  /** 下载模板操作 */
  function importTemplate() {
    $vm.download("finance/expenditure/importExpenditureTemplate", {
    }, `finance_template_${new Date().getTime()}.xlsx`);
  };
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
    upload.open = false;
    upload.isUploading = false;
    $vm.$refs["uploadRef"].handleRemove(file);
    $vm.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
    getList();
  };
  /** 提交上传文件 */
  const submitFileForm = ()=> {
    $vm.$refs["userRef"].validate(valid => {
      if (valid) {
        console.log(form.value.date)
        $vm.$refs["uploadRef"].submit();
      }
    });
  };

  /** 导入数据 */
  const handleImport1 = () => {
    upload1.open = true;
  }
  /** 下载模板操作 */
  function importTemplate1() {
    $vm.download("/finance/cost/importTemplate", {
    }, `finance_template_${new Date().getTime()}.xlsx`);
  };
  /**文件上传中处理 */
  const handleFileUploadProgress1 = (event, file, fileList) => {
    upload1.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess1 = (response, file, fileList) => {
    upload1.open = false;
    upload1.isUploading = false;
    $vm.$refs["reportRef"].handleRemove(file);
    $vm.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
    getList();
  };
  /** 提交上传文件 */
  const submitFileForm1 = ()=> {
    $vm.$refs["uploadRef1"].submit();
    // $vm.$refs["userRef"].validate(valid => {
    //   if (valid) {
    //     console.log(form.value.date)
    //   }
    // });
  };

   /** 搜索按钮操作 */
   function handleQuery() {
    queryParams.value.pageNum = 1;
    getDataList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    $vm.resetForm("queryRef");
    handleQuery();
  }
  // 新增
  function handleAdd() {
    console.log(11111,$vm.dialogInfo.visible)
    type.value = 'add'
    $vm.dialogInfo.visible = true;
  }
  /** 编辑 */
  const handleEdit = (row) => {
    console.log(row)
    type.value = 'edit'
    getDetail(row.id).then(response => {
      if(response.code == 200){
        console.log(response.data)
        $vm.formInfo.data = response.data
        // $vm.valueHtml = response.data.explanatory
        $vm.dialogInfo.visible = true;
      }
    });
    
  }
   //部门下拉选择
   const handleChangeDept1 = (value) => {
    console.log(value)
    queryParams.value.department = value.slice(-1)[0]
  } 
  /** 多选框选中数据 */
  function handleSelectionChange(selection) {
    taskIds.value = selection.map(item => item.id);
  }
  /** 批量删除 */
  const handleDelAll = ()=> {
    const taskIdAll = taskIds.value;
    $vm.$modal.confirm('是否确认删除选择数据').then(function () {
      return getDelete(taskIdAll);
    }).then(() => {
      getDataList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  };
  /** 删除 */
  const handleDelete = (row) => {
    $vm.$modal.confirm('是否确认删除').then(function () {
      return getDelete(row.id);
    }).then(() => {
      getDataList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  onMounted(() => {
    getList()
  });


  return {
    showSearch,
    type,
    tableData,
    tableDataList,
    total,
    totalValue,
    loading,
    queryParams,
    form,
    rules,
    upload,
    upload1,
    getList,
    getDataList,
    handleImport,
    handleFileUploadProgress,
    handleFileSuccess,
    submitFileForm,
    importTemplate,
    handleImport1,
    handleFileUploadProgress1,
    handleFileSuccess1,
    submitFileForm1,
    importTemplate1,
    handleDelAll,
    handleDelete,
    handleQuery,
    resetQuery,
    handleAdd,
    handleEdit,
    handleSelectionChange,
    handlePush,
    handleChangeDept1
  };
}
