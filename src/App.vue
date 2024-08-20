<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-04-10 16:49:16
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-12-19 09:38:33
-->
<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-04-10 16:49:16
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-12-19 09:32:36
-->
<template>
  <div id="watermarkapp" style="width: 100%;height: 100%;" ref="parentRef">
    <router-view />
  </div>
</template>

<script setup>
import { ref, watch,getCurrentInstance, onMounted, onUnmounted,onBeforeUnmount } from 'vue';

import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import useUserStore from '@/store/modules/user'

import useWatermarkBg from '@/utils/watermark'
import {formatDate} from '@/utils/index'
// 定义一些基本的属性（ 如果说你想开发的更加完善，可以加入更多的属性来适应你的要求 ）
const props = defineProps({
  text: { // 传入水印的文本
    type: String,
    // required: true,
    default: 'watermark',
  },
  fontSize: { // 字体的大小
    type: Number,
    default: 40,
  },
  gap: { // 水印重复的间隔
    type: Number,
    default: 20,
  },
});
const userStore = useUserStore()
const instance = getCurrentInstance().proxy;
const userName = localStorage.getItem('dbUserName')
const timerTime = ref(null)

// useWatermarkBg 函数用来创建一个 canvas 图片
// 将属性传递进去就返回个创建好的对象
// 声明一个 ref 并添加到父元素上
const parentRef = ref(null);
watch(() =>userStore.flag,(val,oldVal) =>{
  if(val){
    timerTime.value = setInterval(() => {
      const water = document.getElementById('watermark888')
      if(water){
        water.parentNode.removeChild(water)
      }
      watermark()
    }, 1000);
  }else{
    const water = document.getElementById('watermark888')
    if(water){
      water.parentNode.removeChild(water)
    }
    if(timerTime.value){
      clearInterval(timerTime.value)
    }
  }
})

onMounted(() => {
  // watermark()
});


const watermark = ()=>{
  if (!parentRef.value) {
    return;
  }
  const div = document.createElement('div');
  const bg = ref(useWatermarkBg({
    text: userName + ' ' + formatDate(new Date()),
    fontSize: 20,
    gap: 0
  }))
  const { base64, styleSize } = bg.value;
  div.id = 'watermark888'
  div.style.backgroundImage = `url(${base64})`;
  div.style.backgroundSize = `${styleSize}px ${styleSize}px`;
  div.style.backgroundRepeat = 'repeat';
  div.style.inset = 0;
  div.style.zIndex = 9999;
  // 设置绝对定位
  div.style.position = 'absolute';
  // 设置点击穿漏，防止底部元素失去鼠标事件的交互
  div.style.pointerEvents = 'none';
  parentRef.value.appendChild(div);
}

</script>
