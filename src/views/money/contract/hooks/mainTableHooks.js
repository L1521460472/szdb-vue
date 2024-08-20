/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-15 16:11:39
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { contractList,deleteContract } from "@/api/money/contract";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    id: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    contractList(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 跳转 */
  const handleToDoOpen = (row) => {
    console.log(row)
  }
  /** 删除 */
  const handleDelete = (row) => {
    // console.log(row)
    deleteContract(row.id).then(response => {
      if(response.code == 200){
        $vm.$modal.msgSuccess("删除成功");
        getList()
      }
    });
  }

  onMounted(() => {
    getList()
  });


  return {
    tableData,
    total,
    showSearch,
    loading,
    queryParams,
    getList,
    handleToDoOpen,
    handleDelete,
  };
}
