<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-04 10:54:09
-->
<template>
  <div class="app-container">
    <div class="box">
      <div><el-button style="float: right;margin-bottom: 10px;" type="primary" plain icon="Edit" @click="handleDisabled">编辑</el-button></div>
      <div class="box-text">
        <el-input
          :readonly="disabled"
          v-model="textareaValue"
          type="textarea"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script name="Rules">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;

    /* 事件回调统一处理 */
    const handleClick = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };
    const handleEvent = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };

    return {
      handleClick,
      handleEvent,
      ...mainForm(instance),
      ...mainTable(instance),
      ...baseDialog(instance),
    }
  }
})

</script>

<style scoped lang="scss">
.box{
  height: calc(100vh - 124px);
  display: flex;
  flex-direction: column;
  .box-text{
    flex: 1;
    overflow-y: auto;
    .el-textarea{
      height: 100%;
      :deep(.el-textarea__inner){
        height: 100%;
      }
    }
  }
}
</style>

