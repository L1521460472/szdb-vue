/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-23 10:34:07
 */
import { reactive, onBeforeMount,watch } from "vue";
import { listCategory,listCategoryDetail } from "@/api//project/project";
import { deptTreeSelect } from "@/api/system/user";

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
    deptList1:[],
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
  const deptName = ref("");
  /** 通过条件过滤节点  */
  const filterNode = (value, data) => {
    console.log(value,data)
    if (!value) return true;
    return data.categoryName.indexOf(value) !== -1;
  };
  /** 节点单击事件 */
  const handleNodeClick = (data,v,p)=> {
    console.log(data)
    if(data.parentId == 0){
      $vm.spanLeft = 16
      $vm.spanRight = 8
    }else{
      $vm.spanLeft = 24
      $vm.spanRight = 0
    }
    $vm.queryParams.productionDepartmentId = null
    if($vm.radioValue1 === '部门维度'){
      $vm.queryParams.productionDepartmentId = data.id
      $vm.queryParams.categoryId = data.parentId
      if(data.categoryName == '代宝科技'){
        $vm.queryParams.categoryId = null
      }
    }else{
      $vm.queryParams.categoryId = data.id;
    }
    $vm.handleQuery();
  };
  
  /** 查询项目下拉树结构 */
  const getDeptTree = ()=> {
    listCategory().then(response => {
      let obj = {
        category: null,
        categoryName: '代宝科技',
        isFontWeight: true,
        children: null,
        createBy: null,
        createTime: null,
        id: null,
        parentId: 0,
        remark: null,
      }
      listTypeInfo.deptList = [obj,...response.rows];
    });
  };
  /** 查询部门下拉树结构 */
  const getDeptTree1 = ()=> {
    deptTreeSelect().then(response => {
      console.log(response,111)
      let obj = {
        categoryName: '代宝科技',
        label: '代宝科技',
        isFontWeight: true,
        sysUser: null,
        id: null,
      }
      listTypeInfo.deptList1 = [obj,...response.data]
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
    getDeptTree1()
    getCategoryDetail()
  })

  return {
    topFormInfo,
    listTypeInfo,
    deptName,
    filterNode,
    handleNodeClick,
  };
}
