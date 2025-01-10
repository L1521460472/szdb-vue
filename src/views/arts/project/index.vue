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
                 :data="deptOptions"
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
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="queryParams.projectName"
                  placeholder="请输入项目名称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="项目状态" prop="projectState">
                 <el-select
                    v-model="queryParams.projectState"
                    placeholder="项目状态"
                    clearable
                    style="width: 240px"
                 >
                    <el-option
                       v-for="dict in options"
                       :key="dict.value"
                       :label="dict.label"
                       :value="dict.value"
                    />
                 </el-select>
              </el-form-item>
              <el-form-item label="负责人" prop="projectResponsibilityUserId">
                <el-select
                  v-model="queryParams.projectResponsibilityUserId"
                  placeholder="负责人"
                  filterable
                  clearable
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in userOptions"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="制作人" style="width: 308px;">
                <el-select
                  v-model="queryParams.projectResponsibilityUserId"
                  placeholder="制作人"
                  clearable
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in userOptions"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item>
                 <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                 <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
           </el-form>

           <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                 <el-button
                    type="primary"
                    plain
                    icon="Plus"
                    @click="handleAdd"
                 >新增</el-button>
              </el-col>
              <el-col :span="1.5">
                 <el-button
                    plain
                    icon="Upload"
                    @click="handleImport"
                 >批量导入</el-button>
              </el-col>
              <el-col :span="1.5">
                 <el-button
                    plain
                    icon="Delete"
                    v-if="showType == 'table'"
                    @click="handleDelete"
                 >批量删除</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" @showType="handleShowType" :grid="true"></right-toolbar>
           </el-row>

           <el-table v-loading="loading" border :data="projectList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" v-if="showType == 'table'">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="序号" width="55" align="center" type="index" v-if="columns[0].visible" />
              <el-table-column label="名称" align="center" min-width="160" key="projectName" prop="projectName" v-if="columns[1].visible" :show-overflow-tooltip="true">
                 <template #default="scope">
                    <span @click="handleProjectOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.projectName }}</span>
                 </template>
              </el-table-column>
              <el-table-column label="状态" align="center" key="projectState" prop="projectState" :show-overflow-tooltip="true">
                <template #default="scope">
                  <span v-if="scope.row.projectState == '1'">正常</span>
                  <span v-else-if="scope.row.projectState == '2'">紧张</span>
                  <span v-else-if="scope.row.projectState == '3'">延期</span>
                  <span v-else>已完成</span>
                </template>
              </el-table-column>
              <el-table-column label="阶段" align="center" key="projectStage" prop="projectStage" v-if="columns[2].visible" :show-overflow-tooltip="true" />
              <el-table-column label="进度" align="center" key="projectRate" prop="projectRate" v-if="columns[3].visible" :show-overflow-tooltip="true" />
              <el-table-column label="负责部门" align="center" min-width="100" key="responsibleDepartmentName" prop="responsibleDepartmentName" v-if="columns[4].visible" :show-overflow-tooltip="true" />
              <el-table-column label="负责人" align="center" key="responsibleUserName" prop="responsibleUserName" v-if="columns[5].visible" :show-overflow-tooltip="true" />
              <el-table-column label="立项日期" align="center" key="projectApprovalTime" prop="projectApprovalTime" v-if="columns[6].visible" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="计划开始日期" align="center" key="plannedStartTime" prop="plannedStartTime" v-if="columns[7].visible" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="计划结束日期" align="center" key="plannedEndTime" prop="plannedEndTime" v-if="columns[8].visible" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="项目备注" align="center" key="projectRemarks" prop="projectRemarks" v-if="columns[9].visible" :show-overflow-tooltip="true" />
              <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
                 <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                       <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="封面" placement="top">
                       <el-button link type="primary" icon="Picture" @click="handleCover(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="状态" placement="top">
                       <el-button link type="primary" style="font-size: 18px;" icon="WarnTriangleFilled" @click="handleStatusUpdate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="存为模板" placement="top">
                       <el-button link type="primary" icon="DocumentCopy" @click="handleTemplate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                       <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
                    </el-tooltip>
                 </template>
              </el-table-column>
           </el-table>
           <div class="grid-list" v-else>
            <div class="banner-box">
              <div class="banner-box-list" v-for="(row,idx) in projectList" @click="handleProjectOpen(row)" :key="idx">
                <div class="banner-box-list-bg">
                  <div class="banner-box-list-name-three" v-if="row.projectState == 3">
                    <div class="banner-box-list-name-text-three" :title="row.projectName">{{ row.projectName }}</div>
                    <div class="banner-box-list-name-text1">{{ row.projectExplanatory }}</div>
                  </div>
                  <div class="banner-box-list-name-four" v-else-if="row.projectState == 4">
                    <div class="banner-box-list-name-text-three" :title="row.projectName">{{ row.projectName }}</div>
                    <div class="banner-box-list-name-text1">{{ row.projectExplanatory }}</div>
                  </div>
                  <div class="banner-box-list-name" v-else>
                    <div class="banner-box-list-name-text" :title="row.projectName">{{ row.projectName }}</div>
                    <div class="banner-box-list-name-text2">{{ row.projectExplanatory }}</div>
                  </div>
                  <div class="banner-box-list-top">
                    <el-image style="max-width: 270px; max-height: 200px" :src="row.projectThumbnail?row.projectThumbnail : defaultUrl" fit="fill" />
                    <div class="banner-box-list-center">
                      <el-dropdown ref="dropdown1" trigger="contextmenu">
                        <span class="el-dropdown-link">
                          <!-- <el-icon><MoreFilled /></el-icon> -->
                          <el-button @click.stop="showClick(idx)" style="transform:rotate(90deg);color: #666;cursor: pointer;" :icon="MoreFilled" circle />
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item @click="handleUpdate(row)">编辑</el-dropdown-item>
                            <el-dropdown-item @click="handleCover(row)">设置封面</el-dropdown-item>
                            <el-dropdown-item @click="handleStatusUpdate(row)">状态</el-dropdown-item>
                            <el-dropdown-item @click="handleTemplate(row)">存为模板</el-dropdown-item>
                            <el-dropdown-item @click="handleDelete(row)">删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                  <div class="banner-box-list-bottom">
                    <div class="banner-box-list-bottom-left">
                      <div>{{ row.responsibleUserName }}</div>
                      <div>{{ row.projectStage }} - {{ row.projectRate }}%</div>
                    </div>
                    <div class="banner-box-list-bottom-right">
                      <div v-if="row.projectState == 1">
                        <div class="circle-text-one"></div> <span class="text-color-one">进度正常</span>
                      </div>
                      <div v-if="row.projectState == 2">
                        <div class="circle-text-tow"></div> <span class="text-color-tow">存在风险</span>
                      </div>
                      <div v-if="row.projectState == 3">
                        <div class="circle-text-three"></div> <span class="text-color-three">进度失控</span>
                      </div>
                      <div v-if="row.projectState == 4">
                        <div class="circle-text-four"></div> <span class="text-color-four">已完成</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>
           <pagination
              v-show="total > 0"
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
           />
        </el-col>
     </el-row>

     <!-- 添加或修改项目弹框 -->
     <el-dialog :title="title" v-model="open" width="70%" :close-on-click-modal="false" append-to-body>
      <el-collapse v-model="activeNames">
        <el-button class="el-collapse-box" type="primary" @click="handleImportTemplate">引入模板</el-button>
        <el-collapse-item title="项目信息" name="1">
          <el-form :model="form" :rules="rules" ref="projectRef" label-width="110px">
            <el-row>
                <el-col :span="8">
                  <el-form-item label="项目编码" prop="projectCode">
                      <el-input v-model="form.projectCode" placeholder="请输入项目编码" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目企业" prop="projectEnterpriseName">
                    <el-autocomplete
                      v-model="form.projectEnterpriseName"
                      :fetch-suggestions="querySearch"
                      clearable
                      class="inline-input w-50"
                      placeholder="项目企业"
                      @select="handleSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="批次" prop="projectBatchName">
                    <el-autocomplete
                      v-model="form.projectBatchName"
                      :fetch-suggestions="querySearch2"
                      clearable
                      class="inline-input w-50"
                      placeholder="批次"
                      @select="handleBatchSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目代号" prop="projectCategoryOneName">
                    <el-autocomplete
                      v-model="form.projectCategoryOneName"
                      :fetch-suggestions="querySearch1"
                      clearable
                      class="inline-input w-50"
                      placeholder="项目代号"
                      @select="handleSelect1"
                    />
                  </el-form-item>
                </el-col>

            </el-row>
            <el-row>
              <el-col :span="8">
                  <el-form-item label="制作部门" prop="productionDepartmentId">
                    <el-cascader  v-model="form.productionDepartmentId" :options="departmentOptions" :props="props" filterable :show-all-levels="false" clearable />
                    <!-- <el-select
                      v-model="form.productionDepartmentId"
                      filterable
                      placeholder="制作部门"
                    >
                      <el-option
                        v-for="item in restaurantThree"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId"
                      />
                    </el-select> -->
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="form.projectName" placeholder="请输入项目名称" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注释" prop="projectExplanatory">
                    <el-input v-model="form.projectExplanatory" placeholder="请输入注释" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                  <el-form-item label="项目流程" prop="artsProjectFlowPathName">
                    <el-select
                      v-model="form.artsProjectFlowPathName"
                      multiple
                      filterable
                      allow-create
                      :reserve-keyword="false"
                      placeholder="项目流程"
                      @blur="handleFlowBlur"
                      @change="handleFlowChange"
                    >
                      <el-option
                        v-for="item in flowList"
                        :key="item.id"
                        :label="item.flowPathName"
                        :value="item.flowPathName"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="制作周期(天)" prop="productionCycle">
                    <el-input v-model="form.productionCycle" placeholder="请输入制作周期（天）" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目周期(天)" prop="projectCycle">
                  <el-input v-model="form.projectCycle" placeholder="请输入项目周期（天）" />
                </el-form-item>
              </el-col>
          </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="立项日期" prop="projectApprovalTime">
                    <el-date-picker
                      v-model="form.projectApprovalTime"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划开始日期" prop="plannedStartTime">
                    <el-date-picker
                      v-model="form.plannedStartTime"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="handleChangeStartDate"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划结束日期" prop="plannedEndTime">
                    <el-date-picker
                      v-model="form.plannedEndTime"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="handleChangeDate"
                    />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="项目备注" prop="projectRemarks">
                    <el-input v-model="form.projectRemarks" placeholder="请输入项目备注"  type="textarea" />
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="原画参考" prop="projectRemarks">
                    <el-upload
                      ref="uploadRef3"
                      class="avatar-uploader"
                      :limit="1"
                      accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
                      :show-file-list="false"
                      :headers="upload3.headers"
                      :action="upload3.url"
                      :disabled="upload3.isUploading"
                      :auto-upload="true"
                      :on-progress="handleFileUploadProgress3"
                      :on-success="handleFileSuccess3"
                    >
                      <img v-if="form.projectPaintingUrl" :src="form.projectPaintingUrl" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="财务信息" name="2">
          <el-form :model="form" :rules="rules" ref="projectRef1" label-width="110px">
            <el-row>
                <el-col :span="8">
                  <el-form-item label="商务(天)" prop="commerceDay">
                      <el-input v-model="form.commerceDay" placeholder="请输入商务(天)" maxlength="30" @change="handleChangePrice" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单价(人天)" prop="unitPrice">
                      <el-input v-model="form.unitPrice" placeholder="请输入单价" maxlength="30" @change="handleChangePrice" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="订单金额(元)" prop="orderAmount">
                      <el-input v-model="form.orderAmount" placeholder="请输入订单金额" maxlength="30" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                  <el-form-item label="制作" prop="fabrication">
                    <el-radio-group v-model="form.fabrication" class="ml-4">
                      <el-radio label="1">公司制作</el-radio>
                      <el-radio label="2">外包制作</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.fabrication == 2">
                  <el-form-item label="外包金额(元)" prop="outsourcingAmount">
                    <el-input v-model="form.outsourcingAmount" placeholder="请输入外包金额"  type="text" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="内部全职" prop="isContractor">
                    <el-radio-group v-model="form.isContractor" class="ml-4">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="备注" prop="remarks">
                    <el-input v-model="form.remarks" placeholder="请输入备注"  type="textarea" />
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="项目成员" name="3" disabled>
          <div class="dialog-member-title">
              <div>负责人：<span style="margin-right: 20px;color: #00a660;"> {{ fzUserData.length }}</span>PM： <span style="margin-right: 20px;color: #67C23A">{{ pmObj.userId ? 1 : 0 }}</span>制作人： <span style="margin-right: 20px;color: #409eff;">{{ zzUserData.length }}</span></div>
              <!-- <div><el-button :icon="Plus" @click="handleAddMember">添加成员</el-button></div> -->
            </div>
            <div class="dialog-member-box">
              <div class="dialog-member-box-left">
                <div style="display: flex;align-items: center;margin-bottom: 16px;font-size: 16px;margin-left: 0px;">
                  <span style="margin-right: 6px">项目负责人</span>
                  <img style="width: 19px; height: 16px;cursor: pointer;" src="@/assets/images/user04.png" @click="handleAddMember('1')"/>
                  <!-- <el-button :icon="Plus" size="small" type="warning" @click="handleAddMember('1')" circle /> -->
                </div>
                <div v-if="fzUserData.length > 0" style="height: calc(100% - 44px);overflow-y: auto;">
                  <div class="el-result" style="border: 1px solid #00a660;border-radius: 16px;width: 96%;padding-left: 4px;background-color: #00a660;color: #fff;margin-bottom: 10px;" v-for="(item,index) in fzUserData" key="item">
                    负责人：{{ item.userName }}
                    <div class="el-result__extra1">
                      <el-button :icon="Delete" type="primary" size="small" @click="handleSetMember1(index)" circle />
                    </div>
                  </div>
                </div>
                <div style="height: 100%;display: flex;justify-content: center;" v-else>
                  <!-- <div class="title-circle title-circle-leader" @click="handleAddMember"> -->
                  <div class="title-circle title-circle-leader">
                    <el-icon style="color: #fff;"><Plus /></el-icon>
                  </div>
                </div>
              </div>
              <div class="dialog-member-box-left">
                <div style="display: flex;align-items: center;margin-bottom: 16px;font-size: 16px;margin-left: 10px;">
                  <span style="margin-right: 6px">PM跟进人</span>
                  <img style="width: 19px; height: 16px;cursor: pointer;" src="@/assets/images/user1.png" @click="handleAddMember('3')"/>
                  <!-- <el-button :icon="Plus" size="small" type="warning" @click="handleAddMember('3')" circle /> -->
                </div>
                <el-result v-if="pmObj.userId" :title="pmObj.userName" sub-title="">
                  <template #icon>
                    <div class="title-circle title-circle-leader">{{ getTwo(pmObj.userName) }}</div>
                  </template>
                  <template #extra>
                    <el-button :icon="Delete" type="danger" @click="handleSetMemberPm" circle />
                  </template>
                </el-result>
                <div style="height: 100%;display: flex;justify-content: center;" v-else>
                  <!-- <div class="title-circle title-circle-leader" @click="handleAddMember"> -->
                  <div class="title-circle title-circle-leader">
                    <el-icon style="color: #fff;"><Plus /></el-icon>
                  </div>
                </div>
              </div>
              <div class="dialog-member-box-right">
                <div style="display: flex;align-items: center;margin-bottom: 16px;font-size: 16px;margin-left: 20px;">
                  <span style="margin-right: 6px">项目制作人</span>
                  <img style="width: 19px; height: 16px;cursor: pointer;" src="@/assets/images/user2.png" @click="handleAddMember('2')"/>
                  <!-- <el-button :icon="Plus" size="small" type="warning" @click="handleAddMember('2')" circle /> -->
                </div>
                <div class="member-box-list">
                  <div class="member-list el-result" v-if="zzUserData.length > 0" v-for="(item,index) in zzUserData" :key="item.userId">
                    <div>
                      <div class="el-result__icon" style="width:100%;height: 64px;display: flex;justify-content: center;">
                        <div class="title-circle">{{ getTwo(item.userName) }}</div>
                      </div>
                      <div class="el-result__title" style="width:90%;height: 24px;display: flex;justify-content: center;flex-wrap: nowrap;font-size: 16px;overflow: hidden;">
                        <el-tooltip :content="item.userName" placement="top">
                          <span>{{ item.userName }}</span>
                        </el-tooltip>
                      </div>
                      <div style="width:100%;height: 24px;display: flex;flex-wrap: wrap;align-items: center;margin-top: 2px;">
                        <span v-for="(v,indexs) in item.stageNames" :key="indexs">
                          <span>{{ v.stageName }}<span v-if="v.stageName && indexs != (item.stageNames.length - 1)"><el-divider direction="vertical" /></span></span>
                        </span>
                      </div>
                      <div class="el-result__extra">
                        <el-button :icon="Delete" type="danger" @click="handleSetMember2(index)" circle />
                      </div>
                    </div>
                  </div>
                  <div style="height: 100%;display: flex;margin-left: 30px;" v-else>
                    <!-- <div class="title-circle" @click="handleAddMember(2)"> -->
                    <div class="title-circle">
                      <el-icon style="color: #fff;"><Plus /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </el-collapse-item>
      </el-collapse>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitForm" :loading="btnLoading">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
           </div>
        </template>
     </el-dialog>

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
     <!-- 设置成员对话框 -->
     <el-dialog title="设置成员" v-model="setMemberOpen" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form :model="setMemberform" ref="setMemberRef" label-width="80px">
        <el-form-item label="成员" prop="userName" :rules="
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur',
          }
        ">
          <span>{{ setMemberform.userName }}</span>
        </el-form-item>
        <el-form-item label="角色" prop="type" :rules="
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur',
          }
        ">
          <el-radio-group v-model="setMemberform.type">
            <el-radio label="1">项目负责人</el-radio>
            <el-radio label="3">PM跟进人</el-radio>
            <el-radio label="2">项目制作人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责阶段" prop="stage" v-if="setMemberform.type == '2'" :rules="
        {
          required: true,
          message: '请选择负责阶段',
          trigger: 'blur',
        }
       ">
          <el-checkbox-group v-model="setMemberform.stage">
            <el-checkbox :label="item.dictLabel" name="type" v-for="item in checkboxList" :key="item.dictCode" />
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="操作">
          <el-checkbox-group v-model="setMemberform.type2">
            <el-checkbox-button label="移除成员" name="type" />
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="danger" @click="submitremoveMemberForm">移除成员</el-button>
              <el-button v-if="setMemberform.isShow == 1" type="primary" @click="submitSetMemberForm1">确 定</el-button>
              <el-button v-if="setMemberform.isShow == 3" type="primary" @click="submitSetMemberFormPM">确 定</el-button>
              <el-button v-else type="primary" @click="submitSetMemberForm2">确 定</el-button>
              <el-button @click="setMemberOpen = false">取 消</el-button>
           </div>
        </template>
     </el-dialog>
     <!-- 新增成员对话框 -->
     <el-dialog title="添加成员" v-model="addMemberOpen" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form :model="addMemberform" ref="addMemberRef" label-width="80px">
        <!-- <el-form-item label="成员角色" prop="type" :rules="
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur',
          }
        ">
          <el-radio-group v-model="addMemberform.type" @change="handleChangeMember">
            <el-radio label="1">项目负责人</el-radio>
            <el-radio label="3">PM跟进人</el-radio>
            <el-radio label="2">项目制作人</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="负责阶段" prop="stage" v-if="addMemberform.type == '2'" :rules="
        {
          required: true,
          message: '请选择负责阶段',
          trigger: 'blur',
        }
       ">
          <el-checkbox-group v-model="addMemberform.stage">
            <el-checkbox :label="item.dictLabel" name="type" v-for="item in checkboxList" :key="item.dictCode" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择成员" prop="userIdList" :rules="
          {
            required: true,
            message: '请选择成员',
            trigger: 'blur',
          }
         ">
          <el-select v-model="addMemberform.userIdList" filterable placeholder="请选择" :multiple="multiple" @change="handleChangeUser">
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
          <!-- <div class="dialogTree">

          </div> -->
        </el-form-item>
      </el-form>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitAddMemberForm">确 定</el-button>
              <el-button @click="addMembercCncel">取 消</el-button>
           </div>
        </template>
     </el-dialog>
     <!-- 项目详情对话框 -->
     <el-dialog title="项目详情" v-model="projectOpen" :close-on-click-modal="false" width="80%" append-to-body>
        <div class="dialog-member-title">
          <div style="width: 300px;">项目编号：{{projectform.projectCode}}</div>
          <div class="project-box-left-title">
            <div class="project-box-text">创建人：{{ projectform.createBy }}</div>
            <div class="project-box-text">跟进PM：{{ projectform.pmName }}</div>
            <div class="project-box-text">创建时间：{{ projectform.createTime }}</div>
            <div class="project-box-text">最后更新：{{ projectform.updateTime }}</div>
          </div>
          <!-- <div><el-button @click="handleAddMember">设置</el-button></div> -->
        </div>
        <div class="project-box">
          <div class="project-box-left">
            <el-button type="primary" class="addTab" @click="handleTabsAdd">上传新版本</el-button>
            <el-tabs
              v-model="activeName"
              type="card"
              addable
              editable
              class="demo-tabs"
              @tab-click="handleClick"
              @edit="handleTabsEdit"
            >
              <el-tab-pane :label="item.projectLabelName" :name="index" v-for="(item,index) in projectform.artsProjectLabelImageVos">
                <div class="el-tab-pane-button">
                    <el-button @click="projectDownload(index)">下 载</el-button>
                    <el-button @click="projectUpload(index)">上 传</el-button>
                </div>
                <el-image v-if="item.stageFileAddress" :src="item.stageFileAddress" :preview-src-list="[item.stageFileAddress]" fit="contain" />
                <div style="width: 100%;height: 380px;line-height: 380px;text-align: center;" v-else> 请上传图稿 </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="project-box-right">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>阶段</span>
                </div>
              </template>
              <div v-for="(items,index) in projectform.artsProjectStages" :key="index" class="text item">
                <span>{{ items.projectStage }}</span>
                <span style="display: inline-block;width: 60%;">{{ items.userName }}</span>
                <span>{{ items.projectRate }} %</span>
              </div>
            </el-card>
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>备注</span>
                </div>
              </template>
              <div class="text">
                <el-input
                  v-model="projectform.projectRemarks"
                  :rows="5"
                  type="textarea"
                />
              </div>
            </el-card>
          </div>
        </div>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitProjectForm">确 定</el-button>
              <el-button @click="projectOpen = false">取 消</el-button>
           </div>
        </template>
     </el-dialog>
     <!-- 上传文件对话框 -->
     <el-dialog :title="upload.title" v-model="upload.open" :close-on-click-modal="false" width="400px" append-to-body>
         <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
            :headers="upload.headers"
            :action="upload.url"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
         >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <!-- <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div> -->
                  <span>请上传图片，建议270*200尺寸。</span>
                  <!-- <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link> -->
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 项目详情上传文件对话框 -->
     <el-dialog :title="upload1.title" v-model="upload1.open" :close-on-click-modal="false" width="400px" append-to-body>
         <el-upload
            ref="uploadRef1"
            :limit="1"
            accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
            :headers="upload1.headers"
            :action="upload1.url"
            :disabled="upload1.isUploading"
            :on-progress="handleFileUploadProgress1"
            :on-success="handleFileSuccess1"
            :auto-upload="false"
            drag
         >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
               </div>
            </template> -->
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm1">确 定</el-button>
               <el-button @click="upload1.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
     <!-- 变更状态对话框 -->
     <el-dialog title="变更状态" v-model="statusOpen" :close-on-click-modal="false" width="600px" append-to-body>
        <el-form :model="statusform" ref="statusRef" label-width="80px">
          <el-form-item label="项目状态" prop="projectState">
            <el-radio-group v-model="statusform.projectState">
              <el-radio label="1">进度正常</el-radio>
              <el-radio label="2">存在风险</el-radio>
              <el-radio label="3">进度失控</el-radio>
              <el-radio label="4">已完成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" prop="projectStateReason">
            <div class="text">
                <el-input
                  v-model="statusform.projectStateReason"
                  :rows="5"
                  type="textarea"
                />
              </div>
          </el-form-item>
        </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitStatusForm">确 定</el-button>
               <el-button @click="statusOpen = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
     <!-- 添加tabs标签对话框 -->
     <el-dialog title="上传新版本" v-model="tabsOpen" :close-on-click-modal="false" width="500px" append-to-body>
        <el-form :model="tabsform" ref="tabsRef" label-width="60px">
          <el-form-item label="标签" prop="title" :rules="
          {
            required: true,
            message: '请输入标签',
            trigger: 'blur',
          }
         ">
            <div class="tabs-text">
                <el-input
                  v-model="tabsform.title"
                />
              </div>
          </el-form-item>
          <el-form-item label="文件" prop="fileName" class="fileUpload">
            <!-- <div class="tabs-text">
              <el-input
                v-model="tabsform.fileName"
              />
              <el-button @click="handleFileOpen">上传文件</el-button>
            </div> -->
            <el-upload
              ref="uploadRef2"
              :limit="1"
              accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
              :headers="upload1.headers"
              :action="upload1.url"
              :disabled="upload1.isUploading"
              :on-progress="handleFileUploadProgress1"
              :on-success="handleFileSuccess1"
              :auto-upload="true"
              drag
          >
              <el-icon class="el-icon--upload"><Plus /></el-icon>
              <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
              <!-- <template #tip>
                <div class="el-upload__tip text-center">
                    <div class="el-upload__tip">
                      <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                    </div>
                    <span>仅允许导入xls、xlsx格式文件。</span>
                    <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
                </div>
              </template> -->
          </el-upload>
          </el-form-item>
        </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitTabsForm">确 定</el-button>
               <el-button @click="tabsOpen = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 批量导入对话框 -->
      <el-dialog :title="upload2.title" v-model="upload2.open" width="400px" append-to-body>
         <el-upload
            ref="uploadRef2"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload2.headers"
            :action="upload2.url + '?updateSupport=' + upload2.updateSupport"
            :disabled="upload2.isUploading"
            :on-progress="handleFileUploadProgress2"
            :on-success="handleFileSuccess2"
            :auto-upload="false"
            drag
         >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <!-- <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div> -->
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm2">确 定</el-button>
               <el-button @click="upload2.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 引入模板对话框 -->
      <el-dialog title="引入模板" v-model="templateOpen" width="450px" :close-on-click-modal="false">
        <el-table v-loading="loading" :data="templateTableData">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="项目企业" align="center" prop="projectEnterpriseName" />
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
              <template #default="scope">
                <el-tooltip content="引用" placement="top">
                    <el-button link type="primary" icon="Select" @click="handleConfirm(scope.row)"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>
        </el-table>
        <!-- <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="handleConfirm">确 定</el-button>
              <el-button @click="handleCancel">取 消</el-button>
          </div>
        </template> -->
      </el-dialog>
  </div>
