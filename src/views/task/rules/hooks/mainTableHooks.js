/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-04-12 10:23:33
 */
import { onMounted, reactive, ref } from "vue";
import { getInfo, upInfo } from "@/api/task/rules";

export default function ($vm) {

  const loading = ref(true);

  const disabled = ref(true);
  const textareaValue = ref('');

  const total = ref(0);
  const type = ref('add');
  const oldTimeConsuming = ref('');
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    projectId: undefined,
  })

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询表格列表 */
  const getList = () => {
    loading.value = true;
    getInfo().then(response => {
      textareaValue.value = response.data;
      loading.value = false;
    });
  }
  /** 编辑 */
  const handleDisabled = () => {
    disabled.value = !disabled.value;
  }
  /** 保存 */
  const handleChange = () => {
    upInfo({data:textareaValue.value}).then(response => {
      getList()
      $vm.$modal.msgSuccess("保存成功");
      disabled.value = true;
    });
  }


  onMounted(() => {
    getList()
  });


  return {
    tableData,
    total,
    type,
    loading,
    disabled,
    queryParams,
    textareaValue,
    oldTimeConsuming,
    getList,
    handleDisabled,
    handleChange,
  };
}
