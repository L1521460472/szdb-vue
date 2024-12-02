<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!-- <header-search id="header-search" class="right-menu-item" /> -->
      
        <el-switch
            v-model="watermarkValue"
            class="ml-2"
            style="height: 50px;line-height: 50px;"
            width="60"
            inline-prompt
            active-text="水印"
            inactive-text="水印"
            @change="handleWater"
          />

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-model="centerDialogVisible" title="考勤确认提醒" width="95%" center>
      <p
        >亲爱的同学，您好！这是 2024 年 8 月 份的考勤确认提醒，此数据尤为重要，如有错误，将影响您的工资核算，请认真核对。如无异议，请点击确认，如有异常，请拒绝签收并联系人事部处理。谢谢！</p
      >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="deptName" label="部门" />
        <el-table-column prop="positionName" label="职位"/>
        <el-table-column prop="employmentTime" label="入职时间" width="120" />
        <el-table-column prop="attendanceDay" label="应出勤天" />
        <el-table-column prop="accountingAttendanceDay" label="核算工资出勤天数" />
        <el-table-column prop="workOvertime" label="加班（小时）" />
        <el-table-column prop="compassionateLeave" label="事假" />
        <el-table-column prop="sickLeave" label="病假" />
        <el-table-column prop="annualLeave" label="年假" />
        <el-table-column prop="marriageBereavementPaternityLeave" label="婚/丧/陪产假" />
        <el-table-column prop="totalManagementSystem" label="全勤奖" />
        <el-table-column prop="numberLatencies" label="迟到次数" />
        <el-table-column prop="numberMissingCards" label="缺卡次数" />
        <el-table-column prop="attendanceDeduction" label="考勤扣款" />
        <el-table-column prop="remainingAnnualLeave" label="年假剩余（小时）" />
        <el-table-column prop="remainingCompensatoryLeave" label="调休剩余（小时）" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column label="考勤状态" prop="attendanceStatus">
          <template #default="scope">
            <span v-if="scope.row.attendanceStatus == 1">已确认</span>
            <span v-if="scope.row.attendanceStatus == 2">未确认</span>
            <span v-if="scope.row.attendanceStatus == 3">异常</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClickKQ(0)">拒 绝</el-button>
          <el-button type="primary" @click="handleClickKQ(1)"
            >确 认</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="centerDialogVisible1" title="工资确认提醒" width="95%" center>
      <p
        >亲爱的同学，您好！这是 2024 年 8 月 份的考勤确认提醒，此数据尤为重要，如有错误，将影响您的工资核算，请认真核对。如无异议，请点击确认，如有异常，请拒绝签收并联系人事部处理。谢谢！</p
      >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="部门" align="center" prop="department" />
        <el-table-column label="职位" align="center" prop="position" />
        <el-table-column label="入职时间" align="center" prop="entryTime" />
        <el-table-column label="应发工资" align="center" prop="salary" />
        <el-table-column label="当月均摊" align="center" prop="monthlySpread" />
        <el-table-column label="法定天数" align="center" prop="legalDays" />
        <el-table-column label="税成本" align="center" prop="taxCost" />
        <el-table-column label="日成本" align="center" prop="dailyCost" />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column label="考勤状态" prop="status">
          <template #default="scope">
            <span v-if="scope.row.status == 1">已确认</span>
            <span v-if="scope.row.status == 0">未确认</span>
            <span v-if="scope.row.status == 2">异常</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClickGZ(0)">拒 绝</el-button>
          <el-button type="primary" @click="handleClickGZ(1)"
            >确 认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import { setWatermark } from "@/api/login";
import { getUnconfirmed,getConfirmed } from "@/api/personnel/attendanceReport";
import { getNotice,confirmNotice } from "@/api/money/expenditureManagement";

const instance = getCurrentInstance().proxy
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const watermarkValue = ref('')
const number = ref(0)
const flag = ref(true)
const centerDialogVisible = ref(false)//考勤
const centerDialogVisible1 = ref(false)//工资

const tableData = ref([])//考勤
const tableData1 = ref([])//工资

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}
watch(watermarkValue, (val,oldVal) => {
  let count = 0;
  number.value++
  if(val){
    count = 1
  }else{
    count = 0
  }
  console.log(number.value,val,oldVal)
  if(number.value > 1 && flag.value){
    setWatermark(count).then(res => {
    if(res.code == 200){
      // instance.$modal.msgSuccess("操作成功");
      userStore.getShow(val)
      flag.value = true
    }else{
      watermarkValue.value = oldVal
      flag.value = false
    }
  }).catch((err)=>{
    console.log(err)
    flag.value = false
    const isWatermark = localStorage.getItem('watermark');
    // number.value++
    if(isWatermark == 1){
      watermarkValue.value = true
    }else{
      watermarkValue.value = false
    }
  })
  } 
})


function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}
function handleWater(val) {
  // console.log(val)
  flag.value = true
}
function handleClickKQ(val) {
  // console.log(val)
  if(val == 1){
    getConfirmed().then((res)=>{
      console.log(res)
      instance.$modal.msgSuccess("考勤已确认");
      centerDialogVisible.value = false
    })
  }else{
    console.log(res)
    instance.$modal.msgError("考勤已拒绝，待重新确认");
    centerDialogVisible.value = false
  }
}
function handleClickGZ(val) {
  // console.log(val)
  if(val == 1){
    confirmNotice().then((res)=>{
      // console.log(res)
      instance.$modal.msgSuccess("工资已确认");
      centerDialogVisible1.value = false
    })
  }else{
    console.log(res)
    instance.$modal.msgError("工资已拒绝，待重新确认");
    centerDialogVisible1.value = false
  }
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}


onMounted(() => {
  const isWatermark = localStorage.getItem('watermark');
  // number.value++
  if(isWatermark == 1){
    watermarkValue.value = true
  }else{
    watermarkValue.value = false
  }
  userStore.getShow(watermarkValue.value)
  getUnconfirmed().then((res)=>{
    console.log(res)
    if(res.data){
      centerDialogVisible.value = true
      tableData.value = [res.data]
    }else{
      centerDialogVisible.value = false
    }
  })
  getNotice().then((res)=>{
    console.log(res)
    if(res.data){
      centerDialogVisible1.value = true
      tableData1.value = [res.data]
    }else{
      centerDialogVisible1.value = false
    }
  })
})
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
:deep(.el-dialog .el-dialog__footer){
  justify-content: center !important;
}
</style>
