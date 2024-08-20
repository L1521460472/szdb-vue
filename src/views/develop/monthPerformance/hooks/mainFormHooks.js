/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-04-02 17:15:34
 */
import { reactive, onBeforeMount } from "vue";
import { userList } from "@/api/money/performance";
import { artsList } from "@/api/project/project";
import { deptList } from "@/api/money/orderStatistics";

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
      {
        value: 1,
        label: '1',
    }, {
        value: 2,
        label: '2'
    }, {
        value: 3,
        label: '3'
    }, {
        value: 4,
        label: '4'
    }, {
        value: 5,
        label: '5'
    }, {
        value: 6,
        label: '6'
    }, {
        value: 7,
        label: '7'
    }, {
        value: 8,
        label: '8'
    }, {
        value: 9,
        label: '9'
    }, {
        value: 10,
        label: '10'
    }, {
        value: 11,
        label: '11'
    }, {
        value: 12,
        label: '12'
    }
    ],
    userList:[],
    projectList:[],
    deptList:[],
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });
  /** 查询成员列表 */
  const getUserList = ()=> {
    userList().then(response => {
      listTypeInfo.userList = response.rows;
    });
  };
  /** 查询项目列表 */
  const getArtsList = ()=> {
    artsList().then(response => {
      listTypeInfo.projectList = response.data;
    });
  };
  /** 查询部门列表 */
  const getDeptList = ()=> {
    deptList().then(response => {
      listTypeInfo.deptList = response.data;
   });
  };

  onBeforeMount(()=>{
    getUserList()
    getArtsList()
    getDeptList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
