/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-01-22 13:51:50
 */
import { onMounted, reactive, ref,nextTick } from "vue";
import { useRouter } from "vue-router";
import { getPage,getAdd,deptList,getDelete,getDetail } from "@/api/task/projectSpecification";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const num1 = ref(0);
  const num2 = ref(0);
  const type = ref('add');
  const oldProjectRate = ref('');
  const oldTimeConsuming = ref('');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    standardName: '',
    deptId: '',
    month: [],
    beginTime: '',
    endTime: '',
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    getPage(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
   /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    queryParams.value.month = [];
    queryParams.value.beginTime = '';
    queryParams.value.endTime = '';
    $vm.resetForm("queryRef");
    handleQuery();
  }
  // 新增
  function handleAddOpen() {
    type.value = 'add'
    $vm.dialogInfo.btnList[0].show = true
    $vm.dialogInfo.btnList[1].show = true
    $vm.valueHtml = '<p></p>';
    $vm.dialogInfo.visible = true;
    nextTick(()=>{
      $vm.editorRef.enable()
    })
  }
  /** 编辑 */
  const handleEdit = (row) => {
    type.value = 'edit'
    $vm.dialogInfo.btnList[0].show = true
    $vm.dialogInfo.btnList[1].show = true
    getDetail(row.id).then(response => {
      if(response.code == 200){
        console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.valueHtml = '<p>' + response.data.standardContent + '</p>'
        if(response.data.standardFile){
          $vm.fileLists = JSON.parse(response.data.standardFile)
        }
        $vm.dialogInfo.visible = true;
        nextTick(()=>{
          $vm.editorRef.enable()
        })
      }
    });
    
  }
  /** 查看 */
  const handleView = (row) => {
    type.value = 'view'
    $vm.dialogInfo.btnList[0].show = false
    $vm.dialogInfo.btnList[1].show = false
    getDetail(row.id).then(response => {
      if(response.code == 200){
        $vm.formInfo.data = response.data
        $vm.valueHtml = '<p>' + response.data.standardContent + '</p>'
        if(response.data.standardFile){
          $vm.fileLists = JSON.parse(response.data.standardFile)
        }
        $vm.dialogInfo.visible = true;
        nextTick(()=>{
          $vm.editorRef.disable()
        })
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
  //部门下拉选择
  const handleChangeDept1 = (value) => {
    console.log(value)
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
    console.log(queryParams.value)
  };
  onMounted(() => {
    getList()
  });


  return {
    tableData,
    total,
    num1,
    num2,
    type,
    loading,
    showSearch,
    queryParams,
    oldProjectRate,
    oldTimeConsuming,
    getList,
    handleEdit,
    handleView,
    handleDelete,
    handleQuery,
    resetQuery,
    handleAddOpen,
    handleChangeDept1,
    handleChangeTime
  };
}
