/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-13 10:09:48
 */
import { ref, reactive, watch, nextTick } from "vue";
import { approveOperate } from "@/api/task/pendingApproval";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";
import { getAdd,getEdit } from "../../../../api/task/enAndLeav";
// import { useRouter } from 'vue-router'
export default function ($vm) {
  const userName = ref(Cookies.get("userName"));
  const refDep = ref(null);//部门
  const content = ref("1111111");
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
    data: {
      standardName: '',
      deptId: '',
      deptName: '',
      standardContent: '',
    },
    disabled: false,
    fieldList: [],
    rules: {
      standardName: [
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
    console.log(formInfo.data,$vm.valueHtml);
    // formInfo.data.type = 1;
    if(Array.isArray(formInfo.data.deptId)){
      formInfo.data.deptId = formInfo.data.deptId.slice(-1)[0]
    }
    const params = {
      ...formInfo.data,
      standardContent: $vm.valueHtml,
    }
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

  return {
    refDep,
    content,
    dialogInfo,
    formInfo,
    close,
    confirm,
    handleProjectRate,
    handleTime,
    getTwo,
    handleChangeDept
  };
}
