/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2024-11-06 20:23:21
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-15 09:51:04
 */
import { reactive, onBeforeMount } from "vue";
import { deptList,userList } from "@/api/project/project";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "未完成", value: '0' },
      { key: "已完成", value: '1' },
    ],
    dateList: [
      { key: "近一周", value: '1' },
      { key: "近一个月", value: '2' },
      { key: "近三个月", value: '3' },
      { key: "近半年", value: '4' },
      { key: "全年", value: '5' },
      { key: "指定日期", value: '6' },
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
    // getDepartmentList()
    // getuserList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
