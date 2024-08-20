/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-14 17:08:13
 */
import { ref, reactive, watch, nextTick } from "vue";
import { useRouter } from 'vue-router'
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
    $vm.getList();
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
