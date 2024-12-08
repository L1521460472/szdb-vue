/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-12-05 18:23:29
 */
import { ref, reactive, watch, nextTick } from "vue";
import { approveOperate } from "@/api/task/pendingApproval";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";
import { getAdd,getEdit } from "@/api/personnel/supplier";
// import { useRouter } from 'vue-router'
export default function ($vm) {
  const userName = ref(Cookies.get("userName"));
  const refDep = ref(null);//部门
  const imageUrl1 = ref('')
  const imageUrl2 = ref([])
  const imageUrl3 = ref([])
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "新增",
    width: "40%",
    btnList: [
      {
        label: "提交",
        type: "primary",
        icon: "",
        event: "confirm",
        show: true,
        disabled: true,
      },
      { label: "取消", type: "", icon: "", event: "close", show: true },
    ],
  });
  /**
   * @description: 基础表单配置
   */
  const formInfo = reactive({
    ref: {},
    span: 12,
    data: {
      supplierName: '',
      deptId: '',
      deptName: '',
      standardContent: '',
    },
    disabled: false,
    fieldList: [],
    rules: {
      supplierName: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      locationCity: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      supplierScale: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      contactPerson: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      positionLiaisonPerson: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      mobile: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      supplierLevel: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      scopeBusiness: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      storageTime: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      businessAddressCompany: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      invoiceHeader: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      enterpriseNumber: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      bankDeposit: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      bankAccount: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      unitAddress: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
      phoneNumber: [
        { required: true, message: '必填', trigger: 'blur' },
      ],
    },
    labelWidth: "150px",
  });

  const upload1 = reactive({
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
    url: import.meta.env.VITE_APP_BASE_API + "/common/upload"
  });

  const upload2 = reactive({
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
    url: import.meta.env.VITE_APP_BASE_API + "/common/upload"
  });

  const upload3 = reactive({
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
    url: import.meta.env.VITE_APP_BASE_API + "/common/upload"
  });

  /**
   * @description: 监听弹窗表单disabled属性，为true时，隐藏弹窗【确定】按钮
   * @param {*}
   * @return {*}
   */
  watch(
    () => !formInfo.disabled,
    (val) => {
      dialogInfo.btnList[1].show = val;
    }
  );
  watch(
    () => dialogInfo.visible,
    (val) => {
      if (!val) {
        let obj = formInfo.data;
        Object.keys(obj).forEach((k) => {
          obj[k] = null;
        });
        $vm.valueHtml = '';
        $vm.type = 'add';
      }
      // nextTick(() => {
        // formInfo.ref.resetFields();
      // });
    }
  );


  /** 关闭弹窗 */
  const close = () => {
    dialogInfo.visible = false;
  };
  /** 保存 */
  const confirm = () => {
    console.log(formInfo.data,imageUrl1.value);
    $vm.$refs["supplierRef"].validate(valid => {
      if (valid) {
        console.log(formInfo.data.scopeBusiness,111)
        const params = {
          ...formInfo.data,
          scopeBusiness:formInfo.data.scopeBusiness.join(','),
          supplierLogo: imageUrl1.value,
          supplierBusinessLicense: JSON.stringify(imageUrl2.value),
          supplierQualificationCertificate: JSON.stringify(imageUrl3.value),
        }
        console.log(params)
        if($vm.type === 'add'){
          getAdd(params).then(response => {
            if(response.code == 200){
              $vm.getList()
              dialogInfo.visible = false;
              $vm.$modal.msgSuccess("保存成功");
            }
          });
        }else{
          getEdit(params).then(response => {
            if(response.code == 200){
              $vm.getList()
              dialogInfo.visible = false;
              $vm.$modal.msgSuccess("修改成功");
            }
          });
        }
      }
    });
  };
  /** change */
  const handleProjectRate = (val) => {
    $vm.type = 'view';
    formInfo.data.approveRecordVo.approveName = userName;
    formInfo.data.approveRecordVo.time = $vm.parseTime(new Date(),'{m}月{d}日');
    const newTime = $vm.parseTime(new Date(),'{i}:{s}');
    formInfo.data.approveRecordVo.attributeVoList.push({
      afterEditing: formInfo.data.artsProjectRateAddListRequestList[0].projectRate,
      attributeName: '进度',
      beforeEditing: $vm.oldProjectRate,
      editingTime: newTime,
    })
  };
  /** change */
  const handleTime = (val) => {
    $vm.type = 'view';
    formInfo.data.approveRecordVo.approveName = userName;
    formInfo.data.approveRecordVo.time = $vm.parseTime(new Date(),'{m}月{d}日');
    const newTime = $vm.parseTime(new Date(),'{i}:{s}');
    formInfo.data.approveRecordVo.attributeVoList.push({
      afterEditing: formInfo.data.artsProjectRateAddListRequestList[0].time,
      attributeName: '用时(天)',
      beforeEditing: $vm.oldTimeConsuming,
      editingTime: newTime,
    })
  };
  /** change */
  const handleChangeDept = (val) => {
    formInfo.data.deptName = refDep.value.getCheckedNodes()[0].label
  };

  const getTwo = (val)=>{
    if(val.length > 2){
      val = val.substring(val.length - 2 )
    }
    return val
  }
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload1.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
    console.log(response, file, fileList)
    if(response.code == 200){
      imageUrl1.value = response.url
      upload1.open = false;
      upload1.isUploading = false;
      $vm.$refs["uploadRef1"].handleRemove(file);
      $vm.$modal.msgSuccess(response.msg);
    }
  };
  /**文件上传中处理 */
  const handleFileUploadProgress1 = (event, file, fileList) => {
    upload2.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess1 = (response, file, fileList) => {
    console.log(response, file, fileList)
    if(response.code == 200){
      // imageUrl2.value = response.url
      imageUrl2.value.push({name: response.originalFilename,url: response.url})
      upload2.open = false;
      upload2.isUploading = false;
      $vm.$refs["uploadRef2"].handleRemove(file);
      $vm.$modal.msgSuccess(response.msg);
    }
  };
  const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  }
  const handleRemove1 = (file) => {
    console.log(file)
  }
  /**文件上传中处理 */
  const handleFileUploadProgress2 = (event, file, fileList) => {
    upload3.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess2 = (response, file, fileList) => {
    console.log(response, file, fileList)
    if(response.code == 200){
      // imageUrl3.value = response.url
      imageUrl3.value.push({name: response.originalFilename,url: response.url})
      upload3.open = false;
      upload3.isUploading = false;
      $vm.$refs["uploadRef3"].handleRemove(file);
      $vm.$modal.msgSuccess(response.msg);
    }
  };
  const handlePictureCardPreview2 = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
  }
  const handleRemove2 = (file) => {
    console.log(file)
  }
  

  return {
    refDep,
    dialogInfo,
    dialogVisible,
    dialogImageUrl,
    formInfo,
    imageUrl1,
    imageUrl2,
    imageUrl3,
    upload1,
    upload2,
    upload3,
    close,
    confirm,
    handleProjectRate,
    handleTime,
    getTwo,
    handleChangeDept,
    handleFileUploadProgress,
    handleFileSuccess,
    handleFileUploadProgress1,
    handleFileSuccess1,
    handlePictureCardPreview,
    handleRemove1,
    handleRemove2,
    handleFileUploadProgress2,
    handleFileSuccess2,
  };
}
