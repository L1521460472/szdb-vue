/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-02-15 10:47:41
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

export default function ($vm: any) {

  const router = useRouter();

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);


  onMounted(() => {

  });


  return {
    tableData,
  };
}
