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
import { expenditureList,delExpenditure } from "@/api/money/expenditureManagement";
import { getToken } from "@/utils/auth";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const total = ref(0);
  const totalValue = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
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

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const tableDataList = ref([]);
  /** 查询团队支出列表 */
  const getList = () => {
    loading.value = true;
    queryParams.value.type = 1;
    expenditureList(1,queryParams.value.pageNum,queryParams.value.pageSize).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询基础费用列表 */
  const getDataList = () => {
    loading.value = true;
    queryParams.value.type = 2;
    expenditureList(2,queryParams.value.pageNum,queryParams.value.pageSize).then(response => {
      tableDataList.value = response.rows;
      totalValue.value = response.total;
      loading.value = false;
    });
  }
  /** 删除数据 */
  const handleDelete = (row) => {
    delExpenditure(row.id).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("删除成功");
      }
    });
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

  onMounted(() => {
    getList()
  });


  return {
    tableData,
    tableDataList,
    total,
    totalValue,
    loading,
    queryParams,
    form,
    rules,
    upload,
    getList,
    getDataList,
    handleImport,
    handleFileUploadProgress,
    handleFileSuccess,
    submitFileForm,
    importTemplate,
    handleDelete
  };
}
