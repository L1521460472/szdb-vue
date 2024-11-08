/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-08 17:58:48
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listApprove,getProcessingDays } from "@/api/task/pendingApproval";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const num1 = ref(0);
  const num2 = ref(0);
  const type = ref('add');
  const oldProjectRate = ref('');
  const oldTimeConsuming = ref('');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    projectId: undefined,
    projectName: undefined,
    producerId: undefined,
    approveStatus: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    listApprove(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
   /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    $vm.resetForm("queryRef");
    handleQuery();
  }
  // 新增
  function handleAddOpen() {
    $vm.dialogInfo.visible = true;
  }
  /** 审核 */
  const handleApproval = (row) => {
    getProcessingDays(row.projectId).then(response => {
      num1.value = response.data.commerceDay
      num2.value = response.data.remainingDay
    });
    oldProjectRate.value = row.projectRate
    oldTimeConsuming.value = row.timeConsuming
    $vm.formInfo.data.id = row.id;
    $vm.formInfo.data.producerName = row.producerName;
    $vm.formInfo.data.artsProjectRateAddListRequestList = [
      {
        projectId:Number(row.projectId),
        projectName:row.projectName,
        projectStage:row.projectStage,
        projectRate:row.projectRate,
        time:row.timeConsuming,
        remarks:row.remarks,
        rateFile:row.rateFile,
      }
    ]
    $vm.dialogInfo.visible = true;
  }


  onMounted(() => {
    getList()
  });


  return {
    tableData,
    total,
    num1,
    num2,
    type,
    loading,
    showSearch,
    queryParams,
    oldProjectRate,
    oldTimeConsuming,
    getList,
    handleApproval,
    handleQuery,
    resetQuery,
    handleAddOpen
  };
}
