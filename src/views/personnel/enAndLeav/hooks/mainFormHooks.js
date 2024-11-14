/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-22 10:11:39
 */
import { reactive, onBeforeMount } from "vue";
import { listProject,artsList } from "@/api/project/project";
import { userList } from "@/api/money/performance";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "启用", value: true },
      { key: "停用", value: false },
    ],
    approveStatusList: [
      { key: "待提交", value: '1' },
      { key: "待审核", value: '2' },
      { key: "审核通过", value: '3' },
      { key: "已撤回", value: '4' },
    ],
    projectList: [],
    userList: [],
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });

  /** 查询财务项目列表 */
  const getArtsList = ()=> {
    artsList().then(response => {
      listTypeInfo.projectList = response.data;
    });
  };
  const getUserList = ()=> {
    userList().then(response => {
      listTypeInfo.userList = response.rows;
    });
  };

  onBeforeMount(()=>{
    getArtsList()
    getUserList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
