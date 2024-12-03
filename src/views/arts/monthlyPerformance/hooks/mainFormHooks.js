/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-06 15:02:48
 */
import { reactive, onBeforeMount } from "vue";
import { deptList,userList } from "@/api/project/project";

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
    depList:[],
    userList:[],
    stateList:[{
      value: 1,
      label: '正常',
      disabled: true,
    }, {
      value: 2,
      label: '紧张'
    }, {
      value: 3,
      label: '延期'
    }, {
      value: 4,
      label: '已完成'
    }]
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
