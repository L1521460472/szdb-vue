/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-17 10:23:09
 */
import { onMounted, reactive, ref,nextTick } from "vue";
import { useRouter } from "vue-router";
import { getPage,getAdd,getUserAssignment,getDelete,getDetail } from "@/api/develop/daily";

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
    assignmentName: ''
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
  /** 获取该用户的任务及阶段 */
  function getDeptTreeList() {
    getUserAssignment().then(response => {
      $vm.departmentOptions = response.data;
  });
  };
   /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }
  /** 重置按钮操作 */
  function resetQuery() {
    $vm.resetForm("queryRef");
    handleQuery();
  }
  // 新增
  function handleAddOpen() {
    type.value = 'add'
    $vm.valueHtml = ''
    $vm.dialogInfo.btnList[0].show = true
    $vm.dialogInfo.btnList[1].show = true
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
        $vm.valueHtml = '<p>' + response.data.explanatory + '</p>'
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
        console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.valueHtml = '<p>' + response.data.explanatory + '</p>'
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


  onMounted(() => {
    getList()
    getDeptTreeList()
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
    handleView,
    handleEdit,
    handleDelete,
    handleQuery,
    resetQuery,
    handleAddOpen
  };
}
