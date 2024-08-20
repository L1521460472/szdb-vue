/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-08-06 10:50:49
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { performanceList } from "@/api/develop/monthPerformance";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    userId: undefined,
    beginTime: undefined,
    endTime: undefined,
    projectId: undefined,
    deptId: undefined,
    month: [],
  })
  const queryProps = {
    value: 'id',
    // expandTrigger: 'hover',
    checkStrictly : true
  }

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const expands = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    performanceList(queryParams.value).then(response => {
      tableData.value = response.rows
      ?.map((item,index)=>{
        item.id = index
        item.isExpandeds = false
        return item
      });
      total.value = response.total;
      loading.value = false;
    });
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
  /** 跳转 */
  const handleToDoOpen = (row) => {
    console.log(row)
  }
  /** 删除 */
  const handleDelete = (row) => {
    console.log(row)
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
  /** 合计 */
  const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
      // if (index === 0) {
      //   sums[index] = '合计'
      //   return
      // }
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value)) && column.property =='invoiceAmount') {
        sums[index] = `合计： ${values.reduce((prev, curr) => {
          const value = Number(curr)  
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
            
          }  
        }, 0)}`
      } else {
        sums[index] = ''
      }
    })
    return sums
  }
  //部门下拉选择
  const handleChangeDept = (value) => {
  //   console.log(value)
    queryParams.value.deptId = value.slice(-1)[0]
  } 

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
    expands,
    total, 
    showSearch,
    loading,
    queryParams, 
    queryProps,
    getList,
    handleToDoOpen,
    handleDelete,
    getSummaries,
    handleChangeTime,
    handleChangeDept,
    expandChange
  };
}
