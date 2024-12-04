<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button circle icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button circle icon="Menu" @click="showColumn()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="推送列" placement="top" v-if="columnsTs">
        <!-- <el-button circle icon="Menu" @click="showColumn1()" /> -->
        <el-popover placement="right" :width="200" trigger="click">
          <template #reference>
            <el-button circle icon="Menu" />
          </template>
          <span>推送字段</span>
          <div style="display: flex;flex-direction: column;">
            <el-checkbox v-model="item.visible" :label="item.label" v-for="(item,index) in columnsTs" :key="index" @change="handleChangeColumn(item.visible,item.key)" />
          </div>
        </el-popover>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="平铺" placement="top" v-if="grid">
        <el-button circle icon="Grid" @click="showType('grid')" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="表格" placement="top" v-if="grid">
        <el-button circle icon="Expand" @click="showType('table')" />
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
    <el-dialog :title="title1" v-model="open1" append-to-body width="200">
      <div style="display: flex;flex-direction: column;">
        <el-checkbox :model="item.key" :label="item.label" v-for="(item,index) in columnsTs" :key="index" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,  getCurrentInstance, defineProps} from "vue";
import { getAddColumn,getDeleteColumn } from "@/api/personnel/attendanceReport";
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Array,
  },
  columnsTs: {
    type: Array,
  },
  search: {
    type: Boolean,
    default: true,
  },
  grid: {
    type: Boolean,
    default: false,
  },
  gutter: {
    type: Number,
    default: 10,
  },
})
const instance = getCurrentInstance()?.proxy;
const emits = defineEmits(['update:showSearch', 'queryTable','showType']);

// 显隐数据
const value = ref([]);
// 弹出层标题
const title = ref("显示/隐藏");
const title1 = ref("推送");
// 是否显示弹出层
const open = ref(false);
const open1 = ref(false);

const style = computed(() => {
  const ret = {};
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`;
  }
  return ret;
});

// 搜索
function toggleSearch() {
  emits("update:showSearch", !props.showSearch);
}

// 刷新
function refresh() {
  emits("queryTable");
}
// 表格或平铺
function showType(val) {
  emits("showType",val);
}

// 右侧列表元素变化
function dataChange(data) {
  for (let item in props.columns) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
}

// 打开显隐列dialog
function showColumn() {
  open.value = true;
}
// 打开显隐列dialog
function showColumn1() {
  open1.value = true;
}
// 推送
function handleChangeColumn(val,val1) {
  if(val){
    getAddColumn(val1).then(res=>{
      console.log(res)
      emits("getColumnList");
      instance.$modal.msgSuccess("添加成功");
    })
  }else{
    getDeleteColumn(val1).then(res=>{
      console.log(res)
      emits("getColumnList");
      instance.$modal.msgSuccess("删除成功");
    })
  }
}

// 显隐列初始默认隐藏列
for (let item in props.columns) {
  if (props.columns[item].visible === false) {
    value.value.push(parseInt(item));
  }
}
</script>

<style lang='scss' scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0px;
}
:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}

.my-el-transfer {
  text-align: center;
}
</style>