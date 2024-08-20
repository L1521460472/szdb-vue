/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-25 11:10:07
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listInfo,infoOperate,delOperate } from "@/api/task/mytodo";

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

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const tableDataList = ref([]);
  /** 查询我的待办列表 */
  const getList = () => {
    loading.value = true;
    queryParams.value.type = 1;
    listInfo(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询我发起的列表 */
  const getDataList = () => {
    loading.value = true;
    queryParams.value.type = 2;
    listInfo(queryParams.value).then(response => {
      tableDataList.value = response.rows;
      totalValue.value = response.total;
      loading.value = false;
    });
  }
  /** 事项跳转 */
  const handleToDoOpen = (row) => {
    // console.log(row)
    if(row.type == 1){
      router.push({ path: "/personnel/skill", query: { detailId :row.prepareId } });
    }else{
      router.push({ path: "/arts/project", query: { id :row.prepareId } });
    }
  }
  /** 完成待办 */
  const handleToDo = (row) => {
    const params = {
      id: row.id,
      type: 1,
    }
    infoOperate(params).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("操作成功");
      }
    });
  }
  /** 撤回 */
  const handleRecall = (row) => {
    // console.log(row)
    const params = {
      id: row.id,
      type: 2,
    }
    infoOperate(params).then(response => {
      if(response.code == 200){
        getDataList()
        $vm.$modal.msgSuccess("操作成功");
      }
    });
  }
  /** 删除我的待办 */
  const handleDelete = (row) => {
    delOperate(row.id).then(response => {
      if(response.code == 200){
        getList()
        $vm.$modal.msgSuccess("删除成功");
      }
    });
  }
  /** 删除我发起的 */
  const handleDeleteTow = (row) => {
    delOperate(row.id).then(response => {
      if(response.code == 200){
        getDataList()
        $vm.$modal.msgSuccess("删除成功");
      }
    });
  }

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
    getList,
    getDataList,
    handleToDoOpen,
    handleToDo,
    handleRecall,
    handleDelete,
    handleDeleteTow
  };
}
