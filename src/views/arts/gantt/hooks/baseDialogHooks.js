/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-11 17:54:24
 */
import { ref, reactive, watch, nextTick } from "vue";
import { approveOperate } from "@/api/task/pendingApproval";
// import { useRouter } from 'vue-router'
export default function ($vm) {
    /** 搜索按钮操作 */
    const handleQuery = () => {
      $vm.queryParams.pageNum = 1;
      if($vm.activeName == 'first'){
        $vm.getCalendarList()
        setTimeout(()=>{
          $vm.initGantt();
        },600)
      }else if($vm.activeName == 'second'){
        $vm.getList();
      }else{
        $vm.getSchedulingList()
      }
      
    }
    /** 重置按钮操作 */
    const resetQuery = () => {
      $vm.resetForm("queryRef");
      $vm.time = '';
      handleQuery();
    }

  return {
    handleQuery,
    resetQuery,
  };
}
