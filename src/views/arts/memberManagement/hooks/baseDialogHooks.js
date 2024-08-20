/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:48:02
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-20 19:04:55
 */
import { ref, reactive, watch, nextTick } from "vue";
import { getToken } from "@/utils/auth";
import { addHeadquarters, addExternal, editExternal } from "@/api/project/memberManagement";
import { listUser } from "@/api/system/user";
import { cloneDeep } from 'lodash-es';
export default function ($vm) {
  const menuRef = ref(null);
  const menuExpand = ref(true);
  const menuNodeAll = ref(false);
  const imageUrl = ref(null)
  const dialogInfo = reactive({
    visible: false,
    type: "",
    title: "添加成员",
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
    title: "新增外部成员",
    width: "40%",
    closeOnClickModal: false,
    btnList: [
      {
        label: "确定",
        type: "primary",
        icon: "",
        event: "confirm1",
        show: true,
      },
      { label: "取消", type: "", icon: "", event: "close1", show: true },
    ],
  });
  const menuCheckStrictly = ref(true)
  const userIds = ref([])
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
      companyLogo: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      companyName: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      contactsName: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      contactsWay: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      shtick: [
        { required: true, message: '必填', trigger: 'blur' }
      ],
      technologyRank: [
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
  watch(
    () => !formInfo.disabled,
    (val) => {
      dialogInfo1.btnList[0].show = val;
    }
  );
  watch(
    () => dialogInfo1.visible,
    (val) => {
      if (!val) {
        let obj = formInfo.data;
        Object.keys(obj).forEach((k) => {
          obj[k] = null;
        });
        $vm.resetForm("externalRef");
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
    handleQuery();
  }
  /** 新增按钮操作 */
  const handleAdd = () => {
    console.log($vm.listTypeInfo.depTreeAddList)
    dialogInfo.visible = true;
  }
  /** 新增外部成员按钮操作 */
  const handleAdd1 = () => {
    dialogInfo1.visible = true;
  }
  /** 关闭弹窗 */
  const close = () => {
    dialogInfo.visible = false;
  };
  /** 保存 */
  const confirm = () => {
    // console.log($vm.menuRef.getCheckedKeys())
    addHeadquarters({userIds:$vm.menuRef.getCheckedKeys()}).then(response => {
      if(response.code == 200){
        $vm.getList()
        dialogInfo.visible = false;
        $vm.$modal.msgSuccess("新增成功");
      }
    });
  };
  /** 外部成员关闭弹窗 */
  const close1 = () => {
    dialogInfo1.visible = false;
  };
  /** 外部成员保存 */
  const confirm1 = () => {
    $vm.$refs["externalRef"].validate(valid => {
      if (valid) {
        if(!formInfo.data.id){
          addExternal(formInfo.data).then(response => {
            if(response.code == 200){
              $vm.getDataList()
              dialogInfo1.visible = false;
              $vm.$modal.msgSuccess("新增成功");
            }
          });
        }else{
          editExternal(formInfo.data).then(response => {
            if(response.code == 200){
              $vm.getDataList()
              dialogInfo1.visible = false;
              $vm.$modal.msgSuccess("修改成功");
            }
          });
        }
      }
    });
  };
  /** 树权限（展开/折叠）*/
  const handleCheckedTreeExpand = (value, type)=> {
    if (type == "menu") {
      let treeList = $vm.listTypeInfo.depTreeList;
      for (let i = 0; i < treeList.length; i++) {
        menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    } else if (type == "dept") {
      let treeList = deptOptions.value;
      for (let i = 0; i < treeList.length; i++) {
        deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  }
  /** 树权限（全选/全不选） */
  const handleCheckedTreeNodeAll = (value, type)=> {
    // console.log(type)
    if (type == "menu") {
      menuRef.value.setCheckedNodes(value ? $vm.listTypeInfo.depTreeList : []);
    } else if (type == "dept") {
      deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
    }
  }
  /** 树权限（父子联动） */
  const handleCheckedTreeConnect = (value, type)=> {
    if (type == "menu") {
      formInfo.data.menuCheckStrictly = value ? true : false;
    } else if (type == "dept") {
      formInfo.data.deptCheckStrictly = value ? true : false;
    }
  }
  /** 所有菜单节点数据 */
  const getMenuAllCheckedKeys = ()=> {
    // 目前被选中的菜单节点
    let checkedKeys = menuRef.value.getCheckedKeys();
    // 半选中的菜单节点
    let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
    return checkedKeys;
  }
  /** 节点单击事件 */
  const handleNodeClick = (data,v,p)=> {
    if(!data.children && !data.deptId){
      handleCheckedTreeConnect(false,'menu')
      handleCheckedTreeConnect(true,'menu')
      $vm.queryParams.deptId = data.id
      listUser($vm.queryParams).then(res => {
        data.children = cloneDeep(res.rows).map((item)=>{
          item.id = item.userId;
          item.label = item.userName;
          return item
        });
      });
    }
  }
   /**文件上传前处理 */
  const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type.substring(0,5) !== 'image') {
      $vm.$modal.msgWarning("请上传图片");
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      $vm.$modal.msgWarning('文件不能大于 2MB!')
      return false
    }
    return true
  }
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
      formInfo.data.companyLogo = response.url
      formInfo.data.fileName = response.originalFilename
      upload.isUploading = false;
      // proxy.$refs["uploadRef1"].handleRemove(file);
  };

  return {
    menuRef,
    menuExpand,
    menuNodeAll,
    imageUrl,
    dialogInfo,
    dialogInfo1,
    formInfo,
    upload,
    menuCheckStrictly,
    handleAdd,
    handleAdd1,
    close,
    confirm,
    close1,
    confirm1,
    handleCheckedTreeExpand,
    handleCheckedTreeNodeAll,
    handleCheckedTreeConnect,
    getMenuAllCheckedKeys,
    handleNodeClick,
    beforeAvatarUpload,
    handleFileUploadProgress,
    handleFileSuccess,
  };
}
