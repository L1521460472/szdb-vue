<template>
  <el-dialog
    class="my-dialog"
    v-model="visibility"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    @closed="closed"
  >
    <slot />
    <template #footer v-if="btnList.length">
      <span class="dialog-footer">
        <template v-for="(item, index) in btnList">
          <el-button
            v-if="item.show"
            :key="index"
            :type="item.type"
            :icon="item.icon"
            :disabled="item.disabled"
            :loading="item.loading"
            @click="handleClick(item.event)"
          >
            {{ item.label }}
          </el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script setup  name="Dialog">

const props = defineProps({
  visible: false,
  title: "",
  width: "30%",
  btnList: {
      type: Array,
      default: () => [],
    },
  closeOnClickModal: false,
});

let visibility = ref(false);
watch(
  () => props.visible,
  (val) => {
    visibility.value = val;
  },
  { immediate: true }
);

/**
 * @description: 事件注册
 */
const emit = defineEmits(["handleClick", "closed"]);

/**
 * @description: 立即执行防抖
 */
const debounce = (fn, wait) => {
  let timer = null;
  return (args) => {
    if (timer) clearTimeout(timer);
    const callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    if (callNow) fn(args);
  };
};

/**
 * @description: 统一派发事件
 * @param {*} event
 */
const handleClick = debounce((event) => {
  emit("handleClick", event);
}, 1000);

/**
 * @description: 弹框右上角关闭按钮事件
 */
const closed = () => {
  emit("closed");
};
</script>

<style lang="scss">
.my-dialog {
  &.el-dialog {
    border-radius: 4px;
    overflow: hidden;
  }
  .el-dialog__header {
    padding: 0 15px 0 15px;
    height: 42px;
    line-height: 42px;
    box-sizing: border-box;
    // background: linear-gradient(to right, #0394ff, #26afff);
    box-shadow: 0 2px 5px rgba(39, 70, 112, 0.07);
    // background: #f4f4f4;
    .el-dialog__title {
      font-size: 14px;
      // color: #fff;
      color: #070203;
    }
    .el-dialog__headerbtn {
      top: 0px;
      right: 15px;
      .el-dialog__close {
        // color: #fff;
        color: #070203;
        &:hover {
          // color: #409eff;
        }
      }
    }
  }
  .el-dialog__body {
    padding: 15px 15px 12px 15px;
    .el-form-item--mini {
      &.el-form-item {
        margin-bottom: 12px;
      }
    }
  }
  .el-dialog__footer {
    padding: 0 12px;
    height: 48px;
    line-height: 48px;
    // background: #f4f4f4;
  }
}
</style>