</template>

<script setup name="Project">

import { getToken } from "@/utils/auth";
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser, deptTreeSelect } from "@/api/system/user";
import { listCategory,listCategoryDetail,listCategoryByType,listProject,deptList,departmentList,userList,dictData,addProject,editProject,delProject,getProject,getDetailsAdd,upProjectThumbnail,upState,flowPathList,setTemplate,projectBatch,delProjectCategory,editProjectCategory,download} from "@/api/project/project";
import {Grid,Expand,Plus,UserFilled,Setting,MoreFilled,Picture,WarnTriangleFilled,Delete} from '@element-plus/icons-vue'
import { listTemplate } from "@/api/project/projectTemplate";
import { cloneDeep, set } from 'lodash-es';
import {HOLIDAY} from './hooks/holiday.js';
import defaultUrl from '../../../assets/logo/image.png';
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
// const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");


const showType = ref('grid');
const projectList = ref([]);
const templateTableData = ref([]);
const open = ref(false);
const openDeptOptionsUp = ref(false);
const setMemberOpen = ref(false);
const addMemberOpen = ref(false);
const projectOpen = ref(false);
const statusOpen = ref(false);
const tabsOpen = ref(false);
const templateOpen = ref(false);
const loading = ref(true);
const btnLoading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const departmentOptions = ref([]);//部门
const userOptions = ref([]);//成员
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const activeName = ref(0)
const imgUrl = ref(null)
const dropdown1 = ref(null)
const uploadRef1 = ref(null)
const uploadRef2 = ref(null)
const uploadRef3 = ref(null)
const restaurantOne = ref([])
const restaurantTow = ref([])
const restaurantThree = ref([])

