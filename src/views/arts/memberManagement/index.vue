<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-05-24 11:52:11
-->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTabs">
      <el-tab-pane label="本部成员" name="first">
        <el-row :gutter="20" style="height: 100%;">
          <el-col :span="4" :xs="24" style="height: 100%;">
            <div class="head-container">
               <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="Search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="listTypeInfo.depTreeList"
                  :props="{ label: 'label', children: 'children' }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick1"
               />
            </div>
         </el-col>
         <el-col :span="20" :xs="24">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row>
          <el-table v-loading="loading" :data="tableData">
            <el-table-column label="序号" width="55" align="center" type="index" />
            <el-table-column label="成员图像" align="center" prop="memberPicture">
              <template #default="scope">
                <el-image style="width: 100px; height: 50px" :src="scope.row.memberPicture" :preview-src-list="[scope.row.memberPicture]" preview-teleported/>
              </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="userName">
            </el-table-column>
            <el-table-column label="部门" align="center" prop="deptName" />
            <el-table-column label="手机" align="center" prop="phone" />
            <el-table-column label="地区" align="center" prop="area" />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <span v-if="scope.row.status == 1">已更新</span>
                <span v-if="scope.row.status == 2">未更新</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
                <template #default="scope">
                  <el-tooltip content="详情" placement="top">
                      <el-button link type="primary" icon="View" @click="handleToDoOpen(scope.row)"></el-button>
                  </el-tooltip>
                </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="外部成员" name="second">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd1">新增</el-button>
          </el-col>
          <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <el-table v-loading="loading" :data="tableDataList">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="公司图标" align="center" prop="companyLogo">
            <template #default="scope">
              <el-image style="width: 100px; height: 50px" :src="scope.row.companyLogo" :preview-src-list="[scope.row.companyLogo]" preview-teleported/>
            </template>
          </el-table-column>
          <el-table-column label="公司名称" align="center" prop="companyName">
            <!-- <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="紧急联络人" align="center" prop="contactsName" />
          <el-table-column label="紧急联系方式" align="center" prop="contactsWay" />
          <el-table-column label="擅长类型" align="center" prop="shtick">
            <template #default="scope">
              <span v-if="member_shtick_type.find(v=> v.value == scope.row.shtick)">
                <dict-tag :options="member_shtick_type" :value="scope.row.shtick" />
              </span>
              <span v-else>
                {{ scope.row.shtick }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="技术级别" align="center" prop="technologyRank">
            <template #default="scope">
              <span v-if="scope.row.technologyRank == 1">初级</span>
              <span v-if="scope.row.technologyRank == 2">中级</span>
              <span v-if="scope.row.technologyRank == 3">高级</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="编辑" placement="top">
                    <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                    <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalValue > 0"
          :total="totalValue"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getDataList"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 新增本部成员 -->
    <Dialog
      :visible="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :close-on-click-modal="dialogInfo.closeOnClickModal"
      width="500px"
      style="height: 500px;"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="roleRef" :model="formInfo.data" :rules="formInfo.rules" label-width="100px">
        <el-form-item label="选择成员">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree
              class="tree-border"
              :data="listTypeInfo.depTreeAddList"
              show-checkbox
              ref="menuRef"
              node-key="id"
              default-expand-all
              :check-strictly="!formInfo.data.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
              @node-click="handleNodeClick"
            ></el-tree>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 新增外部成员 -->
    <Dialog
      :visible="dialogInfo1.visible"
      :title="dialogInfo1.title"
      :btnList="dialogInfo1.btnList"
      :close-on-click-modal="dialogInfo.closeOnClickModal"
      :width="500"
      @close="dialogInfo1.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="externalRef" :model="formInfo.data" :rules="formInfo.rules" :disabled="formInfo.disabled" label-width="110px">
        <el-form-item label="公司头像" prop="companyLogo">
          <el-upload
            class="avatar-uploader"
            ref="uploadRef"
            accept=".jpg,.png,.svg,.gif,.webp"
            :show-file-list="false"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="true"
          >
            <!-- <img v-if="formInfo.data.url" :src="formInfo.data.url" class="avatar" /> -->
            <el-image v-if="formInfo.data.companyLogo" style="width: 100px; height: 100px" :src="formInfo.data.companyLogo" fit="fill" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="formInfo.data.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="紧急联络人" prop="contactsName">
          <el-input v-model="formInfo.data.contactsName" placeholder="请输入紧急联络人" />
        </el-form-item>
        <el-form-item label="紧急联系方式" prop="contactsWay">
          <el-input v-model="formInfo.data.contactsWay" placeholder="请输入紧急联系方式" />
        </el-form-item>
        <el-form-item label="擅长类型" prop="shtick">
          <el-select v-model="formInfo.data.shtick" placeholder="请选择擅长类型" filterable allow-create clearable>
            <el-option
              v-for="dict in member_shtick_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="技术级别" prop="technologyRank">
          <el-select v-model="formInfo.data.technologyRank" placeholder="请选择技术级别" clearable>
            <el-option
              v-for="item in listTypeInfo.technologyRankList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script name="MemberManagement">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;//
    const { member_shtick_type } = instance.useDict("member_shtick_type");
    const activeName = ref('second')
    // tabs
    const handleClickTabs = (tab, event) => {
      // console.log(tab, event)
      if(tab.props.name == "first"){
        instance.getList()
      }else{
        instance.getDataList()
      }
    }

    /* 事件回调统一处理 */
    const handleClick = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };
    const handleEvent = (event, dada, item) => {
      if (Reflect.has(instance, event)) {
        instance[event](dada, item);
      } else {
        throw new Error(`${event}事件未定义`);
      }
    };

    return {
      activeName,
      member_shtick_type,
      handleClickTabs,
      handleClick,
      handleEvent,
      ...mainForm(instance),
      ...mainTable(instance),
      ...baseDialog(instance),
    }
  }
})

</script>

<style scoped lang="scss">
.app-container :deep(.el-dialog){
  .el-dialog__body{
    height: calc(100% - 90px) !important;
    .el-form{
      height: 100%;
      .el-form-item{
        height: 100%;
        .el-form-item__content{
          height: 100%;
          .el-tree{
            height: calc(100% - 36px);
            overflow-y: auto;
          }
          .avatar-uploader .el-upload {
            width: 100px;
            height: 100px;
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
          }

          .avatar-uploader .el-upload:hover {
            border-color: var(--el-color-primary);
          }

          .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
          }
        }
      }
    }
  }
} 
.app-container :deep(.el-tabs__content) {
  height: calc(100vh - 180px);
}
.el-tree{
  height: 76vh;
  overflow-y: auto;
}
.app-container {
  padding: 20px;
  height: calc(100vh - 84px);
}

.app-container>.el-row {
  height: 100%;
}

.app-container>.el-col {
  height: 100% !important;
  overflow: hidden;
}

.app-container :deep(.el-tabs__content) #pane-second {
  height: 81vh;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}
.app-container :deep(.el-tabs__content) #pane-second .el-table {
  flex: 1;
}
.el-col-20 {
  height: 81vh;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}

.el-col-20 .el-table {
  flex: 1;
}
</style>

