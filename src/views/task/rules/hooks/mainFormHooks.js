/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-03 17:07:44
 */
import { reactive, onBeforeMount } from "vue";

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
    ]
  });

  const topFormInfo = reactive({
    data: {},
    labelWidth: "100px",
    fieldList: [

    ],
    filterConditionList: [
    ],
  });

  return {
    topFormInfo,
    listTypeInfo,
  };
}
