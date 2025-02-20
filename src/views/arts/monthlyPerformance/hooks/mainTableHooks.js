/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-19 15:48:07
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { listAchievements,listAchievements2 } from "@/api/project/monthlyPerformance";

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
    beginTime: undefined,
    endTime: undefined,
    projectState: undefined,
    projectName: undefined,
    orderByColumn: undefined,
    isAsc: undefined,
  })
  const sortObj = ref({ prop: 'producerDay', order: 'descending' })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const expands = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    listAchievements2(queryParams.value).then(response => {
      tableData.value = response.rows
      ?.map((item,index)=>{
        item.id = index
        item.isExpandeds = false
        return item
      });;
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
  /** 展开 */
  const expandChange = (row, expandedRows) => {
    // console.log(row,expandedRows,'expandChange')
    expands.value = []
    if(expandedRows.length){
      row.isExpandeds = true                      
      expands.value.push(row.id)
    }else{
      row.isExpandeds = false
    }
    
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
  /** 时间查询 */
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

  /** sort排序 */
  function handleSortChange({ column, prop, order }) {
    console.log(column, prop, order)
    // 自定义排序逻辑
    // tableData.value.sort((a, b) => {
    //   if (order === 'ascending') {
    //     console.log(Number(a[prop]), Number(b[prop]))
    //     return Number(a[prop]) > Number(b[prop]) ? 1 : -1;
    //   } else {
    //     return Number(a[prop]) < Number(b[prop]) ? 1 : -1;
    //   }
    // });
    // queryParams.value.orderByColumn = prop
    // if(order == 'descending'){
    //   queryParams.value.isAsc = 'desc'
    // }else if(order == 'ascending'){
    //   queryParams.value.isAsc = 'asc'
    // }else{
    //   queryParams.value.isAsc = undefined
    // }
    // getList()
  }
  function sortDate (a, b) {
    // const dateA = new Date(a.date).getTime();
    // const dateB = new Date(b.date).getTime();
    const dateA = Number(a.producerDay);
    const dateB = Number(b.producerDay);
    return dateA - dateB;
  };
  function sortDate1 (a, b) {
    // const dateA = new Date(a.date).getTime();
    // const dateB = new Date(b.date).getTime();
    const dateA = Number(a.performanceDay);
    const dateB = Number(b.performanceDay);
    return dateA - dateB;
  };
  function sortDate2 (a, b) {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return dateA - dateB;
  };
  function sortDate3 (a, b) {
    const dateA = new Date(a.endTime).getTime();
    const dateB = new Date(b.endTime).getTime();
    return dateA - dateB;
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
    expands,
    columnList,
    sortObj,
    getList,
    handleToDoOpen,
    handleDelete,
    handleChangeDept,
    handleChangeTime,
    expandChange,
    handleSortChange,
    getFirstDayOfMonth,
    getLastDayOfMonth,
    outputDate,
    sortDate,
    sortDate1
  };
}
