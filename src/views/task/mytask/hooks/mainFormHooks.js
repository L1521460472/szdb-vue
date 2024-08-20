/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-07 17:06:27
 */
import { reactive, onMounted } from "vue";
import { listProject } from "@/api/project/progress";

export default function ($vm) {
  /**
   * @description: 下拉框数据源
   */
  const listTypeInfo = reactive({
    enableList: [
      { key: "启用", value: true },
      { key: "停用", value: false },
    ],
    projectList: [],
    stateList: [],

  });

  /** 查询下拉数据 */
  const getListTypeInfo = () => {
    listProject().then(res => {
      listTypeInfo.projectList = res.rows;
    });
  }

  onMounted(() => {
    getListTypeInfo()
  });

  return {
    listTypeInfo,
  };
}
