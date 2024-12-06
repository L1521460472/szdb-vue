/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-06 10:50:52
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
    statusList: [
      { key: "场景", value: '1' },
      { key: "次时代", value: '2' },
      { key: "原画", value: '3' },
      { key: "特效", value: '4' },
    ],
    supplierList: [
      { key: "1-5", value: '1-5' },
      { key: "5-10", value: '5-10' },
      { key: "10-20", value: '10-20' },
      { key: "20-30", value: '20-30' },
      { key: "30-50", value: '30-50' },
      { key: "50-100", value: '50-100' },
      { key: "100-500", value: '100-500' },
      { key: "500-1000", value: '500-1000' },
    ],
    supplierDJList: [
      { key: "优选供应商", value: '优选供应商' },
      { key: "合格供应商", value: '合格供应商' },
      { key: "淘汰供应商", value: '淘汰供应商' },
      { key: "退出供应商", value: '退出供应商' },
    ],
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
    // getArtsList()
    // getUserList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
