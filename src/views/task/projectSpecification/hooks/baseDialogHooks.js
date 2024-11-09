/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-09 14:45:46
 */
import { ref, reactive, watch, nextTick } from "vue";
import { approveOperate } from "@/api/task/pendingApproval";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";
// import { useRouter } from 'vue-router'
export default function ($vm) {
  const userName = ref(Cookies.get("userName"));
  const editorOption = ref({
    placeholder: "请输入需要编写的内容...",
    modules: {
      // imageDrop: true, //图片拖拽
      // imageResize: {
      //   //放大缩小
      //   displayStyles: {
      //     backgroundColor: "black",
      //     border: "none",
      //     color: "white",
      //   },
      //   modules: ["Resize", "DisplaySize", "Toolbar"],
      // },
      // 需要重置工具，不然富文本工具上的功能会缺失
      toolbar: [
        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
        ["blockquote", "code-block"], // 引用  代码块
        [{ header: 1 }, { header: 2 }], // 1、2 级标题
        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
        [{ script: "sub" }, { script: "super" }], // 上标/下标
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        [{ direction: "rtl" }], // 文本方向
        [
          {
            size: [
              "12",
              "14",
              "16",
              "18",
              "20",
              "22",
              "24",
              "28",
              "32",
              "36",
            ],
          },
        ], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6] }], // 标题
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        // [{ font: ['songti'] }], // 字体种类
        [{ align: [] }], // 对齐方式
        ["clean"], // 清除文本格式
        // ["image", "video"], // 链接、图片、视频
      ],
    },
  })
  const content = ref("1111111");
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "任务审批",
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
      type: 1,
      producerId: '',
      artsProjectRateAddListRequestList: [
        {
          projectId:null,
          projectStage:null,
          projectRate:null,
          time:null,
          rateFile:null,
        }
      ],
      approveRecordVo:{
        approveName:null,
        time:null,
        attributeVoList:[],
      }
    },
    disabled: false,
    fieldList: [],
    rules: {
      name: [
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
        formInfo.data.artsProjectRateAddListRequestList = [
          {
            projectId:null,
            projectStage:null,
            projectRate:null,
            time:null,
            remarks:null,
            rateFile:null,
          }
        ]
        formInfo.data.approveRecordVo = {
          approveName:null,
          time:null,
          attributeVoList:[],
        }
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
    formInfo.data.type = 1;
    const params = {
      projectRate:formInfo.data.artsProjectRateAddListRequestList[0].projectRate,
      timeConsuming:formInfo.data.artsProjectRateAddListRequestList[0].time,
      id:formInfo.data.id,
    }
    approveOperate(params).then(response => {
      if(response.code == 200){
        $vm.getList()
        dialogInfo.visible = false;
        $vm.$modal.msgSuccess("保存成功");
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
  // 失去焦点事件
  const onEditorBlur = () => {
    console.log('失去��点事件');
  }
  // 获得焦点事件
  const onEditorFocus = () => {
    console.log('获得��点事件');
  }
  // 准备编辑器
  const onEditorReady = () => {
    console.log('编辑器准备好了');
  }
  // 内容改变事件
  const onEditorChange = () => {
    console.log('内容改变了');
  }

  const getTwo = (val)=>{
    if(val.length > 2){
      val = val.substring(val.length - 2 )
    }
    return val
  }

  return {
    editorOption,
    content,
    dialogInfo,
    formInfo,
    close,
    confirm,
    handleProjectRate,
    handleTime,
    getTwo,
    onEditorBlur,
    onEditorFocus,
    onEditorReady,
    onEditorChange,
  };
}
