/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-24 10:30:47
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listTask, operate, getTask,delTask } from "@/api/task/mytask";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const type = ref('add');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    projectId: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    listTask(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 提交 */
  const handleSubmit = (row) => {
    operate({id:row.id,type:1}).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("提交成功");
      }
    });
  }
  /** 撤回 */
  const handleRecall = (row) => {
    operate({id:row.id,type:2}).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("撤回成功");
      }
    });
  }

  /** 修改 */
  const handleEdit = (row) => {
    // console.log(row)
    type.value = 'edit';
    $vm.dialogInfo.btnList[0].show = true;
    $vm.dialogInfo.btnList[1].show = true;
    $vm.formInfo.disabled = false;
    $vm.formInfo.data.id = row.id;
    $vm.formInfo.data.artsProjectRateAddListRequestList = [
      {
        projectId:Number(row.projectId),
        projectStage:row.projectStage,
        projectRate:row.projectRate,
        time:row.timeConsuming,
        remarks:row.remarks,
        rateFile:row.rateFile,
      }
    ]
    $vm.dialogInfo.width = '40%';
    $vm.dialogInfo.title = "修改任务";
    $vm.dialogInfo.visible = true;
  }
  /** 查看 */
  const handleView = (row) => {
    type.value = 'view';
    $vm.dialogInfo.btnList[0].show = false;
    $vm.dialogInfo.btnList[1].show = false;
    $vm.formInfo.disabled = true;
    getTask(row.id).then(response => {
      if(response.code == 200){
        $vm.formInfo.data.artsProjectRateAddListRequestList = [
          {
            projectId:response.data.projectId,
            projectStage:response.data.projectStage,
            projectRate:response.data.projectRate,
            time:response.data.timeConsuming,
            remarks:response.data.remarks,
            rateFile:response.data.rateFile,
            makeTime: Number(response.data.makeTime)
          }
        ]
        $vm.formInfo.data.approveRecordVo = {
          ...response.data.approveRecordVo,
        }
        $vm.dialogInfo.width = '40%';
        $vm.dialogInfo.title = "任务详情";
        $vm.dialogInfo.visible = true;
      }
    });
    // console.log(row)
  }
  /** 删除 */
  const handleDelete = (row) => {
    delTask(row.id).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("删除成功");
      }
    });
  }


  onMounted(() => {
    getList()
  });


  return {
    tableData,
    total,
    type,
    loading,
    showSearch,
    queryParams,
    getList,
    handleSubmit,
    handleRecall,
    handleEdit,
    handleView,
    handleDelete
  };
}
