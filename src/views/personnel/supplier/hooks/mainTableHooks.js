/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-05 18:22:26
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getPage,deptList,getDelete,getDetail } from "@/api/personnel/supplier";
import { getUser, } from "@/api/system/user";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const atWork = ref(0);
  const resign = ref(0);
  const resignationRate = ref(0);
  const type = ref('add');
  const oldProjectRate = ref('');
  const oldTimeConsuming = ref('');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    supplierName: '',
    locationCity: '',
    supplierLevel: '',
    supplierScale: '',
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const postOptions = ref([]);
  const roleOptions = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    getPage(queryParams.value).then(response => {
      // tableData.value = [{}];
      // total.value = 1;
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询部门树 */
  function getDeptTreeList() {
    deptList().then(response => {
      $vm.departmentOptions = response.data;
    }); 
  };
  /** 查询user */
  function getUserData() {
    getUser().then(response => {
      postOptions.value = response.posts;
      roleOptions.value = response.roles;
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
    $vm.dialogInfo.btnList[0].disabled = false
    $vm.dialogInfo.visible = true;
  }
  /** 编辑 */
  const handleEdit = (row) => {
    type.value = 'edit'
    $vm.dialogInfo.btnList[0].disabled = false
    getDetail(row.id).then(response => {
      if(response.code == 200){
        // console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.formInfo.data.scopeBusiness = response.data.scopeBusiness.split(',')
        $vm.imageUrl1 = response.data.supplierLogo
        // $vm.imageUrl2 = response.data.supplierBusinessLicense
        $vm.imageUrl2 = JSON.parse(response.data.supplierBusinessLicense)
        $vm.imageUrl3 = JSON.parse(response.data.supplierQualificationCertificate)
        $vm.dialogInfo.visible = true;
      }
    });
  }
  /** 查看 */
  const handleView = (row) => {
    type.value = 'view'
    $vm.dialogInfo.btnList[0].disabled = true
    getDetail(row.id).then(response => {
      if(response.code == 200){
        // console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.formInfo.data.scopeBusiness = response.data.scopeBusiness.split(',')
        $vm.imageUrl1 = response.data.supplierLogo
        // $vm.imageUrl2 = response.data.supplierBusinessLicense
        $vm.imageUrl2 = JSON.parse(response.data.supplierBusinessLicense)
        $vm.imageUrl3 = JSON.parse(response.data.supplierQualificationCertificate)
        $vm.dialogInfo.visible = true;
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
    getUserData()
  });


  return {
    tableData,
    total,
    atWork,
    resign,
    resignationRate,
    type,
    loading,
    showSearch,
    queryParams,
    oldProjectRate,
    oldTimeConsuming,
    postOptions,
    roleOptions,
    getList,
    handleEdit,
    handleView,
    handleDelete,
    handleQuery,
    resetQuery,
    handleAddOpen
  };
}
