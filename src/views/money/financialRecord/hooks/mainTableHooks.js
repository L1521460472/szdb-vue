/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:47:41
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-04-16 09:11:45
 */
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { financeData } from "@/api/money/financialRecord.js";
import { getToken } from "@/utils/auth";
import { cloneDeep } from 'lodash-es';
import * as echarts from 'echarts';

export default function ($vm) {

  const router = useRouter();
  const loading = ref(true);
  const showSearch = ref(true);
  const radioValue = ref('近三季度');
  const radioValue1 = ref('项目维度');
  const total = ref(0);
  const spanLeft = ref(16);
  const spanRight = ref(8);
  const dateRange = ref([]);
  const form = ref({
    date: null
  });
  const rules= reactive({
    date: [{ required: true, message: "日期不能为空", trigger: "blur" }],
  })
  const financialObj = ref({
    num: 0
  });
  /*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/finance/expenditure/importWages"
});
  // 3季度图表数据
  let xAxisDataOne = ref([]);//x轴数据
  let seriesDataOneIncome = ref([]);//y轴数据收入
  let seriesDataOneExpenditure = ref([]);//y轴数据支出

  // 2年度图表数据
  let xAxisDataTwo = ref([]);//x轴数据
  let seriesDataTwoIncome = ref([]);//y轴数据收入
  let seriesDataTwoExpenditure = ref([]);//y轴数据支出

  // 12个月图表数据
  let xAxisDataThree = ref([]);//x轴数据
  let seriesDataThreeIncome = ref([]);//y轴数据收入
  let seriesDataThreeExpenditure = ref([]);//y轴数据支出

  const queryParams = ref({
    pageNum: 1,
    pageSize: 50,
    categoryId: undefined,
    productionDepartmentId: undefined
  })
  let myChart1 = null;
  let myChart2 = null;
  let myChart3 = null;
  let myChart4 = null;
  let myChart5 = null;
  const option1 = ref({
    title: {
      text: '净利用率',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '目标' },
        ]
      }
    ]
  });
  const option2 = ref({
    title: {
      text: '收支趋势分析(元)',
      top: '10px',
      left: '20px',
      textStyle:{
        fontSize: '14px',
        color: '#0d06db',
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid:{
      left: '90',
      bottom: '60',
    },
    legend: {
      data: ['支出', '收入'],
      bottom: '10',
      textStyle:{
        color: '#0d06db',
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: xAxisDataOne.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: 'none',
      }
    ],
    series: [
      {
        name: '支出',
        type: 'bar',
        barGap: 0,
        label: '4',
        color: '#24b6c4',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataOneExpenditure.value
      },
      {
        name: '收入',
        type: 'bar',
        label: '3',
        color:'#ebc041',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataOneIncome.value
      }
    ]
  });

  const option3 = ref({
    title: {
      text: '收支趋势分析(元)',
      top: '10px',
      left: '20px',
      textStyle:{
        fontSize: '14px',
        color: '#0d06db',
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid:{
      left: '90',
      bottom: '60',
    },
    legend: {
      data: ['支出', '收入'],
      bottom: '10',
      textStyle:{
        color: '#0d06db',
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: xAxisDataTwo.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: 'none',
      }
    ],
    series: [
      {
        name: '支出',
        type: 'bar',
        barGap: 0,
        label: '4',
        color: '#24b6c4',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataTwoExpenditure.value
      },
      {
        name: '收入',
        type: 'bar',
        label: '3',
        color:'#ebc041',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataTwoIncome.value
      }
    ]
  });
  const option4 = ref({
    title: {
      text: '收支趋势分析(元)',
      top: '10px',
      left: '20px',
      textStyle:{
        fontSize: '14px',
        color: '#0d06db',
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid:{
      left: '90',
      bottom: '60',
    },
    legend: {
      data: ['支出', '收入'],
      bottom: '10',
      textStyle:{
        color: '#0d06db',
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: xAxisDataThree.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: 'none',
      }
    ],
    series: [
      {
        name: '支出',
        type: 'bar',
        barGap: 0,
        label: '4',
        color: '#24b6c4',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataThreeExpenditure.value
      },
      {
        name: '收入',
        type: 'bar',
        label: '3',
        color:'#ebc041',
        emphasis: {
          focus: 'series'
        },
        data: seriesDataThreeIncome.value
      }
    ]
  });

  const option5 = ref({
    title: {
      text: '团队回款',
      top: '10px',
      left: '20px',
      textStyle:{
        fontSize: '14px',
        color: '#0d06db',
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
    },
    graphic: [
      {
        type: "text",
        left: "46%",
        top: "38%",
        style: {
          text: '销售总额',
          textAlign: "center",
          fill: "销售总额",
          width: 30,
          height: 30,
          fontSize: 12,
        },
      },
        {
        type: "text",
        left: "46%",
        top: "50%",
        style: {
          text: '0',
          textAlign: "center",
          fill: "#1D2129",
          width: 30,
          height: 30,
          fontSize: 24,
        },
      },
    ],
    series: [
      {
        name: '部门',
        type: 'pie',
        radius: ['40%', '70%'],
        // center: ['35%', '50%'],
        center: 'center',
        avoidLabelOverlap: false,
        // label: {
        //   show: false,
        //   position: 'center'
        // },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false
        },
        data: 
        financialObj.value.financeReportCostFormsOne
        // [
        //   { value: 1048, name: '角色组' },
        //   { value: 735, name: '原画组' },
        //   { value: 580, name: '特效组' },
        //   { value: 484, name: '动作组' },
        //   { value: 300, name: '场景组' }
        // ]
      }
    ]
  });

  /**
   * @description: 表格数据
   */
  const tableData = ref([]);
  /** 查询财务数据 */
  const getList = () => {
    loading.value = true;
    // xAxisDataOne.value = []
    // seriesDataOneIncome.value = []
    // seriesDataOneExpenditure.value = []
    // xAxisDataTwo.value = []
    // seriesDataTwoIncome.value = []
    // seriesDataTwoExpenditure.value = []
    // xAxisDataThree.value = []
    // seriesDataThreeIncome.value = []
    // seriesDataThreeExpenditure.value = []
    setTimeout(() => {
      financeData(queryParams.value).then(response => {
        // console.log(response.data)
        financialObj.value = cloneDeep(response.data)
        financialObj.value.num = parseInt(Number(response.data.netProfitLastMonth) / Number(response.data.totalExpenditureLastMonth)) || 0
        // 各团队收支
        if(response.data.financeReportCostFormsOne){
          financialObj.value.financeReportCostFormsOne = response.data.financeReportCostFormsOne.map(item=>{
            item.value = item.expenditureThisMonth
            return item
          })
        }
  
        
        if(response.data.financeReportDateFormsOne){
          response.data.financeReportDateFormsOne.map((item)=>{
            xAxisDataOne.value.push(item.time)
            seriesDataOneIncome.value.push(item.income)
            seriesDataOneExpenditure.value.push(item.expenditure)
          })
        }
        if(response.data.financeReportDateFormsTwo){
          response.data.financeReportDateFormsTwo.map((item1)=>{
            xAxisDataTwo.value.push(item1.time)
            seriesDataTwoIncome.value.push(item1.income)
            seriesDataTwoExpenditure.value.push(item1.expenditure)
          })
        }
        if(response.data.financeReportDateFormsThree){
          response.data.financeReportDateFormsThree.map((item2)=>{
            xAxisDataThree.value.push(item2.time)
            seriesDataThreeIncome.value.push(item2.income)
            seriesDataThreeExpenditure.value.push(item2.expenditure)
          })
        }
        option2.value.series[1].data = seriesDataOneIncome.value
        option2.value.series[0].data = seriesDataOneExpenditure.value
        option3.value.series[1].data = seriesDataTwoIncome.value
        option3.value.series[0].data = seriesDataTwoExpenditure.value
        option4.value.series[1].data = seriesDataThreeIncome.value
        option4.value.series[0].data = seriesDataThreeExpenditure.value
        loading.value = false;
      });
    }, 100);
    
  }
  const getDataCharts = ()=>{
    xAxisDataOne.value = []
    seriesDataOneIncome.value = []
    seriesDataOneExpenditure.value = []
    xAxisDataTwo.value = []
    seriesDataTwoIncome.value = []
    seriesDataTwoExpenditure.value = []
    xAxisDataThree.value = []
    seriesDataThreeIncome.value = []
    seriesDataThreeExpenditure.value = []
  }
  /** 跳转 */
  const handleToDoOpen = (row) => {
    console.log(row)
  }
  /** 删除 */
  const handleDelete = (row) => {
    delTemplate(row.id).then(response => {
      if(response.code == 200){
        $vm.$modal.msgSuccess("删除成功");
        getList()
      }
    });
  }
  /** MyChart1 */
  const initMyChart1 = () => {
    // console.log(option1)
    if(myChart1){
      myChart1.dispose()
    }
    const myChart10 = document.getElementById("myChart1");
    myChart1 = echarts.init(myChart10);
    option1.value && myChart1.setOption(option1.value);
  }
  /** MyChart2 */
  const initMyChart2 = () => {
    // console.log($vm.myChart2)
    if(myChart2){
      myChart2.dispose()
    }
    const myChart20 = document.getElementById("myChart2");
    myChart2 = echarts.init(myChart20);
    option2.value && myChart2.setOption(option2.value);
  }
  /** MyChart3 */
  const initMyChart3 = () => {
    // console.log($vm.myChart3)
    if(myChart3){
      myChart3.dispose()
    }
    const myChart30 = document.getElementById("myChart3");
    myChart3 = echarts.init(myChart30);
    option5.value && myChart3.setOption(option5.value);
  }
  /** MyChart4 */
  const initMyChart4 = (val) => {
    console.log(val)
    if(myChart4){
      myChart4.dispose()
    }
    const myChart40 = document.getElementById("myChart4");
    myChart4 = echarts.init(myChart40);
    if(val == '近三季度'){
      // 按季度查询
      option2.value && myChart4.setOption(option2.value);
    }else if(val == '近一年度') {
      // 按年查询
      option4.value && myChart4.setOption(option4.value);
    }else{
      // 按两年查询
      option3.value && myChart4.setOption(option3.value);
    }
    
  }

  /** 导入工资按钮操作 */
  function handleImport() {
    upload.title = "导入工资";
    upload.open = true;
  };
  /** 下载模板操作 */
  function importTemplate() {
    $vm.download("finance/expenditure/importWagesTemplate", {
    }, `user_template_${new Date().getTime()}.xlsx`);
  };
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
    upload.open = false;
    upload.isUploading = false;
    $vm.$refs["uploadRef"].handleRemove(file);
    $vm.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
    getList();
  };
  /** 提交上传文件 */
  function submitFileForm() {
    $vm.$refs["userRef"].validate(valid => {
      if (valid) {
        console.log(form.value.date)
        $vm.$refs["uploadRef"].submit();
      }
    });
  };
  const handleChangeRadio = (val) => {
    // console.log(val)
    initMyChart4(val)
  }
  onBeforeMount(() => {
    getList()
  }),

  onMounted(() => {
    // initMyChart1()
    setTimeout(() => {
      // console.log(xAxisDataOne.value)
      // initMyChart2()
      initMyChart3()
      initMyChart4('近三季度')
    }, 1000);
  });


  return {
    tableData,
    radioValue,
    radioValue1,
    total,
    showSearch,
    loading,
    spanLeft,
    spanRight,
    financialObj,
    queryParams,
    form,
    rules,
    upload,
    myChart1,
    myChart2,
    myChart3,
    myChart4,
    myChart5,
    option1,
    option2,
    option3,
    option4,
    option5,
    getList,
    handleToDoOpen,
    handleDelete,
    handleImport,
    importTemplate,
    handleFileUploadProgress,
    handleFileSuccess,
    submitFileForm,
    initMyChart2,
    initMyChart3,
    initMyChart4,
    getDataCharts,
    handleChangeRadio,
  };
}
