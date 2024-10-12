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
    <el-dialog v-model="centerDialogVisible" title="考勤确认提醒" width="90%" center>
      <p
        >亲爱的同学，您好！这是 2024 年 8 月 份的考勤确认提醒，此数据尤为重要，如有错误，将影响您的工资核算，请认真核对。如无异议，请点击确认，如有异常，请拒绝签收并联系人事部处理。谢谢！</p
      >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="name0" label="部门" />
        <el-table-column prop="name1" label="职位" />
        <el-table-column prop="name2" label="入职时间" />
        <el-table-column prop="name3" label="应出勤天" />
        <el-table-column prop="name4" label="核算工资出勤天数" />
        <el-table-column prop="name5" label="加班（小时）" />
        <el-table-column prop="name6" label="事假" />
        <el-table-column prop="name7" label="病假" />
        <el-table-column prop="name8" label="年假" />
        <el-table-column prop="name9" label="婚/丧/陪产假" />
        <el-table-column prop="name10" label="全勤奖" />
        <el-table-column prop="name11" label="迟到次数" />
        <el-table-column prop="name12" label="缺卡次数" />
        <el-table-column prop="name13" label="考勤扣款" />
        <el-table-column prop="name14" label="年假剩余（小时）" />
        <el-table-column prop="name15" label="调休剩余（小时）" />
        <el-table-column prop="name16" label="备注" />
        <el-table-column prop="name17" label="状态" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">拒 绝</el-button>
          <el-button type="primary" @click="centerDialogVisible = false"
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

const instance = getCurrentInstance().proxy
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const watermarkValue = ref('')
const number = ref(0)
const flag = ref(true)
const centerDialogVisible = ref(true)

const tableData = ref([
  {
    name: 'Tom',
    name0: 'Tom0',
    name1: 'Tom1',
    name2: 'Tom2',
    name3: 'Tom3',
    name4: 'Tom4',
    name5: 'Tom5',
    name6: 'Tom6',
    name7: 'Tom7',
    name8: 'Tom8',
    name9: 'Tom9',
    name10: 'Tom10',
    name11: 'Tom11',
    name12: 'Tom12',
    name13: 'Tom13',
    name14: 'Tom14',
    name15: 'Tom15',
    name16: 'Tom16',
    name17: 'Tom17',
  },
])

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
