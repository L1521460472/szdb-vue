<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2022-11-07 17:28:38
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-02-14 19:39:34
-->
<template>
  <div class="grid_item" :class="{ zhqc_layout_screen: layoutScreen }" ref="echart">
    <!-- <div class="date_input">
      
      <zhqc-form v-model:refObj="formInfo2.ref" :data="formInfo2.data" :field-list="formInfo2.fieldList" :label-width="'0'" :list-type-info="listTypeInfo" :span="formInfo2.span"
        @handleEvent="handleEvent" />
       <i
        class="icon"
        :class="[
          'xh-iconfont',
          layoutScreen ? 'xh-icon-narrow' : 'xh-icon-enlarge',
        ]"
        @click="handleLayou"
      ></i>
    </div> -->
    <!-- <el-row :gutter="0" style="width: 100%; height: 100%">
      <el-col :span="24" style="width: 100%; height: 100%">
        
      </el-col>
    </el-row> -->
    <div :id="lineChartId" :style="{width: layoutScreen? '100%' : '100%' , height: layoutScreen ? '100%' : '100%'}"></div>
  </div>
</template>
<script lang="ts">
import * as echarts from "echarts";
// import { Nullable } from "element-plus/es/utils/types";
import {ref,reactive, onBeforeMount,onMounted,withDefaults,getCurrentInstance,PropType,markRaw,defineComponent,watch} from "vue";
// import { getWeeks } from "../../../utils/index";
// import { getShipLinePriceTendencyCount } from "../api/index";

type EChartsOption = echarts.EChartsOption;
interface IProps {
    lineChartId?: string,
    option?: any,
    title?: string,
    search1:boolean,
    search2:boolean,
    search3:boolean,
    search4:boolean,
    yAxisName?: string,
    seriesType?: string,
    legendData?: any[],
    xAxisData?: any[],
    seriesData?: any[],
  }
  interface obj {
  [propName: string]: any;
}

  export default defineComponent({
    props : {
      lineChartId: {
        type: String,
        default: 'lineChart'
      },
      option: {
        type: Object as PropType<obj>,
        default: () => {},
      },
      title: {
        type: String,
        default: ''
      },
      search1: {
        type: Boolean,
        default: false
      },
      search2: {
        type: Boolean,
        default: false
      },
      search3: {
        type: Boolean,
        default: false
      },
      search4: {
        type: Boolean,
        default: false
      },
      yAxisName: {
        type: String,
        default: ''
      },
      seriesType: {
        type: String,
        default: 'line'
      },
      legendData: {
        type: Array as PropType<obj>,
        default: () => [],
      },
      xAxisData: {
        type: Array as PropType<obj>,
        default: () => [],
      },
      seriesData: {
        type: Array as PropType<obj>,
        default: () => [],
      },
    },
    emits:["change"],
  setup(props, { emit }){
    const instance: any = getCurrentInstance()?.proxy;
    let option: EChartsOption | any;
    const layoutScreen = ref(false);
    option = props.option
    const chartRef:any = ref(null);
    const handleLayou = () => {
      layoutScreen.value = !layoutScreen.value
      setTimeout(() => {
        chartRef.value.resize()
      }, 100);
    };

    const init = ()=>{
      const chartDom = document.getElementById(props.lineChartId)!;
      chartRef.value = markRaw(echarts.init(chartDom));
      setTimeout(() => {
        chartRef.value.setOption(option);
      }, 100);
      setTimeout(() => {
        chartRef.value.resize()
      }, 200);
    }
    onBeforeMount(()=>{
    });

    onMounted(() => {
      // emit('change')
    })
    const handleEvent = (event: string, dada: any, item: any) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };

    return {
      chartRef,
      option,
      layoutScreen,
      handleLayou,
      init,
      handleEvent,
    }
    
  }
})

</script>

<style lang="scss" scoped>
.date_input {
  padding: 10px 6px;
  display: flex;
  justify-content: space-between;
  :deep(.el-range-editor) {
    width: 200px;
  }
  :deep(.el-tabs__header) {
    margin: 0;
    .el-tabs__item {
      height: 28px;
      line-height: 28px;
      padding-left: 0;
      padding-right: 12px;
      font-size: 12px;
      &:last-child {
        padding-right: 0;
      }
    }
    .el-tabs__active-bar,
    .el-tabs__nav-wrap::after {
      display: none;
    }
  }
  .icon{
    color: #999999;
    cursor: pointer;
    // margin-left: 10px;
  }
  .zhqc_form :deep(.el-form-item--mini.el-form-item), .zhqc_form :deep(.el-form-item){
    margin-bottom: 5px !important;
    
  }
  .zhqc_form :deep(.el-form-item){
    margin-right: 10px;
    // margin-bottom: 5px;
  }
  .zhqc_form :deep(.el-form-item__label){
    display: none;
  }
}
</style>
