/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-15 18:15:14
 */
import { onMounted,onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getPage,deptList,getDelete,getDetail } from "@/api/personnel/attendanceReport";
import { formatDate } from "@/utils/index";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(false);
  const showSearch = ref(true);
  const columnList = ref([])
  const total = ref(0);
  const userName = ref(null)
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    userId: undefined,
    workDate: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList =  () => {
    loading.value = true;
    getPage(queryParams.value).then(async(response) => {
      tableData.value = response.data;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 跳转 */
  const handleToDoOpen = (row) => {
    console.log(row)
  }
  /** 详情 */
  const handleView = (row) => {
    // console.log(row)
    queryParams.value.userId = row['1004']
    userName.value = row['1001']
    $vm.getDetailList()
    $vm.visible = true
  }
  /** 发送确认 */
  const handlePromotion = (row) => {
    console.log(row)
  }
  onBeforeMount(() => {
    // getList()
  }),

  onMounted(() => {
    queryParams.value.workDate = formatDate(new Date()).substring(0,10)
  });


  return {
    tableData,
    total,
    showSearch,
    loading,
    queryParams,
    columnList,
    userName,
    getList,
    handleToDoOpen,
    handleView,
    handlePromotion,
  };
}
