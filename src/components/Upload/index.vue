<template>
  <div class="zhqc-upload">
    <div class="upload-image">
      <ul v-if="showUploadImageViewer" class="upload-image-viewer">
        <li
          v-for="(file, index) in fileOp.list"
          :key="index"
          class="upload-image-viewer-hover"
          @mouseover="hoverIndex = index"
          @mouseout="hoverIndex = -1"
        >
          <div
            :class="[index == hoverIndex ? 'image-item' : 'image-item-none']"
          >
            <div class="image-layer">
              <div style="width: 100%">
                <i class="el-icon-zoom-in" @click="openViewer(file)" />
                <i
                  v-if="!disabled"
                  class="el-icon-delete"
                  @click="deleteItem(file)"
                />
              </div>
            </div>
          </div>
          <img :src="imgSrc(file.fileUrl)" alt="" class="image-item-img" />
        </li>
      </ul>
      <el-upload
        ref="uploadRef"
        v-loading="loading"
        :name="name"
        :headers="uploadOp.headers"
        :action="uploadOp.action"
        :multiple="multiple"
        :disabled="disabled"
        :auto-upload="autoUpload"
        :accept="uploadOp.accept"
        :drag="drag && type === 'drag'"
        :show-file-list="uploadOp.showFileList"
        :file-list="fileOp.fileList"
        :list-type="uploadOp.listType"
        :class="[{ hide: hideUploadBtn }, type]"
        :on-preview="onPreview"
        :on-remove="onRemove"
        :on-success="onSuccess"
        :on-error="onError"
        :on-progress="onProgress"
        :on-change="onChange"
        :on-exceed="onExceed"
        :before-upload="beforeUpload"
      >
        <!-- plus -->
        <i v-if="type === 'plus'" slot="default" class="el-icon-plus" />
        <!-- 拖拽 -->
        <div v-if="type === 'drag'">
          <el-icon class="el-icon--upload">
            <el-icon><UploadFilled /></el-icon>
          </el-icon>
          <div class="el-upload__text">
            将文件托到此处，或 <em>点击上传</em>
            <p v-if="typeSO === true">一次最多上传10张SO单，单个文件最大5M，<br/>支持上传PDF、Word、Excel、图片文件类型</p>
            <p v-else>最多10附件，大小限制100M</p>
          </div>
        </div>
        <!-- 按钮 -->
        <div v-if="type === 'btn'">
          <el-button size="small">
            <i class="xh-iconfont xh-icon-export icon-size"></i>
            {{ btnText }}
          </el-button>
        </div>
      </el-upload>
      <pdf-viewer ref="pdfViewer" :url="pdfUrl" />
    </div>
    <div v-if="showTips && uploadTips" class="upload-tips">
      {{ uploadTips }}
    </div>
  </div>
</template>

<script>
import PdfViewer from "@/components/PdfViewer/index.vue";
import {
  defineComponent,
  reactive,
  onBeforeMount,
  getCurrentInstance,
} from "vue";
import {UploadFilled} from '@element-plus/icons-vue'
import pdfImg from "./image/pdf.jpg";
import wordImg from "./image/word.jpg";
import txtImg from "./image/txt.jpg";
import excelImg from "./image/excel.jpg";
import request from "@/utils/request";

