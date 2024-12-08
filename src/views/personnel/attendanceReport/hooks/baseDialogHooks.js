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
import { getAdd,getEdit,getImport } from "@/api/personnel/attendanceReport";
import { getToken } from "@/utils/auth";
export default function ($vm) {

  const detailTableData = ref([]);
  const detailcolumnList = ref([]);
  const visible = ref(false);
  const formInfo = reactive({
    visible: false,
    ref: {},
    span: 12,
    data: {},
    disabled: false,
    fieldList: [],
    rules: {
      attendanceMonth: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      // file: [
      //   { required: true, message: '必填', trigger: 'blur' }
      // ],
    },
    labelWidth: "150px",
  });
  /*** 用户导入参数 */
  const upload = reactive({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: "Bearer " + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + "/system/report/import"
  });
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
    /** 下载模板操作 */
    function importTemplate() {
      $vm.download("system/report/importTemplate", {
      }, `report_template_${new Date().getTime()}.xlsx`);
    };
    /**文件上传中处理 */
    const handleFileUploadProgress = (event, file, fileList) => {
      upload.isUploading = true;
    };
    /** 文件上传成功处理 */
    const handleFileSuccess = (response, file, fileList) => {
      console.log(response, file, fileList)
      if(response.code == 200){
        upload.open = false;
        upload.isUploading = false;
        $vm.$refs["uploadRef"].handleRemove(file);
        $vm.$modal.msgSuccess(response.msg);
        $vm.getList();
      }
    };

  /** 导入确定 */
  const submitFileForm = () => {
    console.log('submitFileForm')
    $vm.$refs["reportRef"].validate( async valid => {
      if (valid) {
        $vm.$refs["uploadRef"].submit();
      }
    });
  }

  /** 编辑确定 */
  const handleConfirm = () => {
    console.log('submitFileForm')
    $vm.$refs["rateRef"].validate( async valid => {
      if (valid) {
        getEdit(formInfo.data).then((res)=>{
          console.log(res)
          $vm.visible = false;
          $vm.getList()
        })
      }
    });
  }
  


  return {
    formInfo,
    upload,
    detailTableData,
    detailcolumnList,
    visible,
    submitFileForm,
    importTemplate,
    handleFileUploadProgress,
    handleFileSuccess,
    handleConfirm
  };
}
