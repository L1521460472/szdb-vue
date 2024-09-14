<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-09-14 10:48:38
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <!-- <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div> -->
        <div class="head-container">
          <el-tree
              :data="listTypeInfo.deptList"
              :props="{ label: 'categoryName', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
              >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span class="custom-edit-append">
                    <span class="edit-append">
                      <a @click.stop="deptOptionsUp(data)"> <el-icon color="#409eff"><Edit /></el-icon> </a>
                    </span>
                    <span class="edit-append">
                      <a @click.stop="deptOptionsDe(data)"> <el-icon color="#409eff"><Delete /></el-icon> </a>
                    </span>
                  </span>
                </span>
              </template>
            </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" style="border-left: 1px solid #e5e5e5;">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="项目企业" prop="projectEnterpriseId">
            <el-select v-model="queryParams.projectEnterpriseId" placeholder="项目企业" style="width: 200px">
                <el-option
                    v-for="item in listTypeInfo.categoryList"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
              <!-- <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
              >新增</el-button> -->
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tableData" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="项目企业" align="center" prop="projectEnterpriseName">
            <!-- <template #default="scope">
              <span @click="handleToDoOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectEnterpriseName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <!-- <el-table-column label="负责部门" align="center" prop="responsibleDepartmentName" />
          <el-table-column label="负责人" align="center" prop="responsibleUserName" /> -->
          <el-table-column label="项目备注" align="center" prop="projectRemarks" />
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="delete" @click="handleDelete(scope.row)"></el-button>
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
    <!-- 添加或修改项目层级弹框 -->
    <el-dialog title="修改项目层级名称" v-model="openDeptOptionsUp" :close-on-click-modal="false" width="500px" append-to-body>
      <div class="text">
        <el-input
            v-model="deptOptionsParams.categoryName"
            :rows="5"
            placeholder="请输入项目层级名称"
        />
        <div class="dialog-footer" style="margin-top: 10px">
          <el-button type="primary" @click="submitDeptOptionsUp" style="margin-left: 320px">确 定</el-button>
          <el-button @click="openDeptOptionsUp = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script name="ProjectTemplate">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;

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

.el-col-20 {
  height: 100%;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}

.el-col-20 .el-table {
  flex: 1;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-edit-append{
  display: flex;
  align-items: center;
}
.custom-tree-node .edit-append{
  display: none;
  margin-right: 6px;
}
.custom-tree-node:hover .edit-append{
  display: block;
}
.el-tree{
  height: 86vh;
  overflow-y: auto;
}
</style>

