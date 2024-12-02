/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-08 10:24:58
 */
import { ref, reactive, watch, nextTick } from "vue";
import { useRouter } from 'vue-router'
import { getAdd,getEdit } from "@/api/money/expenditureManagement";
export default function ($vm) {

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
    data: {},
    disabled: false,
    fieldList: [],
    rules: {
      name: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      department: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      salary: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      monthlySpread: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      legalDays: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      wagesTime: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      taxCost: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      dailyCost: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
    },
    labelWidth: "150px",
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
      }
      
    }
  );

  //部门下拉选择
  const handleChangeDept = (value) => {
    console.log(value)
    formInfo.data.department = value.slice(-1)[0]
  } 
    // 确认
  const handleConfirm = ()=>{
    $vm.$refs["dialogRef"].validate(valid => {
      if (valid) {
        const params = {
          ...formInfo.data,
        }
        if($vm.type === 'add'){
          getAdd(params).then(response => {
            if(response.code == 200){
              $vm.getDataList()
              dialogInfo.visible = false;
              $vm.$modal.msgSuccess("保存成功");
            }
          });
        }else{
          getEdit(params).then(response => {
            if(response.code == 200){
              $vm.getDataList()
              dialogInfo.visible = false;
              $vm.$modal.msgSuccess("修改成功");
            }
          });
        }
      }
    });
  }

  const router = useRouter()

  return {
    dialogInfo,
    formInfo,
    handleConfirm,
    handleChangeDept
  };
}
