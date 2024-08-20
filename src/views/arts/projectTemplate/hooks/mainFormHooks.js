/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-08-18 14:56:21
 */
import {reactive, onBeforeMount, watch, ref} from "vue";
import { listCategory,listCategoryDetail,delProjectCategory,editProjectCategory } from "@/api//project/project";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "启用", value: true },
      { key: "停用", value: false },
    ],
    dateList: [
      { key: "近一周", value: '1' },
      { key: "近一个月", value: '2' },
      { key: "近三个月", value: '3' },
      { key: "近半年", value: '4' },
      { key: "全年", value: '5' },
      { key: "指定日期", value: '6' },
    ],
    deptList:[],
    categoryList:[]
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });
  const openDeptOptionsUp = ref(false);
  const deptOptionsParams = ref(undefined);

  const deptName = ref("");
  /** 通过条件过滤节点  */
  const filterNode = (value, data) => {
    console.log(value,data)
    if (!value) return true;
    return data.categoryName.indexOf(value) !== -1;
  };
  /** 节点单击事件 */
  const handleNodeClick = (data,v,p)=> {
    $vm.queryParams.productionDepartmentId = null
    if(data.children === null){
      $vm.queryParams.productionDepartmentId = data.id
      $vm.queryParams.categoryId = data.parentId
    }else{
      $vm.queryParams.categoryId = data.id;
    }
    deptOptionsParams.value = data;
    $vm.handleQuery();
  };
  /** 项目层级修改 */
  function deptOptionsUp(row) {
    deptOptionsParams.value = JSON.parse(JSON.stringify(row));
    if(row.category === 3){
      $vm.$modal.msgError("第三级只能进入项目内修改");
      return
    }
    openDeptOptionsUp.value = true;
  };
  /** 项目层级修改 */
  function submitDeptOptionsUp() {
    const params = {
      id: deptOptionsParams.value.id,
      categoryName: deptOptionsParams.value.categoryName
    }
    editProjectCategory(params).then(response => {
      $vm.$modal.msgSuccess("修改成功");
      getDeptTree();
      openDeptOptionsUp.value = false;
    });

  };

  /** 项目层级删除 */
  function deptOptionsDe(row) {
    if (row.category === 3) {
      $vm.$modal.msgError("层级下存在项目 不允许删除");
      return
    }
    $vm.$modal.confirm('是否确认删除项目层级为"' + row.categoryName + '"的数据项？').then(function () {
      return delProjectCategory(row.id);
    }).then(() => {
      getDeptTree();

      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  };

  /** 查询项目下拉树结构 */
  const getDeptTree = ()=> {
    listCategory().then(response => {
      listTypeInfo.deptList = response.rows;
    });
  };
   /** 查询企业 */
  const getCategoryDetail = ()=> {
    listCategoryDetail(0).then(response => {
      listTypeInfo.categoryList = response.data;
    });
  };

  /** 根据名称筛选部门树 */
  watch(deptName, val => {
    $vm.$refs["deptTreeRef"].filter(val);
  });

  onBeforeMount(()=>{
    getDeptTree()
    getCategoryDetail()
  })

  return {
    topFormInfo,
    listTypeInfo,
    deptName,
    openDeptOptionsUp,
    deptOptionsParams,
    filterNode,
    handleNodeClick,
    deptOptionsUp,
    submitDeptOptionsUp,
    deptOptionsDe,
  };
}
