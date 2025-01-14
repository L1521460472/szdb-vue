/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-01-14 09:31:56
 */
import { reactive, onBeforeMount } from "vue";
import { deptList,departmentList,} from "@/api/project/project";
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
      { key: "离职", value: '1' },
      { key: "在职", value: '2' },
    ],
    projectList: [],
    userList: [],
    depList: [],
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
  const getUserList = ()=> {
    userList().then(response => {
      listTypeInfo.userList = response.rows;
    });
  };

  onBeforeMount(()=>{
    getDepartmentList()
    // getUserList()
  })

  return {
    topFormInfo,
    listTypeInfo,
  };
}
