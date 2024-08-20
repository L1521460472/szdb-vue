/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-23 09:37:44
 */
import { ref, reactive, watch, nextTick } from "vue";
import { addInvoice } from "@/api/money/invoicingRecord";
import { CollectionPrepare } from "@/api/money/collectionDetails";
import { getToken } from "@/utils/auth";
import { useRouter } from 'vue-router'
export default function ($vm) {
  const router = useRouter()
  const dialogVisible = ref(false);
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "新建合同",
    width: "40%",
    closeOnClickModal: false,
    btnList: [
      {
        label: "确定",
        type: "primary",
        icon: "",
        event: "confirm",
        show: true,
      },
      { label: "取消", type: "", icon: "", event: "close", show: true },
    ],
  });
  const dialogInfo1 = reactive({
    visible: false,
    type: "",
    title: "文件预览",
    width: "40%",
    btnList: [
      // {
      //   label: "提交",
      //   type: "primary",
      //   icon: "",
      //   event: "confirm",
      //   show: true,
      // },
      // { label: "取消", type: "", icon: "", event: "close", show: true },
    ],
  });
  /**
   * @description: 基础表单配置
   */
  const formInfo = reactive({
    ref: {},
    span: 12,
    data: {
      invoiceAmount: 0
    },
    disabled: false,
    fieldList: [],
    rules: {
      projectId: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      invoiceAmount: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      invoiceTime: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      invoiceFile: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
    },
    labelWidth: "150px",
  });
  /*** 上传文件*/
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
    url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
    id: null,
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
  watch(
    () => dialogInfo.visible,
    (val) => {
      if (!val) {
        let obj = formInfo.data;
        Object.keys(obj).forEach((k) => {
          obj[k] = null;
        });
        $vm.$refs["uploadRef"].clearFiles();
        $vm.resetForm("invoiceRef");
      }
      
    }
  );

  /** 搜索按钮操作 */
  const handleQuery = () => {
    $vm.queryParams.pageNum = 1;
    $vm.getList();
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    $vm.resetForm("queryRef");
    $vm.queryParams.beginTime = null;
    $vm.queryParams.endTime = null;
    handleQuery();
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    dialogInfo.visible = true;
  }
  /** 关闭弹窗 */
  const close = () => {
    dialogInfo.visible = false;
  };
  /** 保存 */
  const confirm = () => {
    $vm.$refs["invoiceRef"].validate(valid => {
      if (valid) {
        if(!formInfo.data.id){
          if(formInfo.data.invoiceAmount > Number(formInfo.data.orderAmount)){
            $vm.$modal.msgWarning("开票金额不能超过待开票金额");
            return
          }
          addInvoice(formInfo.data).then(response => {
            if(response.code == 200){
              $vm.getList()
              dialogInfo.visible = false;
              $vm.$modal.msgSuccess("开票成功");
            }
          });
        }else{
          // editInvoice(formInfo.data).then(response => {
          //   if(response.code == 200){
          //     $vm.getList()
          //     dialogInfo.visible = false;
          //     $vm.$modal.msgSuccess("修改成功");
          //   }
          // });
        }
      }
    });
  };
  /** 切换项目 */
  const handleChange = (val) => {
    // console.log(val)
    const params = {
      type: 2,
      projectId: val
    }
    CollectionPrepare(params).then(response => {
      if(response.code == 200){
        formInfo.data.orderAmount = response.data
      }
    });
  };
  /** 全部开票 */
  const handleAllInvoice = (val) => {
    // console.log(val)
    formInfo.data.invoiceAmount = formInfo.data.orderAmount
  };
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
      formInfo.data.invoiceFile = response.url
      formInfo.data.fileName = response.originalFilename
      upload.isUploading = false;
      // proxy.$refs["uploadRef1"].handleRemove(file);
  };
  /** 文件上传成功处理 */
  const handlePreview = (file) => {
    formInfo.data.type = file.raw.type;
    formInfo.data.url = file.response.url;
    const addTypeArray = file.name.split(".");
    const addType = addTypeArray[addTypeArray.length - 1];
    if (addType === "pdf" || ["png", "jpg", "jpeg"].includes(addType)) {
      dialogInfo1.visible = true;
    }else if (addType === "doc" || addType === "docx" || addType === "xls" || addType === "xlsx") {
      this.$message({
        message: "该文件类型暂不支持预览",
        type: "warning",
      });
       return false;
    } else if (addType === "txt") {
      window.open(file.response.url);
    }else if (addType === "rar" || addType === "zip") {
      this.$message({
        message: "该文件类型暂不支持预览",
        type: "warning",
      });
       return false;
    }
  };

  return {
    dialogVisible,
    dialogInfo,
    dialogInfo1,
    formInfo,
    upload,
    handleQuery,
    resetQuery,
    handleAdd,
    close,
    confirm,
    handleChange,
    handleAllInvoice,
    handleFileUploadProgress,
    handleFileSuccess,
    handlePreview,
  };
}
