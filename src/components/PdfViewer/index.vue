<!--
 * @Description: 
 * @Version: 1.0.0
 * @Author: tyl
 * @Date: 2021-12-21 18:06:40
 * @LastEditors: tyl
 * @LastEditTime: 2021-12-21 18:31:47
-->
<template>
  <transition v-if="visible" name="fade">
    <div class="pdf-reader" @click.self="close">
      <embed
        type="application/pdf"
        width="100%"
        height="80%"
        hidden="false"
        :src="url"
        @click="stopPropagation(event)"
      />
    </div>
  </transition>
</template>

<script>
import { ref, defineComponent, nextTick } from "vue"

export default defineComponent({
  name: "ZhqcPdfViewer",
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const instance = getCurrentInstance()?.proxy;

    const visible = ref(false)

    const show = () => {
      nextTick(() => {
        document.body.appendChild(instance.$el)
      })
      visible.value = true
    }

    const close = () => {
      visible.value = false;
    }

    return {
      visible,
      show,
      close
    }
  }
})
</script>

<style lang="scss" scoped>
.pdf-reader {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  z-index: 33333;
  embed {
    display: block !important;
    margin: auto;
    width: 70%;
    height: 100%;
    overflow: auto;
    background: transparent;
  }
}
</style>