// 
const batchList = ref([])
const activeNames = ref(['1','2','3'])
const props = {
  value: 'id',
  // expandTrigger: 'hover',
  checkStrictly : true
}
/*** 上传文件*/
const upload = reactive({
 // 是否显示弹出层（用户导入）
 open: false,
 // 弹出层标题（用户导入）
 title: "",
 // 是否禁用上传
 isUploading: false,
// 是否封面上传
 isCover: false,
 // 是否更新已经存在的用户数据
 updateSupport: 0,
 // 设置上传的请求头部
 headers: { Authorization: "Bearer " + getToken() },
 // 上传的地址
 url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
 id: null,
});
/*** 项目详情上传文件*/
const upload1 = reactive({
 // 是否显示弹出层（用户导入）
 open: false,
 // 弹出层标题（用户导入）
 title: "",
 // 是否禁用上传
 isUploading: false,
// 是否封面上传
 isCover: false,
 // 是否更新已经存在的用户数据
 updateSupport: 0,
 // 设置上传的请求头部
 headers: { Authorization: "Bearer " + getToken() },
 // 上传的地址
 url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
 id: null,
});
/*** 批量导入参数 */
const upload2 = reactive({
  // 是否显示弹出层（批量导入）
  open: false,
  // 弹出层标题（批量导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的批量数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/arts/project/import"
});
/*** 原话 */
const upload3 = reactive({
  // 是否显示弹出层（批量导入）
  open: false,
  // 弹出层标题（批量导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的批量数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/common/upload"
});
const options = ref([{
          value: 1,
          label: '正常',
          disabled: true,
        }, {
          value: 2,
          label: '紧张'
        }, {
          value: 3,
          label: '延期'
        }, {
          value: 4,
          label: '已完成'
        }]);
