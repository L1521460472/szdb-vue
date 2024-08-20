<template>
  <el-select
    ref="refSelect"
    :popper-class="optionFieldList.length && list.length ? 'remote_select' : ''"
    v-model="model[selectKey]"
    placeholder="请输入"
    :loading="loading"
    filterable
    remote
    reserve-keyword
    :filter-method="remoteMethod"
    :clearable="clearable"
    :disabled="disabled"
    @focus="focus"
    @blur="blur"
    @change="selectItem"
    @clear="clear"
  >
    <el-option
      value=""
      :class="['option_first', { blck: optionFieldList.length && list.length }]"
      v-if="optionFieldList.length && list.length"
    >
      <p v-for="(item, index) in optionFieldList" :key="index">
        {{ item.label }}
      </p>
    </el-option>
    <el-option
      v-for="item in list"
      :key="item[code]"
      :label="item[label]"
      :value="item[code]"
    >
      <!-- <slot :item="item"></slot> -->
      <template v-if="optionFieldList.length">
        <p v-for="(v, i) in optionFieldList" :key="i" :title="item[v.field]">
          {{ item[v.field] || "-" }}
        </p>
      </template>
      <span v-if="!list.length">无数据</span>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import {
  ref,
  watch,
  defineComponent,
  reactive,
  PropType,
  onMounted,
} from "vue";
import service from "@/utils/request";
import { json } from "stream/consumers";
interface obj {
  [propName: string]: any;
}
export default defineComponent({
  props: {
    selectKey: {
      // 绑定数据的key
      type: String,
      default: "",
    },
    label: {
      // 下拉列表显示的字段
      type: String,
      default: "name",
    },
    code: {
      // 下拉列表与selectKey对应的字段
      type: String,
      default: "id",
    },
    defaultList: {
      // 默认数据
      type: Array as PropType<obj>,
      default: () => [],
    },
    optionFieldList: {
      // 下拉列表类表格配置
      type: Array as PropType<obj>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object as PropType<obj>,
      default: () => {},
    },
    paramsCode: {
      type: [Array, String],
      default: "name",
    },
    params: {
      type: String,
      default: "",
    },
    defaultParams: {
      type: Object as PropType<obj>,
      default: () => {},
    },
    listUrl: {
      type: String,
      default: "",
    },
    httpMethod: {
      type: String,
      default: "post",
    },
    isConsumables: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const value = ref(null);
    const list = ref<obj>(props.defaultList);
    const arr = ref<obj>(props.defaultList);
    const loading = ref(false);
    const hasRequest = ref(false);
    /**
     * 查询数据
     * @param queryText 查询文本
     * @returns {Promise<any>}
     */
    function getList(queryText?: string) {
      if (hasRequest.value || !props.listUrl) return;
      loading.value = true;
      return new Promise((resolve, reject) => {
        listApi(queryText)
          .then((res: any) => {
            if (res) {
              hasRequest.value = true;
              list.value = res || [];
              arr.value = res || [];
              resolve(res);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          })
          .finally(() => {
            loading.value = false;
          });
      });
    }
    /**
     * 列表查询接口
     * @param queryText 查询文本
     */
    async function listApi(queryText?: string) {
      // 只查启用状态的数据
      let data:any = {
        conditionList: [
          {
            prop: "enable",
            operate: "eq",
            value: true,
            valueType: "Boolean",
          },
        ],
      };
      if(props.listUrl =='foundation/cityEnCn/listQuery') {
        data.conditionList.push(
          {
            prop: "countryCode2",
            operate: "like",
            value: props.params,
            valueType: "",
          }
        )
      }
      if(props.listUrl =='foundation/cityEnCn/countrys') {
        return service['get'](props.listUrl);
      }
      if (props.defaultParams) {
        if (props.defaultParams.paymentType) {
          let param = {
            ...props.defaultParams,
            isAccountingEntityCodeGroup: false,
            isSettleUnitCodeGroup: true,
          };
          let arr = <any>[];
          let res:any = await service['post'](props.listUrl, param);
          if (res) {
            arr = res.map((item:any)=>{
              item.name = item.settleUnitName
              item.code = item.settleUnitCode
              return item;
            })
          }
          return arr || [];
        }
        if (props.defaultParams.measureUnit) {
          let arr = <any>[];
          let res:any = await service[props.httpMethod](props.listUrl, data);
          if(res) { 
            arr = res.map((item:any)=>{
              item.name = item.unitName;
              return item;
            })
          }
          return arr;
        }
      }
      return service[props.httpMethod](props.listUrl, data);
    }
    /**
     * 选中下拉项
     * @param value
     */
    function selectItem(value: any) {
      // 将空字符串转为null TODO
      // props.model[props.selectKey] = value === "" ? " " : value;
      props.model[props.selectKey] = value;
      if (list.value && value && value.length) {
        for (let i = 0; i < list.value.length; i++) {
          // if (list.value[i][props.code] === value) {
          // 兼容多选
          if (value.includes(list.value[i][props.code])) {
            emit("select", list.value[i], value);
          }
        }
      } else {
        emit("select", {}, null);
      }
    }
    /**
     * 获得焦点
     */
    function focus() {
      getList();
    }
    function blur(event: any) {
      if(event.value =='') {
        list.value = arr.value;
      }
    }
    /**
     * 清空数据
     */
    function clear() {
      props.model[props.selectKey] = "";
      list.value = arr.value;
      emit("select", {}, null);
    }
    function remoteMethod(val: string){
      if(!val) return list.value = arr.value;
      list.value = arr.value.filter((item:any) => {
        // console.log(val)
        if(item.code){
          if (!!~item.code.indexOf(val) || !!~item.code.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }
        if(item.name){
          if (!!~item.name.indexOf(val) || !!~item.name.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }
        if(item.cnName){
          if (!!~item.cnName.indexOf(val) || !!~item.cnName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }

        if(item.portZhName){
          if (!!~item.portZhName.indexOf(val) || !!~item.portZhName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }
        if(item.portEnName){
          if (!!~item.portEnName.indexOf(val) || !!~item.portEnName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }
      })
    }
    watch(
      () => props.paramsCode,
      (val) => {
        if (typeof val === "string") {
          return false;
        } else {
          getList();
        }
      }
    );
    watch(
      () => props.params,
      (val) => {
        if (val) {
          hasRequest.value = false;
          getList();
        }
      }
    );
    return {
      value,
      list,
      loading,
      getList,
      listApi,
      focus,
      clear,
      selectItem,
      remoteMethod,
      blur
    };
  },
});
</script>
<style lang="scss">
.remote_select {
  &.el-popper[data-popper-placement^="bottom"] > .el-popper__arrow::before {
    border-color: #f4f4f4;
    background: #f4f4f4;
  }
  .el-select-dropdown__list {
    display: table;
    width: 100%;
    margin: 0 !important;
    .el-select-dropdown__item {
      display: table-row;
      height: 30px;
      line-height: 30px;
      p {
        display: table-cell;
        padding: 0 6px;
        border-top: 1px solid #f4f4f4;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .option_first {
      color: #333;
      background-color: #f4f4f4;
      position: sticky;
      top: 0;
      z-index: 1;
      &.blck {
        display: table-row !important;
      }
    }
  }
}
</style>
