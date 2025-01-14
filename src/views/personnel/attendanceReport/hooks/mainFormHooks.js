/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-14 17:21:14
 */
import { reactive, onBeforeMount } from "vue";
// import { deptList } from "@/api/money/orderStatistics";
import { deptList,departmentList,userList,} from "@/api/project/project";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "启用", value: true },
      { key: "停用", value: false },
    ],
    statusList: [
      { key: "已确认", value: '1' },
      { key: "未确认", value: '2' },
      { key: "异常", value: '3' }
    ],
    depList:[],
    userList:[],
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
  const getDepartmentList = ()=> {
    deptList().then(response => {
      listTypeInfo.depList = response.data;
    });
  };
  /** 查询成员列表 */
  const getuserList = ()=> {
    userList().then(response => {
      listTypeInfo.userList = response.rows;
    });
  };
  onBeforeMount(()=>{
    getDepartmentList()
    getuserList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