export default defineComponent({
  name: "Upload",
  components: {
    PdfViewer,
  },
  props: {
    files: {
      // 外部用来接收的文件数据
      type: Array,
      default: () => [],
    },
    valueKey: {
      // files对应的值，返回单个字段值
      type: String,
      default: "",
    },
    valuesKey: {
      // files对应的值，返回单个字段值数组
      type: String,
      default: "",
    },
    externalFiles: {
      type: Array,
      default: () => [],
    },
    type: {
      // 上传组件类型：plus、btn、drag
      type: String,
      default: "plus",
    },
    typeSO: {
      // 是否SO池
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "点击上传",
    },
    listType: {
      type: String,
      default: "",
    },
    action: {
      // 上传的地址
      type: String,
      default: "",
    },
    name: {
      // 上传的文件字段名
      type: String,
      default: "files",
    },
    headers:{
       // 上传的文件字段名
      type: Object,
      default: ()=>{},
    },
    multiple: {
      // 是否支持多选文件
      type: Boolean,
      default: true,
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    autoUpload: {
      // 是否自动上传文件
      type: Boolean,
      default: true,
    },
    drag: {
      // 是否启用拖拽上传
      type: Boolean,
      default: true,
    },
    limit: {
      // 允许上传的最大数量
      type: Number,
      default: 5,
    },
    showTips: {
      // 是否显示提示文本
      type: Boolean,
      default: false,
    },
    showFileList: {
      // 是否显示已上传文件列表
      type: Boolean,
      default: false,
    },
    size: {
      // 单个文件大小
      type: Number,
      default: 2,
    },
    accept: {
      // 接受上传的 文件类型
      type: [String, Array, Object],
    },
  },

  emits: [
    "update:files",
    "onRemove",
    "onSuccess",
    "onError",
    "onProgress",
    "onChange",
    "onExceed",
    "beforeUpload",
  ],

  setup(props, { emit }) {
    const instance = getCurrentInstance()?.proxy;

    const uploadRef = ref(null);

    const hoverIndex = ref(-1);
    const loading = ref(false);
    const hideUploadBtn = ref(false);
    const uploadTips = ref("");
    const pdfUrl = ref("");

    const uploadOp = reactive({
      headers: {},
      action: "",
      listType: "",
      showFileList: false,
      accept: ".txt,.pdf,.doc,.docx,.xlsx,.xls,.gif,.jpg,.png,.zip,.rar",
    });

    const fileOp = reactive({
      list: [],
      fileList: [],
    });

    const showUploadImageViewer = computed(() => {
      return props.type === "plus" && fileOp.list.length > 0;
    });

    /* 监听文件数量，隐藏上传按钮 */
    watch(
      () => fileOp.list,
      (val) => {
        hideUploadBtn.value = val.length >= props.limit;
        let file = null;
        if (props.valueKey) {
          const list = val.map((item) => item[props.valueKey]);
          if (list && list[0]) {
            file = list[0];
          }
        } else if (props.valuesKey) {
          val.map((item) => item[props.valuesKey]);
        } else {
          file = val;
        }
        emit("update:files", file);
      },
      {
        deep: true,
      }
    );

    watch(
      () => props.externalFiles,
      (val) => {
        fileOp.list = val || [];
        fileOp.fileList = fileOp.list.map((file) => {
          file.name = file.originFileName;
          // 数据回显
          file.url = file.fileUrl;
          return file;
        });
      },
      {
        deep: true,
      }
    );

    onBeforeMount(() => {
      initUploadOp();
    });

    /* 初始化配置 */
    const initUploadOp = () => {
      uploadOp.action = `${import.meta.env.VITE_BASE_URL}${
        props.action || "/common/uploads"
      }`;
      uploadOp.headers = {token: localStorage.getItem('token')}
      if (Object.prototype.toString.call(props.accept) === "[object String]") {
        uploadOp.accept = props.accept;
      }

      if (props.listType) {
        uploadOp.listType = props.listType;
      } else {
        const listType = {
          plus: "picture-card",
          drag: "text",
          btn: "text",
        };
        uploadOp.listType = listType[props.type];
      }

      uploadOp.showFileList = props.showFileList || props.type !== "plus";
      uploadTips.value = `最多上传${props.limit}个文件`;
    };

    /* 文件上传前校验 */
    const validate = (file) => {
      if (fileOp.list.length >= props.limit) {
        instance.$message.error(uploadTips.value);
        return false;
      } else {
        return true;
      }
    };

    /* 上传前校验图片格式、大小 */
    const beforeUpload = (file) => {
      emit("beforeUpload", { file, list: fileOp.list });
      if (!validate(file)) {
        return false;
      }
      if (
        !uploadOp.accept
          .split(",")
          .some((suffix) => file.name.endsWith(suffix))
      ) {
        instance.$message.error(`文件类型错误`);
        return false;
      }
      if (file.size > props.size * 1024 * 1024) {
        instance.$message.error(`上传图片大小不能超过 ${props.size}MB!`);
        return false;
      }
      loading.value = true;
      return true;
    };

    /* 成功回调 */
    const onSuccess = (response, file, fileList) => {
      loading.value = false;
      if (!validate(file)) {
        return false;
      }
      if (response.code === "00000") {
        response.data.list.forEach((item) => {
          fileOp.list.push(item);
        });
        emit("onSuccess", { response, file, fileList, list: fileOp.list },{});
      } else {
        instance.$message.error(`上传失败`);
        // 删除文件列表对应的数据
        let uploadFiles = uploadRef.value.uploadFiles;
        let lastIndex = uploadFiles.lastIndexOf(
          (item) => item.name === file.name
        );
        uploadFiles.splice(lastIndex, 1);
      }
    };

    const onError = (err, file, fileList) => {
      loading.value = false;
      emit("onSuccess", { err, file, fileList, list: fileOp.list });
    };

    /* PDF预览 */
    const pdfViewer = ref(null);
    const showPdfView = (url) => {
      pdfUrl.value = url;
      pdfViewer.value.show();
    };

    /* 图片预览事件 */
    const openViewer = (file) => {
      if (file.fileUrl.endsWith(".pdf")) {
        showPdfView(file.fileUrl);
      } else if (
        [".txt", ".doc", ".docx", ".xlsx", ".xls", ".zip", ".rar"].some(
          (suffix) => file.fileUrl.endsWith(suffix)
        )
      ) {
        downloadFile(file);
      } else {
        console.log(" 图片预览");
      }
    };

    const downloadFile = (file) => {
      if ((window).fetch) {
        fetch(file.fileUrl)
          .then((res) => res.blob())
          .then((blob) => {
            let a = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = file.fileName;
            a.click();
          });
      } else {
        let a = document.createElement("a");
        a.href = file.fileUrl;
        a.target = "_blank";
        a.download = file.fileName;
        a.click();
      }
    };

    /* 文件删除事件 */
    const deleteItem = (file) => {
      let uploadFiles = uploadRef.value.uploadFiles;
      let lastIndex = uploadFiles.lastIndexOf(
        (item) => item?.response?.data?.list[0]?.fileUrl === file.fileUrl
      );
      uploadFiles.splice(lastIndex, 1);
      fileOp.list = fileOp.list.filter(
        (item) => item.fileUrl !== file.fileUrl
      );
    };

    const imgSrc = (url) => {
      if (url.endsWith(".pdf")) {
        return pdfImg;
      } else if (url.endsWith(".doc") || url.endsWith(".docx")) {
        return wordImg;
      } else if (url.endsWith(".txt")) {
        return txtImg;
      } else if (url.endsWith(".xlsx") || url.endsWith(".xls")) {
        return excelImg;
      } else {
        return url;
      }
    };

    const onPreview = (file) => {
      if (file.id) {
        request.get(`/file/file/load/${file.id}`);
      }
    };
    const onRemove = (file, fileList) => {
      emit("onRemove", { file, fileList, list: fileOp.list });
      if (file.response?.data) {
        deleteItem(file.response?.data?.list[0]);
      } else if (file.fileId) {
        deleteItem(file);
      }
    };
    const onProgress = (event, file, fileList) => {
      emit("onProgress", { event, file, fileList, list: fileOp.list });
    };
    const onChange = (file, fileList) => {
      emit("onChange", { file, fileList, list: fileOp.list });
    };
    const onExceed = (files, fileList) => {
      emit("onExceed", { files, fileList, list: fileOp.list });
    };

    return {
      uploadRef,
      loading,
      hoverIndex,
      hideUploadBtn,
      uploadTips,
      pdfUrl,
      pdfViewer,
      fileOp,
      uploadOp,
      showUploadImageViewer,
      imgSrc,
      openViewer,
      deleteItem,
      onPreview,
      onRemove,
      onSuccess,
      onError,
      onProgress,
      onChange,
      onExceed,
      beforeUpload,
    };
  },
});
</script>

<style lang="scss">
.zhqc-upload {
  .upload-image {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    z-index: 20110;
    .el-upload--picture-card {
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      line-height: 100px;
      vertical-align: top;
    }
    .hide .el-upload--picture-card {
      display: none;
    }

    .drag {
      width: 100%;
      .el-upload {
        width: inherit;
        .el-upload-dragger {
          width: inherit;
          height: 120px;
        }
      }
      .el-icon--upload {
        margin-top: 10px;
        font-size: 32px;
        color: #0394ff;
        i {
          font-size: inherit;
        }
      }
      .el-upload-list {
        .el-upload-list__item {
          .el-upload-list__item-name {
            text-align: left;
          }
        }
      }
    }
  }
  .image-item {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 1;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    border-radius: 10px;
  }

  .image-layer {
    display: flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    flex-direction: row;
    i {
      margin-right: 6px;
      margin-left: 6px;
      cursor: pointer;
    }
  }

  .image-item-none {
    display: none;
  }

  .upload-image-viewer {
    display: flex;
    flex-wrap: wrap;
  }
  .upload-image-viewer-hover {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
  }

  .image-item-img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .upload-tips {
    color: #606266;
  }
}
</style>
