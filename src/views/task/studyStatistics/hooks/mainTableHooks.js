/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-06 20:20:07
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listAchievements } from "@/api/project/monthlyPerformance";

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
    listAchievements(queryParams.value).then(response => {
      tableData.value = response.rows;
      if(response.rows.length > 0){
        columnList.value = response.rows[0].achievementList.map((item)=>{
          item.label = item.time
          return item
        })
       }
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
    console.log(row)
  }
  //部门下拉选择
  const handleChangeDept = (value) => {
  //   console.log(value)
    queryParams.value.deptId = value.slice(-1)[0]
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
    queryParams.value.beginTime = val[0];
    queryParams.value.endTime = val[1];
  };
  // 获取当月的第一天
  function getFirstDayOfMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  // 获取当月的最后一天
  function getLastDayOfMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // 输出年月日
  function outputDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是从0开始的
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  onMounted(() => {
    // 获取当月的第一天
    queryParams.value.beginTime = outputDate(getFirstDayOfMonth());
    // 获取当月的最后一天
    queryParams.value.endTime = outputDate(getLastDayOfMonth());  
    queryParams.value.month = [queryParams.value.beginTime, queryParams.value.endTime];
    getList()
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
    handleChangeDept,
    handleChangeTime,
  };
}
