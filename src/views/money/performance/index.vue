<template>
    <div class="app-container">
       <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="日期" prop="month">
             <el-date-picker
              v-model="queryParams.month"
              type="monthrange"
              range-separator="~"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleChangeTime"
            />
          </el-form-item>
          <el-form-item label="项目企业" prop="projectEnterpriseId">
            <el-select v-model="queryParams.projectEnterpriseId" filterable placeholder="项目企业" style="width: 200px">
                <el-option
                   v-for="item in categoryList"
                   :key="item.id"
                   :label="item.categoryName"
                   :value="item.id"
                />
             </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-cascader
                v-model="queryParams.deptId"
                :options="departmentList"
                :props="props"
                filterable
                :show-all-levels="false"
                @change="handleChangeDept"
                />
          </el-form-item>
          <el-form-item label="制作人" prop="producerId">
             <el-select v-model="queryParams.producerId" placeholder="制作人" clearable filterable style="width: 200px">
                <el-option
                   v-for="item in userOptions"
                   :key="item.userId"
                   :label="item.userName"
                   :value="item.userId"
                />
             </el-select>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
             <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
       </el-form>
 
       <el-table v-loading="loading" :data="achievementsList" show-summary :summary-method="getSummaries" @selection-change="handleSelectionChange" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="制作人" align="center" prop="producerName" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="项目企业" align="center" prop="projectEnterpriseName" />
          <el-table-column label="项目名称" align="center" prop="projectName">
            <template #default="scope">
              <!-- <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span> -->
              <div v-for="item in scope.row.projectName">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="绩效人天（天）" align="center" prop="producerTime" />
       </el-table>
 
       <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
       />
    </div>
 </template>
 
 <script setup name="Performance">
 import { listAchievements,listCategoryDetail,deptList,userList } from "@/api/money/performance";
 
 const { proxy } = getCurrentInstance();
 
 const achievementsList = ref([]);
 const categoryList = ref([]);
 const departmentList = ref([]);
 const userOptions = ref([]);
 const loading = ref(true);
 const total = ref(0);
 const options = ref([{
    value: 1,
    label: '1',
    disabled: true,
}, {
    value: 2,
    label: '2'
}, {
    value: 3,
    label: '3'
}, {
    value: 4,
    label: '4'
}, {
    value: 5,
    label: '5'
}, {
    value: 6,
    label: '6'
}, {
    value: 7,
    label: '7'
}, {
    value: 8,
    label: '8'
}, {
    value: 9,
    label: '9'
}, {
    value: 10,
    label: '10'
}, {
    value: 11,
    label: '11'
}, {
    value: 12,
    label: '12'
}]);
 const data = reactive({
   form: {},
   queryParams: {
     pageNum: 1,
     pageSize: 50,
     month: [],
     beginTime: undefined,
     endTime: undefined,
     projectEnterpriseId: undefined,
     deptId: undefined,
     producerId: undefined,
   },
 });
 const props = {
  value: 'id',
  // expandTrigger: 'hover',
  checkStrictly : true
}
 const { queryParams, form, rules } = toRefs(data);
 function getDaysInCurrentMonth(year,month) {
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth() + 1; // 月份从0开始，所以要加1
    const days = new Date(year, month, 0).getDate();
    return days;
  }
 /** 时间查询 */
 function handleChangeTime(val) {
    val[1] = val[1].slice(0,-2) + getDaysInCurrentMonth(val[1].slice(0,4),val[1].slice(5,7))
    queryParams.value.beginTime = val[0];
    queryParams.value.endTime = val[1];
  };
 
 /** 查询月绩效列表 */
 function getList() {
   loading.value = true;
   listAchievements(queryParams.value).then(response => {
     achievementsList.value = response.rows;
     total.value = response.total;
     loading.value = false;
   });
 }
 /** 查询企业 */
function getCategoryDetail() {
  listCategoryDetail(0).then(response => {
    categoryList.value = response.data;
 });
};
/** 查询部门列表 */
function getDeptTreeList() {
  deptList().then(response => {
    departmentList.value = response.data;
 });
};
/** 查询成员列表 */
function getuserList() {
  userList().then(response => {
    userOptions.value = response.rows;
 });
};
//部门下拉选择
const handleChangeDept = (value) => {
//   console.log(value)
  queryParams.value.deptId = value.slice(-1)[0]
}
 /** 表单重置 */
 function reset() {
   form.value = {
     postId: undefined,
     postCode: undefined,
     postName: undefined,
     postSort: 0,
     status: "0",
     remark: undefined
   };
   proxy.resetForm("postRef");
 }
 /** 搜索按钮操作 */
 function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
 }
 /** 重置按钮操作 */
 function resetQuery() {
   proxy.resetForm("queryRef");
  //  queryParams.value.beginTime = null;
  //  queryParams.value.endTime = null;
   // 获取当月的第一天
  queryParams.value.beginTime = outputDate(getFirstDayOfMonth());
  // 获取当月的最后一天
  queryParams.value.endTime = outputDate(getLastDayOfMonth());  
   handleQuery();
 }
 /** 多选框选中数据 */
 function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.postId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
 }
 /** 合计 */
 const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    // if (index === 0) {
    //   sums[index] = '合计'
    //   return
    // }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value)) && column.property =='producerTime') { 
      sums[index] = `合计： ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          let numb = (Number(prev)+ Number(curr)).toFixed(2)
          return numb
        } else {
          return prev
        }
      }, 0)},人数：${data.length}`
    } else {
      sums[index] = ''
    }
  })
  return sums
}
  // 获取当月的第一天
  function getFirstDayOfMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  // 获取当月的最后一天
  function getLastDayOfMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // 输出年月日
  function outputDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是从0开始的
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // onMounted(() => {
    
  //   getList()
  // });
 // 获取当月的第一天
 queryParams.value.beginTime = outputDate(getFirstDayOfMonth());
// 获取当月的最后一天
queryParams.value.endTime = outputDate(getLastDayOfMonth());  
queryParams.value.month = [queryParams.value.beginTime, queryParams.value.endTime];
 getList();
 getuserList();
 getDeptTreeList();
 getCategoryDetail();
 </script>

<style scoped lang="scss">
.app-container{
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
</style>
 