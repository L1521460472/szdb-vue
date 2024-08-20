/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-25 16:28:38
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listTemplate,delTemplate } from "@/api/project/projectTemplate";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const dateRange = ref([]);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    categoryId: undefined,
    productionDepartmentId: undefined
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    listTemplate(queryParams.value).then(response => {
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
    delTemplate(row.id).then(response => {
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
