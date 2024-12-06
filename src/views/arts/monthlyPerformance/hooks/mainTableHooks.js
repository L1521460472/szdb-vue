/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-03 14:38:24
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
  function handleChangeTime(val) {
    // val[1] = val[1].slice(0,-2) + getDaysInCurrentMonth(val[1].slice(0,4),val[1].slice(5,7))
    queryParams.value.beginTime = val[0];
    queryParams.value.endTime = val[1];
  };

  /** sort排序 */
  function handleSortChange({ column, prop, order }) {
    console.log(column, prop, order)
    queryParams.value.orderByColumn = prop
    if(order == 'descending'){
      queryParams.value.isAsc = 'desc'
    }else if(order == 'ascending'){
      queryParams.value.isAsc = 'asc'
    }else{
      queryParams.value.isAsc = undefined
    }
    getList()
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
    expands,
    columnList,
    getList,
    handleToDoOpen,
    handleDelete,
    handleChangeDept,
    handleChangeTime,
    expandChange,
    handleSortChange
  };
}
