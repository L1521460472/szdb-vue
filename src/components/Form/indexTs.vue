<template>
  <el-form
    class="my_form"
    ref="formRef"
    :model="data"
    :rules="rules"
    :class="className"
    :disabled="disabled"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <el-row>
      <template v-for="item in getConfigList()" :key="item.value">
        <template v-if="item.type === 'formSlot'">
          <slot :name="'formSlot-' + item.value" :item="item" />
        </template>
        <el-col v-else :span="item.span || span">
          <el-form-item
            :prop="item.value"
            :label="item.label"
            :label-width="item.labelWidth"
            :class="[
              item.className,
              {
                multiple_item: item.multiple,
                'no-label': [-1, '0', '0px'].includes(item.labelWidth),
              },
            ]"
          >
            <template #label>
              <el-tooltip class="item" :content="item.label" placement="top"  tabindex="-1">
                <span class="form_label" tabindex="-1">{{ item.label }}</span>
              </el-tooltip>
            </template>
            <template #label v-if="item.labelSlot">
              <slot :name="'formLabel-' + item.value" :item="item" />
            </template>
            <!-- 具名插槽 -->
            <template v-if="item.type === 'slot'">
              <slot :name="'form-' + item.value" :item="item" />
            </template>
            <span v-else-if="formType === 'views' || item.type === 'views'">{{
              data[item.value]
            }}</span>
            <!-- input、password、textarea输入框、 -->
            <!-- <el-input
              v-if="
                ['input', 'password', 'text', 'textarea'].includes(item.type)
              "
              v-model.trim="data[item.value]"
              :size="item.size"
              :type="item.type"
              :prefix-icon="item.prefixIcon"
              :suffix-icon="item.suffixIcon"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :maxlength="item.maxlength"
              :show-word-limit="item.showWordLimit"
              :clearable="item.clearable === false ? item.clearable : true"
              :placeholder="getPlaceholder(item)"
              @focus="handleEvent(item.events?.focus)"
              @blur="handleEvent(item.events?.blur)"
              @input="handleEvent(item.events?.input)"
              @clear="handleEvent(item.events?.clear)"
            >
              <template v-if="item.prepend" #prepend>{{
                item.prepend
              }}</template>
              <template v-if="item.append" #append>{{ item.append }}</template>
            </el-input> -->
            <el-input
              v-if="
                ['input', 'password', 'text', 'textarea'].includes(item.type)
              "
              v-model="data[item.value]"
              :size="item.size"
              :type="item.type"
              :prefix-icon="item.prefixIcon"
              :suffix-icon="item.suffixIcon"
              :readonly="item.readonly"
              :disabled="item.disabled"
              :maxlength="item.maxlength"
              :show-word-limit="item.showWordLimit"
              :clearable="item.clearable === false ? item.clearable : true"
              :placeholder="getPlaceholder(item)"
              @focus="handleEvent(item.events?.focus)"
              @blur="handleEvent(item.events?.blur)"
              @input="handleEvent(item.events?.input)"
              @clear="handleEvent(item.events?.clear)"
            >
              <!--      input 中前置或者后置内容     -->
              <template v-if="item.prepend" #prepend>{{
                item.prepend
              }}</template>
              <template v-if="item.append" #append>{{ item.append }}</template>
            </el-input>
            <!-- 数字输入框 -->
            <el-input
              v-if="item.type === 'numeral'"
              v-model="data[item.value]"
              type="text"
              :size="item.size"
              :inline="true"
              :disabled="item.disabled"
              :clearable="item.clearable === false ? item.clearable : true"
              :placeholder="getPlaceholder(item)"
              oninput="value=value.replace(/[^\d^\.]/g, '').replace(/^\.|^\-/g, '').replace(/^[0][0-9]/, Number(this.value))"
              @focus="handleEvent(item.events?.focus)"
              @blur="handleEvent(item.events?.blur)"
              @input="handleEvent(item.events?.input)"
              @clear="handleEvent(item.events?.clear)"
            >
              <template v-if="item.append" #append>{{ item.append }}</template>
            </el-input>
            <!-- 计数器 -->
            <el-input-number
              v-if="item.type === 'number'"
              v-model="data[item.value]"
              :size="item.size"
              :min="item.min"
              :max="item.max"
              :step="item.step"
              :disabled="item.disabled"
              :precision="item.precision"
              @change="handleEvent(item.events?.change)"
            />
            <!-- 选择器 -->
            <el-select
              v-if="item.type === 'select'"
              :size="item.size"
              v-model="data[item.value]"
              :disabled="item.disabled"
              :clearable="item.clearable === false ? item.clearable : true"
              :filterable="item.filterable"
              :multiple="item.multiple"
              :collapse-tags="item.collapsetags"
              :placeholder="getPlaceholder(item, data[item.value])"
              @change="handleEvent(item.events?.change, data[item.value], item)"
              @clear="handleEvent(item.events?.clear, data[item.value], item)"
            >
              <el-option
                v-for="(childItem, childIndex) in listTypeInfo[item.list]"
                :key="childIndex"
                :label="childItem.key"
                :value="childItem.value"
                :disabled="childItem.disabled"
              />
            </el-select>
            <!-- 远程搜索框 -->
            <remote-select
              v-if="item.type === 'remoteSelect'"
              :model="data"
              :select-key="item.value"
              :code="item.code"
              :label="item.labelField"
              :httpMethod="item.httpMethod"
              :list-url="item.url"
              :params="item.params"
              :default-list="listTypeInfo[item.list]"
              :optionFieldList="item.optionFieldList"
              :disabled="item.disabled"
              :multiple="item.multiple === true"
              :clearable="item.clearable === false ? item.clearable : true"
              @select="selectEvent($event, item, data)"
            >
              <!-- @select="handleEvent(item.events?.select, data[item.value], item)" -->
            </remote-select>
            <!-- 级联选择器 -->
            <el-cascader
              v-if="item.type === 'cascader'"
              v-model="data[item.value]"
              :size="item.size"
              :clearable="item.clearable === false ? item.clearable : true"
              :options="listTypeInfo[item.list]"
              :placeholder="getPlaceholder(item)"
              @change="handleEvent(item.events?.change, data[item.value], item)"
            />
            <!-- 日期选择器 -->
            <el-date-picker
              v-if="
                [
                  'year',
                  'month',
                  'date',
                  'datetime',
                  'week',
                  'datetimerange',
                  'daterange',
                ].includes(item.type)
              "
              v-model="data[item.value]"
              :size="item.size"
              :type="item.type"
              :clearable="item.clearable === false ? item.clearable : true"
              :disabled="item.disabled"
              :format="item.format || getDateFormat(item)"
              :value-format="item.valueFormat || getValueFormat(item)"
              :placeholder="getPlaceholder(item)"
              @focus="handleEvent(item.events?.focus)"
              @change="handleEvent(item.events?.change)"
            />
            <!-- 多选框 -->
            <el-checkbox-group
              v-if="item.type === 'checkbox'"
              v-model="data[item.value]"
            >
              <el-checkbox
                v-for="el in listTypeInfo[item.list]"
                :key="el.value"
                :label="el.value"
                :disabled="el.disabled"
                >{{ el.key }}
              </el-checkbox>
            </el-checkbox-group>
            <!-- 单选框 -->
            <el-radio-group
              v-if="item.type === 'radio'"
              v-model="data[item.value]"
              :disabled="item.disabled"
              @change="handleEvent(item.events?.change, data[item.value], item)"
            >
              <el-radio
                v-for="(el, idx) in listTypeInfo[item.list]"
                :key="el.value"
                :label="el.value"
              >
                {{ el.key }}
              </el-radio>
            </el-radio-group>
            <!-- 开关 -->
            <el-switch
              v-if="item.type === 'switch'"
              v-model="data[item.value]"
              :disabled="item.disabled"
              :active-text="item.actext"
              :inactive-text="item.intext"
              @change="handleEvent(item.events?.change)"
            />
            <!-- 按钮 -->
            <el-button
              v-if="item.type === 'button'"
              :type="item.btType"
              plain
              :icon="item.icon"
              :disabled="item.disabled"
              :loading="item.loading"
              @click="handleEvent(item.events?.click)"
            >
              {{ item.btnlabel }}
            </el-button>

            <el-dropdown v-else-if="item.type === 'dropdowns'">
              <el-button>
                {{ item.label }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(el, idx) in item.list"
                    :key="idx"
                    type="text"
                    @click="handleEvent(el.event, el)"
                    >{{ el.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <div v-if="item.multiple?.value1" class="multiple_input">
              <el-input
                v-if="item.multiple.value1"
                v-model="data[item.multiple.value1]"
                :size="item.size"
                type="input"
                :disabled="true"
              />
              <el-input
                v-if="item.multiple.value2"
                v-model="data[item.multiple.value2]"
                :size="item.size"
                type="input"
                :disabled="true"
              />
            </div>
            <i
              v-if="item.appendIcon"
              class="append_icon"
              :class="item.appendIcon?.icon"
              @click="handleEvent(item.appendIcon?.click, data)"
            ></i>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, withDefaults } from "vue";
import RemoteSelect from "../RemoteSelect/index.vue";

interface IProps {
  className?: string;
  formType?: string;
  data: Record<string, any>;
  fieldList: any[];
  rules?: Record<string, any>;
  listTypeInfo?: Record<string, any>;
  labelWidth?: string;
  labelPosition?: string;
  span?: number;
  disabled?: boolean;
  refObj?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  className: "",
  formType: "",
  data: () => ({}),
  fieldList: () => [],
  rules: () => ({}),
  listTypeInfo: () => ({}),
  labelWidth: "120px",
  span: 24,
  disabled: false,
  refObj: null,
});

/**
 * @description: 事件注册
 */
const emit = defineEmits(["update:refObj", "handleEvent"]);
const formRef = ref(null);
onMounted(() => {
  emit("update:refObj", formRef.value);
});

/**
 * @description: 获取字段列表
 */
const getConfigList = () => {
  return props.fieldList.filter(
    (item: any) =>
      !item.hasOwnProperty("show") || (item.hasOwnProperty("show") && item.show)
  );
};

let tmpList: string[] = [];
const selectEvent = (event: any, item: any, data: any) => {
  if(data.countryCode){
    if(data.cityCode){
      data.cityCode = null
      data.cityEnName = null
      data.cityZhName = null
    }
  }
  if (Object.prototype.toString.call(item.multiple) === "[object Object]") {
    data[item.multiple.value1] = event[item.optionFieldList[1].field];
    data[item.multiple.value2] = event[item.optionFieldList[2].field];
  }
  if (item.labelValues && item.labelValues.length) {
    item.labelValues.forEach((val: any) => {
      if (
        Object.prototype.toString.call(item.multiple) === "[object Boolean]"
      ) {
        // 多选
        if (event[val.value]) {
          tmpList.push(event[val.value]);
          data[val.label] = [...new Set(tmpList)];
          tmpList = data[val.label];
        } else {
          data[val.label] = [];
          tmpList = [];
        }
      } else {
        data[val.label] = event[val.value || "name"];
      }
    });
  }
  if (item.events) {
    emit("handleEvent", item.events?.select, event);
  }
};

/**
 * @description: 时间组件显示数据格式  format
 * @param {*} item 表单项数据
 */
const getDateFormat = (item: any) => {
  let format = "";
  if (["datetime", "datetimerange"].includes(item.type)) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = "YYYY-MM-DD";
  }
  return format;
};

