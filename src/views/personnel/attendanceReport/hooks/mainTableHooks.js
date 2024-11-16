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
import { getPage,deptList,getDelete,getDetail,getImport } from "@/api/personnel/attendanceReport";
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
    name: undefined,
    deptId: undefined,
    attendanceStatus: undefined,
    attendanceMonth: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList =  () => {
    loading.value = true;
    getPage(queryParams.value).then(async(response) => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }

  /** 导入按钮操作 */
  function handleImport() {
    $vm.upload.title = "人事-考勤报表导入";
    $vm.upload.open = true;
  };

  /** 跳转 */
  const handleAdd = () => {
    console.log(111)
  }
  /** 编辑 */
  const handleEdit = (row) => {
    // type.value = 'edit'
    getDetail(row.id).then(response => {
      if(response.code == 200){
        console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.formInfo.data.attendanceStatus = response.data.attendanceStatus + ''
        $vm.visible = true;
      }
    });
  }
  /** 删除 */
  const handleDelete = (row) => {
    $vm.$modal.confirm('是否确认删除').then(function () {
      return getDelete(row.id);
    }).then(() => {
      getList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  /** 一键推送 */
  const handlePush = () => {
    console.log('一键推送')
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
    handleAdd,
    handleEdit,
    handleDelete,
    handlePush,
    handlePromotion,
    handleImport,
  };
}
