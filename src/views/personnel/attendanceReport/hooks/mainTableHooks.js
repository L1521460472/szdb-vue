/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-03 18:10:17
 */
import { onMounted,onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { attendanceList } from "@/api/personnel/attendance";
import { formatDate } from "@/utils/index";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
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
    attendanceList(queryParams.value).then(async(response) => {
      columnList.value =await response.attendanceGetAttColumns.map((item,index)=>{
        // item.list = []
        // // item.expression_id = item.id
        // response.columnsValue.map((items,idx)=>{
        //   Object.keys(items).forEach((key,indexs) => {
        //     item.list.push(items[key])
        //     console.log(item.value,items[key])
        //     // if(item.id == key){
        //     //   console.log(item.id,key)
        //     //   item.value = items[key]
        //     // }else{
        //     //   item.value = ''
        //     // }
        //   }) 
        // })
        return item
      });
      // console.log(response.attendanceGetAttColumns)
      tableData.value = response.columnsValue;
      // if(response.rows.length > 0){
      //   columnList.value = response.rows[0].achievementList.map((item)=>{
      //     item.label = item.time
      //     return item
      //   })
      //  }
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
    getList()
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