/**
 * @description: 时间组件返回值格式  valueFormat
 * @param {*} item 表单项数据
 */
const getValueFormat = (item: any) => {
  let valueFormat = "";
  if (["date", "datetime", "daterange", "datetimerange"].includes(item.type)) {
    valueFormat = "YYYY-MM-DD HH:mm:ss";
  } else {
    valueFormat = item.valueFormat || "";
  }
  return valueFormat;
};

/**
 * @description: 获取表单项的placeholder
 * @param {*} item 表单项数据
 */
const getPlaceholder = (item: any, data?: any) => {
  let placeholder = "";
  if (props.formType !== "view") {
    if (["input", "password", "textarea", "numeral"].includes(item.type)) {
      placeholder = "请输入" + (item.label || "");
    } else if (["select", "cascader", "date"].includes(item.type)) {
      placeholder = "请选择" + (item.label || "");
    } else {
      placeholder = item.label || "";
    }
  }
  getLabelValues(item, data);
  return placeholder;
};

/**
 * @description: 获取下拉选项其他信息
 * @param {*} item 下拉选择项
 */
const getLabelValues = (item: any, data?: any) => {
  if (
    ["select", "radio", "cascader"].includes(item?.type) &&
    item.labelValues?.length
  ) {
    const dataList =
      Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
    recursive(props.data, item, props.listTypeInfo[item.list], dataList);
  }
};
const recursive = (
  data: any,
  item: any,
  list: Array<any> = [],
  dataList: Array<string> = []
) => {
  for (let i = 0; i < dataList.length; i++) {
    for (let j = 0; j < list.length; j++) {
      const listItem = list[j];
      if (dataList[i] === listItem.value) {
        data[item.labelValues[i].label] = listItem[item.labelValues[i].value];
        if (listItem.children && listItem.children.length) {
          recursive(data, item, listItem.children, dataList);
        }
        break;
      }
    }
  }
};