// 列显隐信息
const columns = ref([
 { key: 0, label: `用户编号`, visible: true },
 { key: 1, label: `用户名称`, visible: true },
 { key: 2, label: `用户昵称`, visible: true },
 { key: 3, label: `部门`, visible: true },
 { key: 4, label: `手机号码`, visible: true },
 { key: 5, label: `状态`, visible: true },
 { key: 6, label: `创建时间`, visible: true },
 { key: 7, label: `创建时间`, visible: true },
 { key: 8, label: `创建时间`, visible: true },
 { key: 9, label: `创建时间`, visible: true },
 { key: 10, label: `创建时间`, visible: true },
]);
// 阶段列表
const checkboxList = ref([]);
// 流程列表
const flowList = ref([]);
//设置状态
const statusform = reactive({
  id: null,
  projectState: '1',
  projectStateReason:''
})
//添加标签
const tabsform = reactive({
  title:'',
  fileName:'',
  url:'',
})
//设置成员
const setMemberform = reactive({
  type: '1',
  stage: [],
  stageNames:[],
  userId: '',
  userName: '',
  userIdList: [],
  userNameList: [],
  isShow: 1,//1 负责人， 2 制作人， 3 PM
  index: 0,//
})
const userNameList = ref([])
const userNameListLeader = ref([])//负责人名称，如果有则过滤
const userNameListLeader1 = ref([])//制作人名称，如果有则过滤
const userData = ref([]) // 项目成员   1 负责人， 2 制作人， 3 PM

// 负责人
const fzUserData = ref([])

// PM跟进人
const pmObj = ref({
  userId: null,
  userName: null,
  projectRole: null,
})
// 制作人
const zzUserData = ref([])

const artsProjectMemberList = ref([])
//新增成员
const addMemberform = reactive({
  type: '1',
  stage: [],
  stageNames:[],
  userIdList: null,
  userNameList: [],
  userIdListLeader: [],
  userNameListLeader: [],
  userId: '',
  userName: '',
})
//项目详情
const projectform = ref({
  artsProjectStages: [],
  artsProjectLabelImageVos: [],
  createBy: null,
  createTime: null,
  projectCode: null,
  projectId: null,
  projectRemarks: null,
  projectState: null,
  updateTime: null,
  index: 0,
})
//新建项目
const data = reactive({
 form: {
  projectEnterpriseName: '',
  projectBatchName: '',
  projectCategoryOneName: '',
  projectCategoryTwoName: '',
  projectPaintingUrl: '',
  projectPaintingUrlName: '',
  commerceDay: null,
  unitPrice: null,
  fabrication: null,
  outsourcingAmount: null,
  orderAmount: null,
  projectId: null,
  remarks: null,
  isContractor: null,
  artsProjectMemberVos: [],
  artsProjectFlowPathIdList: [],
  artsProjectFlowPathName: [],
  artsProjectFinance:{
    // unitPrice: null,
    // fabrication: null,
    // outsourcingAmount: null,
    // orderAmount: null,
    // projectId: null,
    // remarks: null,
    // isContractor: null,
  },//财务信息
 },
 queryParams: {
   pageNum: 1,
   pageSize: 50,
   projectName: undefined,
   projectState: undefined,
   projectResponsibilityUserId: undefined
 },
 rules: {
   projectCode: [{ required: true, message: "项目编码不能为空", trigger: "blur" }],
   projectName: [{ required: true, message: "项目名称不能为空", trigger: "blur" }],
   projectEnterpriseName: [{ required: true, message: "项目企业不能为空", trigger: "change" }],
   projectCategoryOneName: [{ required: true, message: "项目分类1不能为空", trigger: "change" }],
   projectCategoryTwoName: [{ required: true, message: "项目分类2不能为空", trigger: "change" }],
   projectApprovalTime: [{ required: true, message: "立项日期不能为空", trigger: "blur" }],
   plannedStartTime: [{ required: true, message: "计划开始日期不能为空", trigger: "blur" }],
   plannedEndTime: [{ required: true, message: "计划结束日期不能为空", trigger: "blur" }],
   productionDepartmentId: [{ required: true, message: "制作部门不能为空", trigger: "blur" }],
  //  projectExplanatory: [{ required: true, message: "注释不能为空", trigger: "blur" }],
   artsProjectFlowPathName: [{ required: true, message: "项目流程不能为空", trigger: "blur" }],
   commerceDay: [{ required: true, message: "商务人天不能为空", trigger: "blur" }],
   unitPrice: [{ required: true, message: "单价不能为空", trigger: "blur" }],
   fabrication: [{ required: true, message: "制作不能为空", trigger: "change" }],
   outsourcingAmount: [{ required: true, message: "外包金额不能为空", trigger: "blur" }],
   orderAmount: [{ required: true, message: "订单金额不能为空", trigger: "blur" }],
   isContractor: [{ required: true, message: "是否包人不能为空", trigger: "change" }],
   email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
   phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
 }
});

const { queryParams, form, rules } = toRefs(data);

const deptOptionsParams = ref(undefined);

//设置表格状态背景颜色
const tableRowClassName = ({row,rowIndex}) => {
  if (row.projectState === 2) {
    return 'warning-row'
  } else if (row.projectState === 3) {
    return 'red-row'
  } else if (row.projectState === 4) {
    return 'bule-row'
  }
  return ''
}

const getTwo = (val)=>{
  if(val.length > 2){
    val = val.substring(val.length - 2 )
  }
  return val
}
//平铺或表格
const handleShowType = (val)=>{
  showType.value = val
}
//点击显示下拉菜单
function showClick(index) {
  dropdown1.value[index].handleOpen()
}
//设置负责人成员弹框
const handleSetMember1 =async (index)=>{
  // setMemberform.isShow = 1
  // setMemberform.type = '1'
  // setMemberform.userId = fzUserData.value[index].userId
  // setMemberform.userName = fzUserData.value[index].userName
  // setMemberOpen.value = true;
  // 删除
  await userData.value.map((item,idx)=>{
    if((item.userId == fzUserData.value[index].userId) && (item.projectRole == '1')){
      userData.value.splice( idx, 1 );
    }
  })
  fzUserData.value.splice( index, 1 );
}
//设置PM弹框
const handleSetMemberPm = ()=>{
  // setMemberform.isShow = 3
  // setMemberform.type = '3'
  // setMemberform.userId = pmObj.value.userId
  // setMemberform.userName = pmObj.value.userName
  // setMemberOpen.value = true;
  // 删除
  pmObj.value.userId = null
  pmObj.value.userName = null
  pmObj.value.projectRole = null
  userData.value = userData.value.filter(item => item.projectRole != '3' )
}
//设置制作人成员弹框
const handleSetMember2 =async (index)=>{
  // setMemberform.isShow = 2
  // setMemberform.type = '2'
  // setMemberform.index = index
  // setMemberform.userId = zzUserData.value[index].userId
  // setMemberform.userName = zzUserData.value[index].userName
  // setMemberform.stage = zzUserData.value[index].stageNames.map((item)=>item.stageName)
  // setMemberOpen.value = true;
  // 删除
  await userData.value.map((item,idx)=>{
    if((item.userId == zzUserData.value[index].userId) && (item.projectRole == '2')){
      userData.value.splice( idx, 1 );
    }
  })
  zzUserData.value.splice( index, 1 );
}
//移除成员
const submitremoveMemberForm = ()=>{
  if(setMemberform.type == 1){
    form.value.projectResponsibilityUserId = null;
    form.value.responsibleUserName = null;
  }else{
    console.log(form.value?.artsProjectMemberVos,setMemberform,userNameList.value,setMemberform.index)
    userNameList.value = userNameList.value.filter(v=>v != setMemberform.userName)
    form.value?.artsProjectMemberVos.splice(setMemberform.index, 1);
    console.log(userNameList.value)
  }
  setMemberOpen.value = false;
}
//新增成员弹框
const handleAddMember = (val)=>{
  console.log(val)
  if(val == 3){
    multiple.value = false
  }else{
    multiple.value = true
  }
  addMemberform.userId = ''
  addMemberform.userName = ''
  addMemberform.userIdList = []
  addMemberform.type = val
  addMemberOpen.value = true;
}
//项目详情弹框
const handleProjectOpen = (row)=>{
  getProject(row.id).then(response => {
   activeName.value = 0;
   if(response.data.artsProjectLabelImageVos == null){
    response.data.artsProjectLabelImageVos = []
   }
   projectform.value = response.data;
  //  projectform.value.artsProjectStages = response.data.artsProjectStages.map((item,index)=>{
  //   item.name = index + 1;
  //   return item
  //  });
   projectOpen.value = true;
 });
}
//项目详情上传文件弹框
const projectUpload = (index)=>{
  upload.title = "上传";
  projectform.value.index = index
  upload.open = true;
}
//项目详情下载文件
const projectDownload = (index)=>{
  console.log('下载')
  let image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.src = projectform.value.artsProjectLabelImageVos[index].stageFileAddress;
  image.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob);
      let Link = document.createElement("a");
      Link.download = projectform.value.artsProjectLabelImageVos[index].projectLabelName;
      Link.href = url;
      Link.click();
      Link.remove();
      // 用完释放URL对象
      URL.revokeObjectURL(url);
    });
  }
