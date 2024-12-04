/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-15 18:15:14
 */
import { onMounted,onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getPage,deptList,getDelete,getDetail,getImport,getColumn } from "@/api/personnel/attendanceReport";
import { formatDate } from "@/utils/index";

export default function ($vm) {

  const router = useRouter();
  const loading = ref(false);
  const showSearch = ref(true);
  const columnList = ref([])
  const total = ref(0);
  const userName = ref(null)
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    name: undefined,
    deptId: undefined,
    attendanceStatus: undefined,
    attendanceMonth: undefined,
  })

  // 列显隐信息
  const columns = ref([
    { key: 'name', label: `姓名`, visible: false },
    { key: 'attendanceDay', label: `应出勤天数`, visible: false },
    { key: 'accountingAttendanceDay', label: `核算工资出勤天数`, visible: false },
    { key: 'workOvertime', label: `加班（小时）`, visible: false },
    { key: 'compassionateLeave', label: `事假`, visible: false },
    { key: 'sickLeave', label: `病假`, visible: false },
    { key: 'annualLeave', label: `年假`, visible: false },
    { key: 'marriageBereavementPaternityLeave', label: `婚/丧/陪产假`, visible: false },
    { key: 'totalManagementSystem', label: `全勤奖`, visible: false },
    { key: 'numberLatencies', label: `迟到次数`, visible: false },
    { key: 'numberMissingCards', label: `缺卡次数`, visible: false },
    { key: 'attendanceDeduction', label: `考勤扣款`, visible: false },
    { key: 'remainingAnnualLeave', label: `年假剩余（小时）`, visible: false },
    { key: 'remainingCompensatoryLeave', label: `调休剩余（小时）`, visible: false },
    { key: 'attendanceStatus', label: `考勤状态`, visible: false },
  ]);

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList =  () => {
    loading.value = true;
    getPage(queryParams.value).then(async(response) => {
      tableData.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询推送字段 */
  const getColumnList =  () => {
    getColumn().then((response) => {
      console.log(response)
      if(response.data){
        columns.value = columns.value.map(item =>{
          if(response.data.includes(item.key)){
            item.visible = true
          }
          return item
        });
      }
    });
  }

  /** 导入按钮操作 */
  function handleImport() {
    $vm.upload.title = "人事-考勤报表导入";
    $vm.upload.open = true;
  };

  /** 跳转 */
  const handleAdd = () => {
    console.log(111)
  }
  /** 编辑 */
  const handleEdit = (row) => {
    // type.value = 'edit'
    getDetail(row.id).then(response => {
      if(response.code == 200){
        console.log(response.data)
        $vm.formInfo.data = response.data
        $vm.formInfo.data.attendanceStatus = response.data.attendanceStatus + ''
        $vm.visible = true;
      }
    });
  }
  /** 删除 */
  const handleDelete = (row) => {
    $vm.$modal.confirm('是否确认删除').then(function () {
      return getDelete(row.id);
    }).then(() => {
      getList();
      $vm.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  /** 一键推送 */
  const handlePush = () => {
    console.log('一键推送')
  }
  /** 发送确认 */
  const handlePromotion = (row) => {
    console.log(row)
  }
  onBeforeMount(() => {
    getList()
    getColumnList()
  }),

  onMounted(() => {
    queryParams.value.workDate = formatDate(new Date()).substring(0,10)
  });


  return {
    tableData,
    total,
    columns,
    showSearch,
    loading,
    queryParams,
    columnList,
    userName,
    getList,
    handleAdd,
    handleEdit,
    handleDelete,
    handlePush,
    handlePromotion,
    handleImport,
    getColumnList,
  };
}
