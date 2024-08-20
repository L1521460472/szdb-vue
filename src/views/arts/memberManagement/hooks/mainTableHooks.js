/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-12 16:58:51
 */
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { cloneDeep } from 'lodash-es';
import { listHeadquarters, listExternal } from "@/api/project/memberManagement";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const total = ref(0);
  const totalValue = ref(0);
  const deptName = ref('');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 200,
    deptId: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  const tableDataList = ref([]);
  /** 查询本部成员列表 */
  const getList = () => {
    loading.value = true;
    listHeadquarters(queryParams.value).then(response => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询外部成员列表 */
  const getDataList = () => {
    loading.value = true;
    listExternal(queryParams.value).then(response => {
      tableDataList.value = response.rows;
      totalValue.value = response.total;
      loading.value = false;
    });
  }
  /** 事项跳转 */
  const handleToDoOpen = (row) => {
    // console.log('user/profile')
    router.push({ path: "/user/profile", query: { detailId :row.userId } });
  }
  /** 编辑 */
  const handleEdit = (row) => {
    // console.log(row)
    $vm.formInfo.data = cloneDeep(row);
    $vm.formInfo.disabled = false;
    $vm.dialogInfo1.visible = true;
  }
  /** 详情 */
  const handleView = (row) => {
    // console.log(row)
    $vm.formInfo.data = cloneDeep(row);
    $vm.formInfo.disabled = true;
    $vm.dialogInfo1.visible = true;

  }
  /** 节点单击事件 */
  const handleNodeClick1 = (data) => {
    queryParams.value.deptId = data.id;
    getList();
  };
  /** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  $vm.$refs["deptTreeRef"].filter(val);
});

  onMounted(() => {
    // getList()
    getDataList()
  });


  return {
    tableData,
    tableDataList,
    total,
    totalValue,
    deptName,
    loading,
    queryParams,
    getList,
    getDataList,
    handleToDoOpen,
    handleEdit,
    handleView,
    handleNodeClick1,
    filterNode,
  };
}
