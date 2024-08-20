/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-02 17:26:55
 */
import { ref, reactive, watch, nextTick } from "vue";
export default function ($vm) {


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

  /** 搜索按钮操作 */
  const handleQuery = () => {
    $vm.queryParams.pageNum = 1;
    $vm.getDataCharts()
    $vm.getList();
    
    setTimeout(() => {
      // console.log(xAxisDataOne.value)
      $vm.initMyChart2();
      $vm.initMyChart3();
      $vm.initMyChart4();
    }, 500);
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    $vm.resetForm("queryRef");
    handleQuery();
  }

  return {
    handleQuery,
    resetQuery,
  };
}
