/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-14 17:08:13
 */
import { ref, reactive, watch, nextTick,onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { getAdd,getEdit } from "@/api/personnel/attendanceReport";
export default function ($vm) {

  const detailTableData = ref([]);
  const detailcolumnList = ref([]);
  const visible = ref(false);
  /**
   * @description: 监听弹窗表单disabled属性，为true时，隐藏弹窗【确定】按钮
   * @param {*}
   * @return {*}
   */
  // watch(
  //   () => !formInfo.disabled,
  //   (val) => {
  //     dialogInfo.btnList[1].show = val;
  //   }
  // );
  /** 查询表格列表 */
  const getDetailList =  () => {
    attendanceDetail($vm.queryParams).then(async(response) => {
      let startDate = null
      let endDate = null
      response.attendance_result_list.map((item)=>{
        if(item.check_type == 'OnDuty'){
          startDate = item.user_check_time
        }
        if(item.check_type == 'OffDuty'){
          endDate = item.user_check_time
        }
      })
      if(response.attendance_result_list.length > 0){
        detailTableData.value = [{
          name: $vm.userName,
          startDate: startDate,
          endDate: endDate,
          date: $vm.queryParams.workDate
        }]
      }
    });
  }

  /** 确定 */
  const submitFileForm = () => {
    console.log('submitFileForm')
  }
  /** 搜索按钮操作 */
  const handleQuery = () => {
    $vm.queryParams.pageNum = 1;
    getDetailList();
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    $vm.resetForm("queryRef");
    handleQuery();
  }
  // onBeforeMount(() => {
  //   getDetailList()
  // })

  return {
    detailTableData,
    detailcolumnList,
    visible,
    getDetailList,
    submitFileForm,
    handleQuery,
    resetQuery,
  };
}