//  download({fileName:projectform.value.artsProjectLabelImageVos[index].projectLabelName});
}
//项目详情tabs
const handleClick = (tab, event) => {
  // console.log(tab, event)
}
const handleTabsEdit = (targetName, action) => {
  if (action === 'add') {
    // console.log(targetName,111111)
  } else if (action === 'remove') {
    // console.log(targetName,222222)
    projectform.value.artsProjectLabelImageVos.splice(targetName,1)
    activeName.value = projectform.value.artsProjectLabelImageVos.length - 1
  }
}
//项目详情tabs 增减
const handleTabsAdd = (targetName, action) => {
  tabsform.title = '';
  tabsOpen.value = true;
  upload1.isCover = true;
  setTimeout(()=>{
    proxy.$refs["uploadRef2"].clearFiles()
  })

}
//部门下拉选择
const handleChangeDept = (value) => {
  // console.log(value)
}
//成员下拉选择
const handleChangeUser = (value) => {
  console.log(value)
  addMemberform.userNameList = []
  addMemberform.userNameListLeader = []
  userOptions.value.map((item)=>{
    if(multiple.value){
      value.map((v)=>{
        if(item.userId == v){
          if(addMemberform.type == 1 && !userNameListLeader.value.includes(item.userName)){
            userNameListLeader.value.push(item.userName)
            userData.value.push({
              projectRole: '1',
              userId: item.userId,
              userName: item.userName
            })
            fzUserData.value.push({
              projectRole: '1',
              userId: item.userId,
              userName: item.userName
            })
          }else if(addMemberform.type == 2 && !userNameListLeader1.value.includes(item.userName)){
            userNameListLeader1.value.push(item.userName)
            userData.value.push({
              projectRole: '2',
              userId: item.userId,
              userName: item.userName,
              stageNames: []
            })
            zzUserData.value.push({
              projectRole: '2',
              userId: item.userId,
              userName: item.userName,
              stageNames: []
            })
          }
        }
      })
    }else{
      if(item.userId == value){
        userData.value.push({
          projectRole: '3',
          userId: item.userId,
          userName: item.userName
        })
        pmObj.value.userId = item.userId
        pmObj.value.userName = item.userName
        pmObj.value.projectRole = '3'
      }
    }
    // userNameList.value = [...new Set(userNameList.value)]
  })
  // console.log(userData.value)
}
/** 添加成员节点单击事件 */
function handleMemberNodeClick(data) {
  // console.log(data)
  addMemberform.userId = data.id;
  addMemberform.userName = data.label;
};

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  console.log(value,data)
 if (!value) return true;
 return data.categoryName.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
 proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询项目下拉树结构 */
function getDeptTree() {
  listCategory().then(response => {
   deptOptions.value = response.rows;
 });
};
/** 查询企业 */
function getCategoryDetail(id) {
  listCategoryDetail(id).then(response => {
    restaurantOne.value = response.data.map((item)=>{
      item.value = item.categoryName
      item.link = item.id
      return item
    });
 });
};
function getCategoryByType(id) {
  listCategoryByType(id).then(response => {
    restaurantOne.value = response.data.map((item)=>{
      item.value = item.categoryName
      item.link = item.id
      return item
    });
 });
};

/** 查询项目批次 */
function getProjectBatch() {
  projectBatch().then(response => {
    batchList.value = response.data.map((item)=>{
      item.value = item.name
      item.link = item.id
      return item
    });
 });
};
/** 查询部门树 */
function getDeptTreeList() {
  deptList().then(response => {
    departmentOptions.value = response.data;
 });
};
/** 查询部门列表 */
function getDepartmentList() {
  departmentList().then(response => {
    restaurantThree.value = response.data;
 });
};
/** 查询成员列表 */
function getuserList() {
  userList({pageNum:1,pageSize:2000,status:0}).then(response => {
    userOptions.value = response.rows;
 });
};
/** 查询数据字典阶段列表 */
function getdictDataList() {
  dictData({dictType:'project_stage',pageSize: 500}).then(response => {
    checkboxList.value = response.rows;
 });
};
/** 查询流程列表 */
function getflowPathList() {
  flowPathList().then(response => {
    flowList.value = response.data;
 });
};
/** 查询项目列表 */
function getList() {
  // console.log(proxy.addDateRange())
 loading.value = true;
 listProject(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
   loading.value = false;
   projectList.value = res.rows;
   total.value = res.total;
 });
};

// 可输入框
const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurantOne.value.filter(createFilter(queryString))
    : restaurantOne.value
  // call callback function to return suggestions
  cb(results)
}
const querySearch1 = (queryString, cb) => {
  // console.log(restaurantOne.value,queryString, cb)
  const results = queryString
    ? restaurantTow.value.filter(createFilter(queryString))
    : restaurantTow.value
  // call callback function to return suggestions
  cb(results)
}
const querySearch2 = (queryString, cb) => {
  const results = queryString
    ? batchList.value.filter(createFilter(queryString))
    : batchList.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const handleSelect = (item) => {
  // console.log(item)
  form.value.projectEnterpriseId = item.id
  listCategoryDetail(item.id).then(response => {
    restaurantTow.value = response.data.map((v)=>{
      v.value = v.categoryName
      v.link = v.id
      return v
    });
 });
}
const handleBatchSelect = (item) => {
  // console.log(item)
  form.value.projectBatchId = item.id
}
const handleSelect1 = (item) => {
  // console.log(item)
//   form.value.projectCategoryOneId = item.id
//   listCategoryDetail(item.id).then(response => {
//     restaurantThree.value = response.data.map((v)=>{
//       v.value = v.categoryName
//       v.link = v.id
//       return v
//     });
//  });
}
const handleSelect2 = (item) => {
  // console.log(item)
  form.value.projectCategoryTwoId = item.id
}
//流程value改变
const handleFlowChange = (item) => {
  // console.log(item)
  item.map((v)=>{
    flowList.value.map((p)=>{
      if(p.flowPathName == v){
        form.value.artsProjectFlowPathIdList.push(p.id)
      }
    })
  })
  // form.value.projectCategoryTwoId = item.id
}
//流程输入框失去焦点改变
const handleFlowBlur = (val) => {
  let value = val.target.value;
  if(value){
    form.value.artsProjectFlowPathName.push(value)
  }
}
//单价改变计算金额
const handleChangePrice = (val) => {
  // console.log(val)
  if(form.value.commerceDay){
    form.value.orderAmount = Number(form.value.commerceDay) * Number(form.value.unitPrice)
  }
}



/** 节点单击事件 */
function handleNodeClick(data, v, p) {
  queryParams.value.productionDepartmentId = null
  if (data.children === null) {
    queryParams.value.productionDepartmentId = data.id
    queryParams.value.categoryId = data.parentId
  } else {
    queryParams.value.categoryId = data.id;
  }
  // deptOptionsParams.value = data;
  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
 queryParams.value.pageNum = 1;
 getList();
};
/** 重置按钮操作 */
function resetQuery() {
 dateRange.value = [];
 proxy.resetForm("queryRef");
 queryParams.value.deptId = undefined;
 proxy.$refs.deptTreeRef.setCurrentKey(null);
 handleQuery();
};
/** 项目层级修改 */
function deptOptionsUp(row) {
  deptOptionsParams.value = JSON.parse(JSON.stringify(row));
  if(row.category === 3){
    proxy.$modal.msgError("第三级只能进入项目内修改");
    return
  }
  openDeptOptionsUp.value = true;
};
/** 项目层级修改 */
function submitDeptOptionsUp() {

  const params = {
      id: deptOptionsParams.value.id,
      categoryName: deptOptionsParams.value.categoryName
  }
  editProjectCategory(params).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    getDeptTree();
    openDeptOptionsUp.value = false;
  });

};

