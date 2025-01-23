/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-03 16:50:00
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-07-31 17:52:03
 */
import { reactive, onBeforeMount,nextTick,ref } from "vue";
import { deptList,userList,dictData } from "@/api/project/project";

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
    stageList:[]
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
  /** 查询数据字典阶段列表 */
  const getdictDataList = ()=> {
    dictData({dictType:'project_stage'}).then(response => {
      listTypeInfo.stageList = response.rows;
    });
  };
  const time = ref('')
  const chooseDay = ref(null)
  /** 时间查询 */
  // function handleChangeTime(val) {
  //   $vm.queryParams.startTime = val[0];
  //   $vm.queryParams.endTime = val[1];
  // };
  function getDaysInCurrentMonth(year,month) {
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth() + 1; // 月份从0开始，所以要加1
    const days = new Date(year, month, 0).getDate();
    return days;
  }
  /** 时间查询 */
  function handleChangeTime(val) {
    val[1] = val[1].slice(0,-2) + getDaysInCurrentMonth(val[1].slice(0,4),val[1].slice(5,7))
    $vm.queryParams.startTime = val[0];
    $vm.queryParams.endTime = val[1];
  };
  /** 时间查询 */
  function handleCalendarChange(val) {
    const [pointDay] = val
    chooseDay.value = pointDay;
  };
  /** 获得焦点 */
  function handleFocus(val) {
    chooseDay.value = null;
  };
  /** 时间限制范围查询 */
  function disabledDate(time) {
    if(!chooseDay.value){
      return false
    }
    let timeRange = 30;
    const con1 = new Date(chooseDay.value).getTime() - timeRange * 24 * 60 * 60 * 1000;
    const con2 = new Date(chooseDay.value).getTime() + timeRange * 24 * 60 * 60 * 1000;
    return time < con1 || time > con2;
  };
  /** 时间初始化 */
  function getTime() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    $vm.queryParams.startTime = $vm.parseTime(start,'{y}-{m}-{d}')
    $vm.queryParams.endTime = $vm.parseTime(end,'{y}-{m}-{d}')
    time.value = [$vm.parseTime(start,'{y}-{m}-{d}'), $vm.parseTime(end,'{y}-{m}-{d}')]
  };

  onBeforeMount(()=>{
    getDepartmentList()
    getuserList()
    getdictDataList()
  })

  return {
    topFormInfo,
    listTypeInfo,
    time,
    chooseDay,
    handleChangeTime,
    handleCalendarChange,
    handleFocus,
    disabledDate,
  };
}
