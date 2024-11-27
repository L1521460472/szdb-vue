/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-27 20:01:19
 */
import { reactive, onBeforeMount } from "vue";
import { listProject,listCategory,userList,listCategoryDetail,flowPathList,departmentList,dictData,deptList,listCategoryByType } from "@/api/project/project";
import { orderList } from "@/api/develop/orderList";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "是", value: '1' },
      { key: "否", value: '0' },
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
    orderList:[],
    categoryList:[],
    codeList:[],
    userList:[],
    flowList:[],
    checkboxList:[],
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });
  /** 查询部门列表 */
  const getdeptList = ()=> {
    deptList().then(response => {
      listTypeInfo.deptList = response.data;
    });
  };
  /** 查询订单列表 */
  const getOrderList = ()=> {
    orderList().then(response => {
      if(response.data.length > 0){
        $vm.oId = response.data[0].levelId
        listTypeInfo.orderList = response.data.map(item =>{
          item.orderId = item.levelId
          item.orderName = item.levelName
          return item
        })
      }
    });
  };
  /** 查询企业 */
  const getCategoryDetail = (id)=> {
    listCategoryByType(id).then(response => {
      listTypeInfo.categoryList = response.data.map((item)=>{
        item.value = item.categoryName
        item.link = item.id
        return item
      });
    });
  };
  /** 查询成员列表 */
  const getuserList = ()=> {
    userList().then(response => {
      listTypeInfo.userList = response.rows;
    });
  };
  /** 查询流程列表 */
  const getflowPathList = ()=> {
    flowPathList().then(response => {
      listTypeInfo.flowList = response.data;
    });
  };
  /** 查询数据字典阶段列表 */
  const getdictDataList = ()=> {
    dictData({dictType:'develop_stage',pageSize: 500}).then(response => {
      listTypeInfo.checkboxList = response.rows;
    });
  };

  onBeforeMount(()=>{
    getOrderList()
    getCategoryDetail(2)
    getuserList()
    getflowPathList()
    getdeptList()
    getdictDataList()
  })

  return {
    topFormInfo,
    listTypeInfo,
    getOrderList,
  };
}
