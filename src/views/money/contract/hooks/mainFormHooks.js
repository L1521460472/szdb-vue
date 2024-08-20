/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-15 15:04:13
 */
import { reactive, onBeforeMount } from "vue";
import { listCategoryDetail, listProject,artsList } from "@/api/project/project";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    typeList: [
      { key: "美术", value: 1 },
      { key: "开发", value: 2 },
    ],
    dateList: [
      { key: "近一周", value: '1' },
      { key: "近一个月", value: '2' },
      { key: "近三个月", value: '3' },
      { key: "近半年", value: '4' },
      { key: "全年", value: '5' },
      { key: "指定日期", value: '6' },
    ],
    categoryList:[],
    projectList:[],
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });
  /** 查询企业列表 */
  const getCategoryList = ()=> {
    listCategoryDetail(0).then(response => {
      listTypeInfo.categoryList = response.data;
   });
  };
  /** 查询项目列表 */
  // const getProjectList = ()=> {
  //   listProject().then(response => {
  //     listTypeInfo.projectList = response.rows;
  //   });
  // };
  /** 查询财务项目列表 */
  const getArtsList = ()=> {
    artsList().then(response => {
      listTypeInfo.projectList = response.data;
    });
  };

  onBeforeMount(()=>{
    getCategoryList()
    getArtsList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
