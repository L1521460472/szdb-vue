/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-05-27 17:02:30
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
// import { attendanceDetailList } from "@/api/personnel/attendance";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const columnList = ref([])
  const total = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    deptId: undefined,
    producerId: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    // attendanceDetailList(queryParams.value).then(response => {
    //   tableData.value = response.rows;
    //   // if(response.rows.length > 0){
    //   //   columnList.value = response.rows[0].achievementList.map((item)=>{
    //   //     item.label = item.time
    //   //     return item
    //   //   })
    //   //  }
    //   total.value = response.total;
    //   loading.value = false;
    // });
  }
  /** 跳转 */
  const handleToDoOpen = (row) => {
    console.log(row)
  }
  /** 删除 */
  const handleDelete = (row) => {
    console.log(row)
  }

  onMounted(() => {
    // getList()
  });


  return {
    tableData,
    total,
    showSearch,
    loading,
    queryParams,
    columnList,
    getList,
    handleToDoOpen,
    handleDelete,
  };
}
