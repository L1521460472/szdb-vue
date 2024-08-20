/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-08-06 09:41:02
 */
import { onBeforeMount,onMounted,onUnmounted, reactive, ref,watch } from "vue";
import { useRouter } from "vue-router";
import { listCalendar,listDivide,listScheduling } from "@/api/project/gantt";
import { gantt } from 'dhtmlx-gantt';
import ganttFormat from './ganttFormat';

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const total = ref(0);
  const projectTotal = ref(0);
  const personnelTotal = ref(0);
  const type = ref('add');
  const oldProjectRate = ref('');
  const oldTimeConsuming = ref('');
  const span = ref([]);
  const index = ref(null);
  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    productionDepartmentId: undefined,
    producerId: undefined,
  })
  const projectQueryParams = ref({
    pageNum: 1,
    pageSize: 50,
    productionDepartmentId: undefined,
    producerId: undefined,
  })

  const refName = ref('ganttComponent')
  const isTaskGantt = ref(false)
  const allowFullScreen = ref(false)

  const rowspanNumObject = ref({})
  const rowspanArray = ref(['projectEnterpriseName'])

  /**
   * @description: 表格数据
   */
  const tableData = ref({
    data:[]
  })
  const projectTableData = ref([]);//项目分工
  const personnelTableData = ref([]);//人员排期
  /** 查询资源日历列表 */
  const getCalendarList = () => {
    loading.value = true;
    listCalendar(queryParams.value).then(response => {
      tableData.value.data = response.rows.map((item)=>{
        item.end_date = '';
        return item
      });
      total.value = response.total;
      loading.value = false;
    });
  }
  /** 查询项目分工列表 */
  const getList = () => {
    loading.value = true;
    listDivide(queryParams.value).then(response => {
      projectTableData.value = response.rows;
      getSpanArr(projectTableData.value);
      projectTotal.value = response.total;
      loading.value = false;
    });
  }
  /** 查询人员排期列表 */
  const getSchedulingList = () => {
    loading.value = true;
    listScheduling(queryParams.value).then(response => {
      personnelTableData.value = response.rows;
      personnelTotal.value = response.total;
      loading.value = false;
    });
  }
  const fullScreen = ()=> {
    if (!gantt.getState().fullscreen) {
        // expanding the gantt to full screen
        const ganttComponent = document.getElementById(refName.value);
        ganttComponent.style.background = '#FFF';
        gantt.expand();
    } else {
        // collapsing the gantt to the normal mode
        gantt.collapse();
    }
  }
  //部门下拉选择
  const handleChangeDept = (value) => {
  //   console.log(value)
    queryParams.value.productionDepartmentId = value.slice(-1)[0]
  }
  /** 初始化甘特图 */
  const initGantt = ()=> {
    // gantt.clearAll()
    const { taskFormat, demandFormat } = ganttFormat;
    gantt.config.readonly = true; // 只读
    gantt.config.columns = isTaskGantt.value ? taskFormat.columns : demandFormat.columns;
    // 设置表头的高度
    gantt.config.scale_height = 60;
    // gantt.config.scale_width = 40;
    // 设置行高
    gantt.config.row_height = 48;
    gantt.attachEvent('onCollapse', () => {
        // any custom logic here
        const ganttComponent = document.getElementById(refName.value);
        if (!ganttComponent) return;
        ganttComponent.style.background = 'transparent';
    },'settings');
    // 重置条状图样式
    gantt.config.type_renderers[gantt.config.types.task] = (task) => {
        const mainEl = document.createElement('div');
        mainEl.setAttribute(gantt.config.task_attribute, task.id);
        const size = gantt.getTaskPosition(task);
        mainEl.innerText = task.text;
        mainEl.className = 'custom-project';
        mainEl.style.left = `${size.left }px`;
        mainEl.style.top = `${size.top + 7}px`;
        mainEl.style.width = `${size.width }px`;
        mainEl.style.background = task.color;
        return mainEl;
    };
    // 配置插件
    gantt.plugins({ tooltip: true, fullscreen: true, marker: true, });
    // 配置marker
    const today = new Date();
    gantt.addMarker({
        start_date: today,
        css: 'today',
        text: 'Today',
    });
    gantt.config.work_time = true;
    gantt.setWorkTime({day: [0,6],hours: false})
    // 自定义tooltip内
    // const toolTipFunction = isTaskGantt.value ? taskFormat.tooltip : demandFormat.tooltip;
    // gantt.templates.tooltip_text = (start, end, task) => toolTipFunction(start, end, task);
    gantt.config.tooltip_hide_timeout = 0;
    gantt.config.tooltip = false;
    gantt.config.layout = {
        css: 'gantt_container',
        cols: [
            {
                width: isTaskGantt.value ? taskFormat.tableWidth : demandFormat.tableWidth,
                rows: [
                    {
                        view: 'grid', scrollX: 'gridScroll', scrollable: true, scrollY: 'scrollVer'
                    },
                    { view: 'scrollbar', id: 'gridScroll' }
                ]
            },
            { resizer: true, width: 1 },
            {
                rows: [
                    { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
                    { view: 'scrollbar', id: 'scrollHor' }
                ]
            },
            { view: 'scrollbar', id: 'scrollVer' }
        ]
    };
    var weekScaleTemplate = function(date){
      var a = new Array("日", "一", "二", "三", "四", "五", "六"); 
      var week = new Date($vm.parseTime((date),'{y}-{m}-{d}')).getDay(); 
      return '周' + a[week]
    }
    var daysStyle = function(date){
      // you can use gantt.isWorkTime(date)
      // when gantt.config.work_time config is enabled
      // In this sample it's not so we just check week days
  
      if(date.getDay() === 0 || date.getDay() === 6){
        return "weekend";
      }
      return "";
    };
    const zoomConfig = {
        // 设置右侧时间轴格式及宽高
        levels: [
            {
                name: 'month',
                scale_height: 60,
                min_column_width: 30,
                scales: [
                    { unit: 'month', format: '%Y/%m' },
                    { unit: 'day', step: 1, format: '%d', css:daysStyle },
                    { unit: 'day', step: 1, format: weekScaleTemplate, css:daysStyle },
                ]
            },
        ]
    };
    // 给年月展示框加类名
    gantt.templates.scale_cell_class = () => 'month-box';
    // gantt.templates.scale_cell_class = (date) =>{
    //   if(date.getDay() == 0 || date.getDay() == 6){
    //     return 'weekend'
    //   }
    // };
    gantt.templates.timeline_cell_class = (task,date) =>{
      if(date.getDay() == 0 || date.getDay() == 6){
        return 'weekend'
      }
    };
    gantt.ext.zoom.init(zoomConfig);
    const ganttComponent = document.getElementById(refName.value);
    if (!ganttComponent) return;
    gantt.init(ganttComponent);
    gantt.parse(tableData.value);
  }
  
  //获取需要合并的数据
  const getSpanArr = (data)=>{
    rowspanArray.value.map((item)=>{
      rowspanNumObject.value[item] = new Array(data.length).fill(1,0,1).fill(0,1)
      rowspanNumObject.value[`${item}-index`] = 0;
    })
    for(let i = 0; i < data.length; i++){
      rowspanArray.value.map((key)=>{
        const index = rowspanNumObject.value[`${key}-index`]
        if(i === 0){
        }else{
          if(data[i][key] === data[i - 1][key]){
            rowspanNumObject.value[key][index]++;
          }else{
            rowspanNumObject.value[`${key}-index`] = i;
            rowspanNumObject.value[key][i] = 1;
          }
        }
      })
    }
  }
  
  //表格合并
  const handleSpanMethod = ({row,column,rowIndex,columnIndex}) => {
    if(rowspanArray.value.includes(column['property'])){
      const rowspan = rowspanNumObject.value[column['property']][rowIndex];
      if(rowspan > 0){
        return {rowspan:rowspan,colspan:1};
      }
      return {rowspan:0,colspan:0}
    }
    return {rowspan:1,colspan:1}
  }

  watch(
    () => tableData.value.data,
    (val) => {
      if (val.length === 0 && gantt.getState().fullscreen) {
            gantt.collapse();
        }
        gantt.clearAll();
        initGantt();
      }
  );
  onBeforeMount(() => {
    getCalendarList()
  }),
  onMounted(() => {
    getList()
    getSchedulingList()
    setTimeout(()=>{
      initGantt()
    },600)
  });
  onUnmounted(() => {
    gantt.plugins({ tooltip: false });
    initGantt();
  })


  return {
    tableData,
    projectTableData,
    personnelTableData,
    total,
    projectTotal,
    personnelTotal,
    type,
    loading,
    showSearch,
    queryParams,
    projectQueryParams,
    oldProjectRate,
    oldTimeConsuming,
    refName,
    isTaskGantt,
    allowFullScreen,
    initGantt,
    getCalendarList,
    getList,
    getSchedulingList,
    fullScreen,
    handleSpanMethod,
    handleChangeDept
  };
}