/** 项目层级删除 */
function deptOptionsDe(row) {
  if (row.category === 3) {
    proxy.$modal.msgError("层级下存在项目 不允许删除");
    return
  }
  proxy.$modal.confirm('是否确认删除项目层级为"' + row.categoryName + '"的数据项？').then(function () {
    return delProjectCategory(row.id);
  }).then(() => {
    getDeptTree();

    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
};
/** 删除按钮操作 */
function handleDelete(row) {
 const userIds = row.id || ids.value;
 proxy.$modal.confirm('是否确认删除？').then(function () {
   return delProject(userIds);
 }).then(() => {
   getList();
   proxy.$modal.msgSuccess("删除成功");
 }).catch(() => {});
};
/** 导出按钮操作 */
function handleExport() {
 proxy.download("system/user/export", {
   ...queryParams.value,
 },`user_${new Date().getTime()}.xlsx`);
};
/** 用户状态修改  */
function handleStatusChange(row) {
 let text = row.status === "0" ? "启用" : "停用";
 proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
   return changeUserStatus(row.userId, row.status);
 }).then(() => {
   proxy.$modal.msgSuccess(text + "成功");
 }).catch(function () {
   row.status = row.status === "0" ? "1" : "0";
 });
};
/** 更多操作 */
function handleCommand(command, row) {
 switch (command) {
   case "handleResetPwd":
     handleResetPwd(row);
     break;
   case "handleAuthRole":
     handleAuthRole(row);
     break;
   default:
     break;
 }
};
/** 跳转角色分配 */
function handleAuthRole(row) {
 const userId = row.userId;
 router.push("/system/user-auth/role/" + userId);
};
/** 重置密码按钮操作 */
function handleResetPwd(row) {
 proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
   confirmButtonText: "确定",
   cancelButtonText: "取消",
   closeOnClickModal: false,
   inputPattern: /^.{5,20}$/,
   inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
 }).then(({ value }) => {
   resetUserPwd(row.userId, value).then(response => {
     proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
   });
 }).catch(() => {});
};
/** 选择条数  */
function handleSelectionChange(selection) {
 ids.value = selection.map(item => item.id);
};
/** 导入按钮操作 */
function handleImport() {
 upload2.title = "批量导入";
 upload2.open = true;
};
/** 下载模板操作 */
function importTemplate() {
 proxy.download("arts/project/importTemplate", {
 }, `project_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
 upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  if(upload.isCover){
    const params = {
      id: upload.id,
      projectThumbnail: response.url
    }
    upProjectThumbnail(params).then(response => {
      // console.log(response)
      if(response.code == 200){
        proxy.$modal.msgSuccess(response.msg);
        upload.open = false;
        upload.isUploading = false;
        proxy.$refs["uploadRef"].handleRemove(file);
        getList();
      }
    });
  }else{
    projectform.value.artsProjectLabelImageVos[projectform.value.index].stageFileAddress = response.url
    upload.open = false;
    upload.isUploading = false;
    proxy.$refs["uploadRef"].handleRemove(file);
  }
  upload.isCover = false;
//  console.log(response, file, fileList)
};
/**文件上传中处理 */
const handleFileUploadProgress1 = (event, file, fileList) => {
 upload1.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess1 = (response, file, fileList) => {
    tabsform.url = response.url
    tabsform.fileName = response.originalFilename
    // upload1.open = false;
    upload1.isUploading = false;
    // proxy.$refs["uploadRef1"].handleRemove(file);
//  console.log(response, file, fileList)
};
/**文件上传中处理 */
const handleFileUploadProgress2 = (event, file, fileList) => {
 upload1.isUploading = true;
};
/** 批量导入成功处理 */
const handleFileSuccess2 = (response, file, fileList) => {
  console.log(response, file, fileList)
  // if(response.code == 200){
  //   // upload2.open = false;
  //   upload2.isUploading = false;
  //   proxy.$refs["uploadRef2"].handleRemove(file);
  //   // proxy.$modal.msgSuccess(response.msg);
  //   if(response.data){
  //     proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  //   }else{
  //     proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  //   }
  //   getList()
  // }else{
  //   // proxy.$modal.msgWarning(response.msg);
  //   if(response.data){
  //     proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  //   }else{
  //     proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  //   }
  // }
  upload2.isUploading = false;
  proxy.$refs["uploadRef2"].handleRemove(file);
  // proxy.$modal.msgSuccess(response.msg);
  if(response.data){
    proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  }else{
    proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  }
  getList()
};
/**文件上传中处理 */
const handleFileUploadProgress3 = (event, file, fileList) => {
 upload3.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess3 = (response, file, fileList) => {
    form.value.projectPaintingUrl = response.url
    form.value.projectPaintingUrlName = response.originalFilename
    // upload1.open = false;
    upload3.isUploading = false;
    // proxy.$refs["uploadRef1"].handleRemove(file);
//  console.log(response, file, fileList)
};
/** 提交上传文件 */
function submitFileForm() {
 proxy.$refs["uploadRef"].submit();
};
/** 提交上传文件 */
function submitFileForm1() {
 proxy.$refs["uploadRef1"].submit();
};
/** 提交上传文件 */
function submitFileForm2() {
  upload2.open = false;
 proxy.$refs["uploadRef2"].submit();
};
/** 重置操作表单 */
function reset() {
 form.value = {
  projectCode: undefined,
  projectName: undefined,
  projectEnterpriseName: '',
  projectCategoryOneName: '',
  projectCategoryTwoName: '',
  projectApprovalTime: undefined,
  plannedStartTime: undefined,
  plannedEndTime: undefined,
  productionDepartmentId: [],
  productionCycle: undefined,
  projectCycle: undefined,
  projectRemarks: undefined,
  artsProjectMemberVos: [],
  artsProjectFlowPathIdList: [],
  artsProjectFlowPathName: [],
  unitPrice: null,
  fabrication: '1',
  outsourcingAmount: null,
  orderAmount: null,
  projectId: null,
  remarks: null,
  isContractor: '1',
};
pmObj.value.userId = null
pmObj.value.userName = null
pmObj.value.projectRole = null
userNameList.value = []
userNameListLeader.value = []
userNameListLeader1.value = []
fzUserData.value = []
zzUserData.value = []
 proxy.resetForm("projectRef");
};
/** 取消按钮 */
function cancel() {
 open.value = false;
 reset();
};
/** 新增按钮操作 */
function handleAdd() {
 reset();
 open.value = true;
 title.value = "新建项目订单";
 getProjectBatch()
 getflowPathList();
};
/** 修改按钮操作 */
function handleUpdate(row) {
 getProjectBatch()
 getflowPathList();
 reset();
//  console.log(row)
 form.value = {
  ...row,
 }
 if(row.artsProjectFlowPathName == null){
  form.value.artsProjectFlowPathName = []
 }else{
  form.value.artsProjectFlowPathName = row.artsProjectFlowPathName.split(',')
 }
 form.value.artsProjectFlowPathIdList = []
 form.value.commerceDay = row.artsProjectFinance.commerceDay
 form.value.unitPrice = row.artsProjectFinance.unitPrice
 form.value.fabrication = row.artsProjectFinance.fabrication
 form.value.outsourcingAmount = row.artsProjectFinance.outsourcingAmount
 form.value.orderAmount = row.artsProjectFinance.orderAmount
 form.value.remarks = row.artsProjectFinance.remarks
 form.value.isContractor = row.artsProjectFinance.isContractor
 form.value.projectId = row.artsProjectFinance.projectId
 userData.value = cloneDeep(row.artsProjectMemberVos)
 row.artsProjectMemberVos.map(item=>{
  if(item.projectRole == '1'){
    userNameListLeader.value.push(item.userName)
    fzUserData.value.push(item)
  }else if(item.projectRole == '2'){
    userNameListLeader1.value.push(item.userName)
    zzUserData.value.push(item)
  }else{
    pmObj.value = item
  }
 })
 open.value = true;
 title.value = "修改项目订单";
};
/** 提交按钮 */
function submitForm() {
  // console.log(form.value)
  if(fzUserData.value.length == 0){
    proxy.$modal.msgSuccess("请添加负责人");
    return
  }
  if(!pmObj.value.userId){
    proxy.$modal.msgSuccess("请添加PM跟进人");
    return
  }
  if(zzUserData.value.length == 0){
    proxy.$modal.msgSuccess("请添加制作人");
    return
  }
 proxy.$refs["projectRef"].validate(valid => {
   if (valid) {
    proxy.$refs["projectRef1"].validate(valid => {
      if (valid) {
        if(Array.isArray(form.value.productionDepartmentId)){
          form.value.productionDepartmentId = form.value.productionDepartmentId.slice(-1)[0]
        }
        if(Array.isArray(form.value.artsProjectFlowPathIdList) && form.value.artsProjectFlowPathIdList.length > 0){
          form.value.artsProjectFlowPath = form.value.artsProjectFlowPathIdList.join(',')
        }
        if(Array.isArray(form.value.artsProjectFlowPathName)){
          form.value.artsProjectFlowPathName = form.value.artsProjectFlowPathName.join(',')
        }
        const params = {
          ...form.value,
          artsProjectMemberVos: userData.value,
          artsProjectFinance:{
            id: form.value.artsProjectFinance?.id || null,
            commerceDay: form.value.commerceDay,
            unitPrice: form.value.unitPrice,
            fabrication: form.value.fabrication,
            outsourcingAmount: form.value.outsourcingAmount,
            orderAmount: form.value.orderAmount,
            projectId: form.value.projectId,
            remarks: form.value.remarks,
            isContractor: form.value.isContractor,
          },//财务信息
        }
        // console.log(params)
        btnLoading.value = true
        if (form.value.id != undefined) {
          editProject(params).then(response => {
            btnLoading.value = false
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
            getDeptTree();
          }).finally(()=>{
            btnLoading.value = false
            form.value.artsProjectFlowPathName = form.value.artsProjectFlowPathName.split(',')
          });
        } else {
          addProject(params).then(response => {
            btnLoading.value = false
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
            getDeptTree();
          }).finally(()=>{
            btnLoading.value = false
            form.value.artsProjectFlowPathName = form.value.artsProjectFlowPathName.split(',')
          });
        }
      }
    });
   }
 });
};
/** 设置负责人成员提交按钮 */
function submitSetMemberForm1() {
 proxy.$refs["setMemberRef"].validate(valid => {
   if (valid) {
    if(setMemberform.type == 1){
    }else{
      form.value.projectResponsibilityUserId = null
      form.value.responsibleUserName = null
      setMemberform.stage.map((item)=>{
        setMemberform.stageNames.push({stageName:item})
      })
      form.value?.artsProjectMemberVos.push(cloneDeep(setMemberform))
    }
    setMemberOpen.value = false;
  }
 });
};
/** 设置PM提交按钮 */
function submitSetMemberFormPM() {
 proxy.$refs["setMemberRef"].validate(valid => {
   if (valid) {
    if(setMemberform.type == 3){
      // form.value.projectResponsibilityUserId = setMemberform.userId
      // form.value.responsibleUserName = setMemberform.userName
      // form.value?.artsProjectMemberVos.splice(setMemberform.index, 1);
    }
    setMemberOpen.value = false;
  }
 });
};
/** 设置制作人成员提交按钮 */
function submitSetMemberForm2() {
 proxy.$refs["setMemberRef"].validate(valid => {
   if (valid) {
    setMemberform.stageNames = []
    if(setMemberform.type == 1){
      form.value.projectResponsibilityUserId = setMemberform.userId
      form.value.responsibleUserName = setMemberform.userName
      form.value?.artsProjectMemberVos.splice(setMemberform.index, 1);
    }else{
      setMemberform.stage.map((item)=>{
        setMemberform.stageNames.push({
          stageName:item,
        })
      })
      form.value.artsProjectMemberVos[setMemberform.index].stageNames = setMemberform.stageNames
    }
    setMemberOpen.value = false;
   }
 });
};
/** 新增成员提交按钮 */
function submitAddMemberForm() {
 proxy.$refs["addMemberRef"].validate(valid => {
   if (valid) {
    if(addMemberform.type == 2){
      zzUserData.value = zzUserData.value.map(item=>{
        item.stageNames = addMemberform.stage.map((v)=>{
          return {stageName : v}
        })
        return item
      })
      userData.value = userData.value.map(items=>{
        if(items.projectRole == '2'){
          items.stageNames = addMemberform.stage.map((v)=>{
            return {stageName : v}
          })
        }
        return items
      })
      console.log(zzUserData.value,userData.value)
    }
    addMemberOpen.value = false;
    addMemberform.type = '1'
    addMemberform.stage = []
    addMemberform.stageNames = []
    addMemberform.userIdList = []
    // addMemberform.userNameList = []
   }
 });
};
/** 新增成员取消 */
function addMembercCncel() {
  addMemberOpen.value = false;
  addMemberform.type = '1'
  addMemberform.stage = []
  addMemberform.stageNames = []
  addMemberform.userIdList = []
  addMemberform.userNameList = []
  addMemberform.userIdListLeader = []
  addMemberform.userNameListLeader = []
};
/** */
function handleChangeMember(val) {
  if(val == 3){
    multiple.value = false
  }else{
    multiple.value = true
  }
  addMemberform.stage = []
  addMemberform.stageNames = []
  addMemberform.userIdList = []
  addMemberform.userNameList = []
  addMemberform.userIdListLeader = []
  addMemberform.userNameListLeader = []
};
/** 项目详情提交按钮 */
function submitProjectForm() {
  projectOpen.value = false;
  const params = {
    ...projectform.value
  }
  getDetailsAdd(params).then(response => {
    // console.log(response)
    if(response.code == 200){
      projectOpen.value = false;
      proxy.$modal.msgSuccess(response.msg);
      getList();
    }
  });
};
/** 设置封面弹框 */
function handleCover(row) {
  upload.title = '上传封面';
  upload.id = row.id;
  upload.isCover = true;
  upload.open = true;
};
/** 设置状态弹框 */
function handleStatusUpdate(row) {
  statusOpen.value = true;
  statusform.id = row.id;
  statusform.projectState = row.projectState.toString();
};
/** 存为模板 */
function handleTemplate(row) {
  setTemplate(row.id).then(response => {
    if(response.code == 200){
      proxy.$modal.msgSuccess("操作成功");
      // getList();
    }
  });
};
/** 引入模板 */
function handleImportTemplate() {
  // console.log('listTemplate')
  listTemplate().then(response => {
    if(response.code == 200){
      templateTableData.value = response.rows
      // getList();
    }
  });
  templateOpen.value = true;
};
/** 确认引入模板 */
function handleConfirm(row) {
  // console.log(row)
  form.value = {
    ...row,
  }
  if(row.artsProjectFlowPathName == null){
    form.value.artsProjectFlowPathName = []
  }else{
    form.value.artsProjectFlowPathName = row.artsProjectFlowPathName.split(',')
  }
  form.value.artsProjectFlowPathIdList = []
  form.value.commerceDay = row.artsProjectFinance.commerceDay
  form.value.unitPrice = row.artsProjectFinance.unitPrice
  form.value.fabrication = row.artsProjectFinance.fabrication
  form.value.outsourcingAmount = row.artsProjectFinance.outsourcingAmount
  form.value.orderAmount = row.artsProjectFinance.orderAmount
  form.value.remarks = row.artsProjectFinance.remarks
  form.value.isContractor = row.artsProjectFinance.isContractor
  // form.value.projectId = row.artsProjectFinance.projectId

  // form.value.artsProjectMemberVos = []
  form.value.id = null
  form.value.artsProjectFinance.id = null
  form.value.projectId = null
  userNameList.value = row.artsProjectMemberVos.map(item=>item.userName)
  templateOpen.value = false;
};
/** 取消模板弹框 */
function handleCancel() {
  console.log('handleCancel')
  templateOpen.value = false;
};
/** 设置状态提交 */
function submitStatusForm() {
  const params = {
    ...statusform
  }
  upState(params).then(response => {
    // console.log(response)
    if(response.code == 200){
      statusOpen.value = false;
      proxy.$modal.msgSuccess(response.msg);
      getList();
    }
  });
};
/** 添加tabs */
function submitTabsForm() {
  proxy.$refs["tabsRef"].validate(valid => {
   if (valid) {
    projectform.value.artsProjectLabelImageVos.push({
      // name: projectform.value.artsProjectStages.length,
      projectLabelName: tabsform.title,
      stageFileAddress: tabsform.url,
    })
    activeName.value = projectform.value.artsProjectLabelImageVos.length - 1
    tabsOpen.value = false;
  }
 });
};
/** 添加tabs上传文件 */
function handleFileOpen() {
  upload1.open = true;
};
/** 改变开始日期触发 */
function handleChangeStartDate(val) {
  form.value.plannedEndTime = getEndDate(val,form.value.productionCycle)
};
/** 改变结束日期触发 */
function handleChangeDate(val) {
  if(new Date(form.value.plannedStartTime).getTime() > new Date(val).getTime()){
    proxy.$modal.msgWarning('结束日期不能小于开始日期');
    form.value.plannedEndTime = null;
    return
  }else{
    form.value.productionCycle = getDay(form.value.plannedStartTime,val)
  }
};
/** 获取工作天数 */
function getDay(startTime,endTime) {
var s = new Date(startTime),
    e = new Date(endTime);
var _sw = s.getDay(),
    _ew = e.getDay();
// console.log(s + "   " + e);
if (s.getTime() <= e.getTime()) {
    if (s.getTime() == e.getTime() && _sw > 0 && _sw < 6) {
        console.log("同一天");
        return 1;
    } else if (s.getTime() == e.getTime() && (_sw == 0 || _sw == 6)) {
        console.log("同一天周末");
        return 0
    } else {
        var diffDay = (e - s) / (1000 * 60 * 60 * 24) + 1;
        var firWeekday = _sw < 6 && _sw > 0 ? 6 - _sw : 0; //第一周的工作日
        // console.log(firWeekday);
        var lastWeekday = (_ew > 0 ? _ew : 0) - (_ew == 6 ? 1 : 0); //最后一周的工作日
        var diffWeek = (diffDay - firWeekday - lastWeekday) > 0 ? Math.floor((diffDay - firWeekday - lastWeekday) / 7) : 0; //中间的周数
        var days = 0;
        var day1 = new Date('2023-10-07').getTime();
        var day2 = new Date('2023-10-08').getTime();
        for (var i = 0; i < HOLIDAY.length; i++) {                            //获取两个时间之间的工作日天数

          var holidaytime = new Date(HOLIDAY[i]).getTime();

          if (holidaytime >= s.getTime() && holidaytime <= e.getTime()) {    //如果两个时间之间包含节假日期就减去那天，得到需要的工作日天数

            days += 1;

          }

        }
        if (day1 >= s.getTime() && day1 <= e.getTime()) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
          days -= 1;
        }
        if (day2 >= s.getTime() && day2 <= e.getTime()) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
          days -= 1;
        }
        // console.log("days: " + days);
        // console.log("diff: " + diffWeek);
        if (diffWeek < 1) {
            // 周数小于1
            var __ew = _ew > 5 ? 5 : _ew;
            var __sw = _sw == 0 ? 1 : _sw;
            if (__ew >= __sw && diffDay < 7) {
                // 同一周
                return __ew - __sw + 1;
            } else {
                // 跨周
                return firWeekday + lastWeekday - days;
            }
        } else {
            return diffWeek * 5 + firWeekday + lastWeekday - days;
        }
    }
} else {
    return -1; //日期区间错误
}
};
/** 获取结束日期 */
function getEndDate(startTime,days) {
  var s = cloneDeep(startTime)
  var week = Math.floor(days / 5);
  var _sw = new Date(startTime).getDay();
  // 开始日期判断为周末加上相应天数
  var sun = _sw == 0 ? 1 : 0;  //当天周日
  var saturday = _sw == 6 ? 2 : 0;  //当天周六
  // console.log(new Date(new Date(s).getTime()))
  startTime = startTime.split("-");
  //转换为MM-DD-YYYY格式
  var nDate = new Date(startTime[1] + "-" + startTime[2] + "-" + startTime[0]);
  var millSeconds = Math.abs(nDate) + days * 24 * 60 * 60 * 1000 + (week * 2 - 1 + sun + saturday) * 24 * 60 * 60 * 1000;
  // 结束日期判断为周末加上相应天数
  var _ew = new Date(millSeconds).getDay();
  var _sun = _ew == 0 ? 1 : 0  //结束为周日
  var _saturday = _ew == 6 ? 2 : 0  //结束为周六
  millSeconds = millSeconds + (_sun + _saturday) * 24 * 60 * 60 * 1000;
  //期间有节假日加上相应天数
  var _days = 0;
  var day1 = new Date('2023-10-07').getTime();
  var day2 = new Date('2023-10-08').getTime();
  for (var i = 0; i < HOLIDAY.length; i++) {
    var holidaytime = new Date(HOLIDAY[i]).getTime();
    if (holidaytime >= new Date(s).getTime() && holidaytime <= millSeconds) {    //如果两个时间之间包含节假日期就减去那天，得到需要的工作日天数
      _days += 1;
    }
  }
  if (day1 >= new Date(s).getTime() && day1 <= millSeconds) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
    _days -= 1;
  }
  if (day2 >= new Date(s).getTime() && day2 <= millSeconds) {    //如果两个时间之间包含节假日期补班，得到需要的工作日天数
    _days -= 1;
  }
  millSeconds = millSeconds + _days * 24 * 60 * 60 * 1000;

  var rDate = new Date(millSeconds);


      // _ew = rDate.getDay();

  var year = rDate.getFullYear();
  var month = rDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  var date = rDate.getDate();
  if (date < 10) date = "0" + date;
  return year + "-" + month + "-" + date;
};


getDeptTree();
getDeptTreeList();
getDepartmentList();
getdictDataList();
getflowPathList();
getuserList();
// getCategoryDetail(0);
getCategoryByType(1);
// getList();

onMounted(() => {
  // console.log(route.params)
  if(route.query.id){
    getProject(route.query?.id).then(response => {
      activeName.value = 0;
      if(response.data.artsProjectLabelImageVos == null){
        response.data.artsProjectLabelImageVos = []
      }
      projectform.value = response.data;
      projectOpen.value = true;
    });
  }
  if(route.query.detailId){
    setTimeout(()=>{
      projectList.value.map((item)=>{
        if(item.id == route.query.detailId){
          handleUpdate(item)
        }
      })
    },600)
  }
  if(route.query.status){
    queryParams.value.projectState = Number(route.query.status)
  }
  getList()
})
</script>

<style lang="scss" scoped>
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
.iconText{
  height: 32px;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 24px;
  position: absolute;
  top: 0;
  right: 0;
}
.iconText .el-icon{
  cursor: pointer;
}
.iconText .el-icon:nth-child(1){
  margin-right: 5px;
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
.active{
  color: #409eff;
}
.grid-list{
  max-height: calc(100vh - 250px);
  padding: 20px 0;
  box-sizing: border-box;
  /* margin: 20px 0; */
  overflow: auto;
  overflow-y: scroll;
}
.banner-box{
  height: 100%;
  /* max-height: calc(100vh - 195px); */
  /* overflow: auto; */
  /* overflow-y: scroll; */
  width: 100%;
  padding: 0 20px;
  /* justify-content: space-between; */
}
.banner-box-list{
  width: 23%;
  height: 328px;
  border: 1px solid #e5e5e5;
  margin-right: 2%;
  margin-bottom: 20px;
  float: left;
  cursor: pointer;
}
.banner-box-list-name{
  width: 100%;
  // background-color: #409eff;
}
.banner-box-list-name-three{
  width: 100%;
  background-color: #ff5a65;
}
.banner-box-list-name-four{
  width: 100%;
  background-color: #a0bbff;
}
.banner-box-list-name-text{
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.banner-box-list-name-text1{
  height: 25px;
  line-height: 25px;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.banner-box-list-name-text2{
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  color: #444;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.banner-box-list-name-text-three{
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #fff;
  padding: 4px 20px 6px 20px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.banner-box-list:nth-child(4n){
  margin-right: 0;
}
.banner-box-list-top{
  width: 100%;
  height: 200px;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-box-list-top img{
  display: block;
  width: 100%;
  height: 100%;
}
.banner-box-list-center{
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 99;
}
.banner-box-list-bottom{
  width: 100%;
  height: 70px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #333;
}
.banner-box-list-bottom-left{
  flex: 1;
}
.banner-box-list-bottom-left div{

  height: 35px;
  line-height: 35px;
}
.banner-box-list-bottom-right{
  width: 40%;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
}
.circle-text-one{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #42ec18;
}
.text-color-one{
  color: #42ec18;
}
.circle-text-tow{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #ff9725;
}
.text-color-tow{
  color: #ff9725;
}
.circle-text-three{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #f71702;
}
.text-color-three{
  color: #f71702;
}
.circle-text-four{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #0d06db;
}
.text-color-four{
  color: #0d06db;
}
.dialog-member{
  width: 100%;
  height: 220px;
}
.dialog-member-title{
  width: 100%;
  height: 40px;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid #e5e5e5; */
}
.dialog-member-box{
  width: 100%;
  height: 235px;
  border: 1px solid #e5e5e5;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}
.dialog-member-box-left{
  position: relative;
  width: 130px;
  height: 100%;
  border-right: 1px solid #999;
}
.dialog-member-box-right{
  width: calc(100% - 130px);
  height: 100%;
  display: flex;
  flex-direction: column;
  // overflow-y: auto;
}
.member-box-list{
  flex: 1;
  overflow-y: auto;
  margin-left: 6px;
}
.member-list{
  width: 160px;
  height: 100%;
  float: left;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.el-divider--vertical{
  margin: 0 4px !important;
}
.el-result{
  padding: 0 !important;
  position: relative;
  justify-content: initial;
}
.el-result :deep(.el-result__extra){
  margin: 0 !important;
  position: absolute;
  top: 0;
  right: 10px;
  display: none;
}
.el-result :deep(.el-result__extra1){
  margin: 0 !important;
  position: absolute;
  top: -1px;
  right: 0px;
  display: none;
}

.el-result:hover :deep(.el-result__extra){
  display: block;
}
.el-result:hover :deep(.el-result__extra1){
  display: block;
}
.dialogTree{
  width: 100%;
  max-height: 250px;
  overflow-y: scroll;
}

.project-box{
  width: 100%;
  height: 500px;
  display: flex;
  border: 1px solid #e5e5e5;
}
.project-box-left{
  position: relative;
  width: calc(100% - 300px);
  flex: 1;
  border-right: 1px solid #e5e5e5;
}
.addTab{
  position: absolute;
  top: 4px;
  right: 20px;
  z-index: 99;
}
.project-box-left-title{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 0 20px;
  // box-sizing: border-box;
}
.el-tabs{
  width: 100%;
  height: 100%;
}
.el-tabs :deep(.el-tabs__content){
  width: 100%;
  height: 425px;
  padding: 0 20px;
  box-sizing: border-box;
}
.el-collapse :deep(.el-collapse-item.is-disabled .el-collapse-item__header){
  color: #606266 !important;
}
.el-tab-pane-button{
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 100;
}
.project-box-right{
  width: 300px;
  height: 100%;
  overflow-y: auto;
}

.text {
  font-size: 14px;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}
/* .card-header {
  margin-bottom: 18px;
} */

.box-card {
  /* width: 480px; */
  border: none;
  margin-bottom: 1px;
}
.box-card :deep(.el-card__header){
  font-weight: 600;
  color: #606266;
  padding-left: 20px !important;
}
.el-card.is-always-shadow{
  box-shadow: none;
}

.el-form :deep(.el-form-item__label) {
  font-weight: 400 !important;
}
.el-tabs .el-tab-pane{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-tabs :deep(.el-tabs__new-tab){
  margin: 10px 60px !important;
}
.tabs-text{
  width: 100%;
  display: flex;
}
.el-result :deep(.el-result__title){
  margin-top: 13px;
}
.el-result :deep(.el-result__title p){
  font-size: 16px;
}
.title-circle{
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  background-color: #18c6ee;
  cursor: pointer;
}
.title-circle-leader{
  background-color: #67C23A;
}
.el-table :deep(.el-table__body){
  color: #333;
}
.el-table :deep(.el-table__cell){
  border: none;
}
.el-table :deep(thead>tr>th){
  border-right: 1px solid #e5e5e5 !important;
}
.el-table :deep(.warning-row),.el-table_1_column_12 {
  --el-table-tr-bg-color: #ff9725;
}
.el-table :deep(.danger-row),.el-table_1_column_12 {
  --el-table-tr-bg-color: #f56c6c;
}
.el-table :deep(.red-row),.el-table_1_column_12 {
  --el-table-tr-bg-color: #ff5a65; //ec0023
}
.el-table :deep(.bule-row),.el-table_1_column_12 {
  --el-table-tr-bg-color: #a0bbff;
  // color: #a0bbff;
}
.el-table :deep(.el-table__body) tr:hover > td {
    background-color: #a0cfff !important;
}
.fileUpload :deep(.el-upload .el-upload-dragger){
  padding: 0 !important;
}
.fileUpload :deep(.el-form-item__content){
  line-height: 0 !important;
  .el-upload-list{
     .el-upload-list__item-file-name {
       height: 16px;
       line-height: 16px;
     }
   } 
}
.fileUpload :deep(.el-upload .el-upload-dragger .el-icon--upload){
  margin-bottom: 0 !important;
}
.banner-box-list-bg{
  width: 100%;
  height: 100%;
  // padding: 10px 20px 20px 20px;
  // box-sizing: border-box;
}
.active1{
  background-color:  #c45656;
}
.active2{
  background-color: #ec0023;
}
.el-collapse{
  position: relative;
}
.el-collapse-box{
  position: absolute;
  top: 7px;
  right: 36px;
}
.el-tabs :deep(.el-tabs__nav-prev) {
    background-color: #0DA9F7;
    color: #fff;
}
.el-tabs :deep(.el-tabs__nav-next) {
    background-color: #0DA9F7;
    color: #fff;
}

.el-tree{
  height: 86vh;
  overflow-y: auto;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 108px;
  display: block;
}
.avatar-uploader .el-upload {
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
  height: 108px;
  text-align: center;
}
</style>
