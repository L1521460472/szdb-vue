<template>
  <div class="app-container home">
    <div class="home-header">
      <!-- <div>
        <el-carousel height="40px" direction="vertical">
          <el-carousel-item v-for="item in systemMsg" :key="item">
            <h3 text="2xl" justify="center">{{ item.title }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div> -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="home-list one" @click="handleToProject()">
            <div class="home-list-title"><span>项目总数</span><span><el-icon><Warning /></el-icon></span></div>
            <div class="home-list-banner"><span style="border-bottom: 1px solid #fff;padding: 0 5px;box-sizing: border-box;">{{ total }}</span></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-list tow" @click="handleToProject(1)">
            <div class="home-list-title"><span>进行中</span><span><el-icon><Warning /></el-icon></span></div>
            <div class="home-list-banner"><span style="border-bottom: 1px solid #fff;padding: 0 5px;box-sizing: border-box;">{{progressiveNumber}}</span></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-list three" @click="handleToProject(3)">
            <div class="home-list-title"><span>已延期</span><span><el-icon><Warning /></el-icon></span></div>
            <div class="home-list-banner"><span style="border-bottom: 1px solid #fff;padding: 0 5px;box-sizing: border-box;">{{delayNumber}}</span></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-list four">
            <div class="home-list-title"><span>项目完成率</span><span><el-icon><Warning /></el-icon></span></div>
            <div class="home-list-banner">{{completionRate}}%</div>
            <div><el-progress :percentage="completionRate" :format="format"/></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="home-tabs">
      <!-- <div class="change-date">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          range-separator="~"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleChange"
        />
      </div> -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="绩效统计" name="first">
          <div class="home-echarts">
            <div>
              <el-row :gutter="20">
                <el-col :span="24">
                  <LineChart 
                    ref="lineChart1"
                    lineChartId="lineChart1" 
                    :option="option1"
                    :search1="false" 
                    :search2="false" 
                    :search3="false" 
                    :search4="false"
                    @change="handleChangeValue1" 
                    >
                  </LineChart>
                </el-col>
                <!-- <el-col :span="8">
                  <LineChart 
                    ref="lineChart2"
                    lineChartId="lineChart2" 
                    :option="option2"
                    :search1="false" 
                    :search2="false" 
                    :search3="false" 
                    :search4="false"
                    @change="handleChangeValue2" 
                    >
                  </LineChart>
                </el-col> -->
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Index">
import {Warning} from '@element-plus/icons-vue'
import LineChart from "./chart/LineChart.vue";
import { getCount } from "@/api/login";
import { performanceStatistics } from "@/api/money/orderStatistics";
const router = useRouter();

const instance = getCurrentInstance()?.proxy;
const format = (percentage) => (percentage === 100 ? '' : ``)
const lineChart1 = ref(null)
const lineChart2 = ref(null)
const rate = ref(78)
const activeName = ref('first')
const dateValue = ref('null')
const chartSeriesData = ref([])
const chartXAxisData = ref([])
const systemMsg = ref([
            {id:1,title:'你收到一条关于【国庆放假】的通知，请及时确认处理！'},
            {id:2,title:'你收到一条关于【本月工作】的通知，请及时确认处理！'},
            {id:3,title:'你收到一条关于【考勤确认】的通知，请及时确认处理！'}
        ])
const option1 = {
    title: {
      text: '个人月度绩效统计分析',
      left: 'center',
      textStyle: {
          color: '#ed7d31'
        }
    },
    color: ["#03a2ff", "#03a2ff"],
    tooltip: {
      trigger: "axis",
    },
    toolbox: {
      // feature: {
      //   saveAsImage: {
      //     title: '保存为图片'
      //   }
      // },
    },
    xAxis: {
      type: "category",
      // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      data: chartXAxisData.value,
      axisLabel: {
        fontSize: 12,
        color: "#666",
      },
      axisLine: {
        lineStyle: {
          color: "#DEE0E3",
        },
      },
    },
    yAxis: [{
      type: "value",
      label: {
        show: true,
        position: 'top',
        valueAnimation: true
      },
      axisLabel: {
        fontSize: 12,
        color: "#666",
      },
      axisLine: {
        show: false,
        // lineStyle: {
        //   color: "#DEE0E3",
        // },
      },
    },{
      type: 'value'
    }],
    series: [
      {
        // name:'1111111',
        type: 'bar',
        // stack: 'Total',
        // silent: true,
        barWidth: '40%',
        data: chartSeriesData.value,
        label: {
          show: true,
          position: 'top'
        },
        itemStyle: {
          color: function (params) {
            var colorList = ["#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff", "#03a2ff"]
            return colorList[params.dataIndex]
          }
        }
      },
      {
        // name: 'Temperature',
        type: 'line',
        lineStyle: {
          color: '#ed7d31'
        },
        smooth: true,
        data: chartSeriesData.value,
      }
    ]
  };
  const option2 = {
    title: {
      text: '人员占比',
    },
    color: ["#19C196", "#0394FF", "#FB7E35"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: '8%',
      left: 'center'
    },
    // grid: {
    //   left: 5,
    //   right: 5,
    //   bottom: 30,
    //   containLabel: true,
    // },
    toolbox: {
      // feature: {
      //   saveAsImage: {
      //     title: '保存为图片'
      //   }
      // }
    },
    series: {
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: 'Search' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
    },
  };

  const total = ref(0)
  const progressiveNumber = ref(0)
  const delayNumber = ref(0)
  const completionRate = ref(0)
  onBeforeMount(() => {
    /** 查询绩效统计 */
    performanceStatistics().then(response => {
      var arr = response.data
      // arr.sort((a,b)=> a.month - b.month)
      arr.map(item=>{
        chartXAxisData.value.unshift(item.month)
        chartSeriesData.value.unshift(item.bigDecimal)
      })
   });
  }),

  onMounted(() => {
    setTimeout(() => {
      handleChangeValue1()
    }, 800);
    // handleChangeValue2()
    getCount().then(response => {
          if(response.code == 200){
            console.log(response)
            total.value = response.data.total
            progressiveNumber.value = response.data.progressiveNumber
            delayNumber.value = response.data.delayNumber
            completionRate.value = response.data.completionRate
          }
        });
  })

  const handleClick = (tab, event) => {
    console.log(tab, event)
  }
  const handleChange = (value) => {
    console.log(value)
  }

  const handleChangeValue1 = (data) => {
    instance.$refs.lineChart1.init()
  }
  const handleChangeValue2 = (data) => {
    instance.$refs.lineChart2.init()
  }
  const handleToProject = (val)=>{
    console.log(val)
    router.push({ path: "/arts/project", query: { status : val } });
  }

</script>

<style scoped lang="scss">
.home {
  .home-header{
    width: 100%;
    height: 200px;
    margin-bottom: 50px;
    .home-list{
      height: 200px;
      padding: 20px 30px;
      color: #fff;
      position: relative;
      cursor: pointer;
      .home-list-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
      }
      .home-list-banner{
        height: 80px;
        line-height: 80px;
        font-size: 32px;
        margin-bottom: 10px;
      }
    }
    .el-icon{
      color: #9c7f12;
    }
    .one{
      background-color: #1690ff;
    }
    .tow{
      background-color: #30c25b;
    }
    .three{
      background-color: #facc15;
    }
    .four{
      background-color: #223173;
    }
  }
  .home-echarts{
    width: 100%;
    height: 450px;
    .el-col{
      height: 450px;
      .grid_item{
        width: 100%;
        height: 100%;
      }
    }
  }
  .home-tabs{
    position: relative;
  }
  .change-date{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