/**
 * @description: 绑定的相关事件
 * @param {*} event 事件名
 * @param {*} data 数据
 * @param {*} item 下拉选择项
 */
const handleEvent = (event: string, data?: any, item?: any) => {
  getLabelValues(item, data);
  event && emit("handleEvent", event, data, item);
};
</script>

<style lang="scss">
.my_form {
  .el-form-item {
    margin-bottom: 12px;
    position: relative;

    .el-radio-group {
      display: flex;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }

    .el-form-item__label {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .form_label {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        }
    }

    .append_icon {
      position: absolute;
      color: #0394ff;
      top: 50%;
      right: -16px;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 1;
    }

    &.no-label {
      & > .el-form-item__label {
        padding: 0;
      }
    }
  }

  .el-input-number,
  .el-select,
  .el-date-editor,
  .el-cascader {
    width: 100%;
  }

  .multiple_item {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > div {
        flex: 1;
      }

      .multiple_input {
        flex: 2.2;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-input {
          margin-left: 3px;

          .el-input__inner {
            padding: 0 5px !important;
          }
        }
      }
    }
  }

  .el-input-group__prepend,
  .el-input-group__append {
    padding: 0 7px;
  }

  .el-dropdown {
    .el-button span {
      display: flex;
      align-items: center;
    }
  }

  &.el-form--label-top {
    .el-form-item__label {
      padding: 0;
      justify-content: flex-start;
    }

    .el-row {
      .el-col-12 {
        &:nth-child(odd) {
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
