<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-11-28 18:33:12
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
        <!--部门数据-->
        <el-col :span="5" :xs="24" style="position: relative;">
          <div class="head-bottom">
            <el-button icon="Plus" @click="handleAddOrder">新建订单</el-button>
          </div>
          <div class="head-container">
            <el-input
                v-model="orderName"
                placeholder="请输入名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
                :data="listTypeInfo.orderList"
                :props="{ label: 'orderName', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="deptTreeRef"
                node-key="orderId"
                highlight-current
                default-expand-all
                @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  
                  <span style="display: flex;align-items: center;line-height: 24px;"><el-icon style="margin-right: 5px;"><Tickets /></el-icon>{{ node.label }}</span>
                  <span style="display: flex;">
                    <span class="edit-append" style="margin-right: 6px;">
                      <a @click.stop="handleTreeUpdate(data)"> <el-icon color="#409eff"><Edit /></el-icon> </a>
                    </span>
                    <span class="edit-append">
                      <a @click.stop="handleTreeDelete(data)"> <el-icon color="#409eff"><Delete /></el-icon> </a>
                    </span>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
          
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24" style="border-left: 1px solid #e5e5e5;">
          <div class="title">
            <div class="title-text">
              <!-- <span class="title-text-one">订单名称： <span style="border-bottom: 1px solid #ed7d31;color: #409eff;padding: 0 5px;box-sizing: border-box;">{{ totalObj.orderName }}</span> </span>
              <span class="title-text-one">计划总人天：<span style="border-bottom: 1px solid #ed7d31;color: #409eff;padding: 0 5px;box-sizing: border-box;">{{ totalObj.planDay }}</span></span>
              <span class="title-text-one">增补人天：<span style="border-bottom: 1px solid #ed7d31;color: #409eff;padding: 0 5px;box-sizing: border-box;">{{ totalObj.supplementDay }}</span></span>
              <span class="title-text-one">最终总人天：<span style="border-bottom: 1px solid #ed7d31;color: #409eff;padding: 0 5px;box-sizing: border-box;">{{ totalObj.ultimatelyDay }}</span></span> -->
            </div>
            <div>
              <!-- <el-button plain icon="Upload" @click="handleImport">批量导入</el-button> -->
              <el-button plain icon="Plus" @click="handleAdd">新增任务</el-button>
              <el-button plain icon="Delete" @click="handleDelAll">批量删除</el-button>
              <el-button plain icon="Upload" @click="handleImport">导入</el-button>
            </div>
          </div>

          <el-table v-loading="loading" style="min-height: 400px;" border :data="tableData" @expand-change="expandChange" @selection-change="handleSelectionChangeTask" @sort-change="handleSortChange" row-key="id">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="expand">
              <template #default="props">
                <div style="margin-left: 60px;">
                  <el-table :data="props.row.developOrderMembers" :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="参与成员" align="center" prop="userName" />
                    <el-table-column label="参与阶段" align="center" prop="stageName">
                      <template #default="scope">
                        <el-select v-model="scope.row.stageName" filterable placeholder="请选择" @change="handleChange(scope.row)">
                          <el-option
                            v-for="item in listTypeInfo.checkboxList"
                            :key="item.dictCode"
                            :label="item.dictLabel"
                            :value="item.dictLabel"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="参与比重" align="center" prop="proportion">
                      <template #default="scope">
                        <el-input style="width: 80px;" v-model="scope.row.proportion" placeholder="请输入" @change="handleChange(scope.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column label="工作人天" align="center" min-width="100" prop="workDay" :show-overflow-tooltip="true">
                      <template #default="scope">
                        <el-input style="width: 80px;" v-model="scope.row.workDay" placeholder="请输入" @change="handleChange(scope.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column label="绩效人天" align="center" min-width="100" prop="estimateDay" :show-overflow-tooltip="true">
                      <template #default="scope">
                        <el-input style="width: 80px;" v-model="scope.row.estimateDay" placeholder="请输入" @change="handleChange(scope.row)"/>
                      </template>
                    </el-table-column>
                    
                    <el-table-column label="开始时间" align="center" min-width="150" prop="plannedStartTime" :show-overflow-tooltip="true">
                      <template #default="scope">
                        <el-date-picker style="width: 150px;" v-model="scope.row.plannedStartTime" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleChange(scope.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column label="结束时间" align="center" min-width="150" prop="plannedEndTime" :show-overflow-tooltip="true">
                      <template #default="scope">
                        <el-date-picker style="width: 150px;" v-model="scope.row.plannedEndTime" type="date" placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleChange(scope.row)" />
                      </template>
                    </el-table-column>
                    <el-table-column label="完成截图" align="center" min-width="100" prop="thumbnail">
                      <template #default="scope">
                        <!-- <el-image style="width: 100px; height: 50px" :src="scope.row.thumbnail" fit="fill" /> -->
                        <!-- <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;background-color: #e5e5e5;"> -->
                          <el-upload
                            ref="uploadRef"
                            v-if="!scope.row.thumbnail"
                            class="uploadRef"
                            style="width: 100%;height: 50px;"
                            :limit="1"
                            accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
                            :headers="upload.headers"
                            :action="upload.url"
                            :disabled="upload.isUploading"
                            :on-progress="handleFileUploadProgress"
                            :on-success="handleFileSuccess1"
                            :auto-upload="true"
                            drag
                          >
                          <div @click="handleChange1(scope)">请上传截图</div>
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
                          <el-image v-if="scope.row.thumbnail" style="width: 100%;height: 50px;" :src="scope.row.thumbnail" :preview-src-list="[scope.row.thumbnail]" preview-teleported fit="fill"/>
                          <!-- <el-button class="deleteUserImg" v-if="scope.row.thumbnail" type="primary" @click="handleDeleteUserImg">删除</el-button> -->
                          <el-icon class="deleteUserImg" v-if="scope.row.thumbnail" color="#409eff" @click="handleDeleteUserImg(scope)"><Delete /></el-icon>
                        <!-- </div> -->
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button style="margin-top: 10px;" @click="handleAddMember(props.row.id)">添加成员</el-button>
                  <el-button style="margin-top: 10px;" @click="handleDelMember()">批量删除成员</el-button>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="序号" width="55" align="center" type="index" /> -->
            <el-table-column label="截图" align="center" min-width="100" prop="assignmentThumbnail">
                <template #default="scope">
                  <el-image style="width: 100px; height: 50px" :src="scope.row.assignmentThumbnail" :preview-src-list="[scope.row.assignmentThumbnail]" preview-teleported/>
                </template>
            </el-table-column>
            <!-- <el-table-column label="状态" align="center" key="projectState" prop="projectState" :show-overflow-tooltip="true">
              <template #default="scope">
                <span v-if="scope.row.projectState == '1'">正常</span>
                <span v-else-if="scope.row.projectState == '2'">紧张</span>
                <span v-else>延期</span>
              </template>
            </el-table-column> -->
            <el-table-column label="内容" align="center" min-width="160" key="assignmentName" prop="assignmentName" sortable :show-overflow-tooltip="true" />
            <el-table-column label="流程" align="center" min-width="120" key="assignmentFlowPathName" prop="assignmentFlowPathName" :show-overflow-tooltip="true" />
            <el-table-column label="工作人天" align="center" min-width="100" key="finalDay" prop="finalDay" :show-overflow-tooltip="true" />
            <el-table-column label="绩效人天" align="center" min-width="100" key="estimateDay" prop="estimateDay" :show-overflow-tooltip="true" />
            <el-table-column label="制作周期" align="center" min-width="100" key="productionCycle" prop="productionCycle" :show-overflow-tooltip="true" />
            <el-table-column label="超出人天" align="center" min-width="100" key="exceedingExpectations" prop="exceedingExpectations" :show-overflow-tooltip="true" />
            <el-table-column label="计划开始日期" align="center" min-width="160" key="plannedStartTime" prop="plannedStartTime" width="130" sortable :show-overflow-tooltip="true" />
            <el-table-column label="计划结束日期" align="center" min-width="160" key="plannedEndTime" prop="plannedEndTime" width="130" sortable :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                <template #default="scope">
                  <el-tooltip content="修改" placement="top">
                      <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                  </el-tooltip>
                  <!-- <el-tooltip content="删除" placement="top">
                      <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
                  </el-tooltip> -->
                </template>
            </el-table-column>
          </el-table>

          <div style="display: flex;justify-content: space-between;align-items: center;">
            <!-- <div v-show="total > 0" style="border-left: 5px solid #409eff;color: #666;font-weight: 600;padding-left: 5px;">订单统计  <span class="orderText">订单名称：{{ totalObj.orderName }}</span><span class="orderText">计划人天：{{ totalObj.planDay }}</span><span class="orderText">最终人天：{{ totalObj.ultimatelyDay }}</span></div> -->
            <div v-show="total > 0">
              <span style="font-weight: 600;margin-right: 20px;"> 订单统计</span>  
              订单名称：<span style="margin-right: 40px;color: #0d06db;">{{ totalObj.orderName }}</span>
              计划人天：<span style="margin-right: 40px;color: #0d06db;">{{ totalObj.planDay }}</span>
              最终人天：<span style="margin-right: 40px;color: #0d06db;">{{ totalObj.ultimatelyDay }}</span>
            </div>
            <pagination
              v-show="total > 0"
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @pagination="getList(oId)"
            />
          </div>

          <!-- <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList(oId)"
          /> -->
      </el-col>
    </el-row>

    <!-- 添加或修改项目弹框 -->
    <el-dialog :title="title" v-model="open" width="70%" :close-on-click-modal="false" append-to-body>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="项目信息" name="1">
          <el-form :model="formInfo.data" :rules="formInfo.rules" ref="projectRef" label-width="110px">
            <el-row>
                <el-col :span="8">
                  <el-form-item label="项目编码" prop="projectCode">
                      <el-input v-model="formInfo.data.projectCode" placeholder="请输入项目编码" maxlength="30" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目企业" prop="projectEnterpriseName">
                    <el-autocomplete
                      v-model="formInfo.data.projectEnterpriseName"
                      :fetch-suggestions="querySearch"
                      clearable
                      class="inline-input w-50"
                      placeholder="项目企业"
                      @select="handleSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目代号" prop="projectCategoryOneName">
                    <el-autocomplete
                      v-model="formInfo.data.projectCategoryOneName"
                      :fetch-suggestions="querySearch1"
                      clearable
                      class="inline-input w-50"
                      placeholder="项目代号"
                    />
                  </el-form-item>
                </el-col>
                
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="formInfo.data.projectName" placeholder="请输入项目名称" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注释" prop="projectExplanatory">
                    <el-input v-model="formInfo.data.projectExplanatory" placeholder="请输入注释" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="制作周期(天)" prop="productionCycle">
                    <el-input v-model="formInfo.data.productionCycle" placeholder="请输入制作周期（天）" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目周期(天)" prop="projectCycle">
                  <el-input v-model="formInfo.data.projectCycle" placeholder="请输入项目周期（天）" />
                </el-form-item>
              </el-col>
          </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="立项日期" prop="projectApprovalTime">
                    <el-date-picker
                      v-model="formInfo.data.projectApprovalTime"
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
                      v-model="formInfo.data.plannedStartTime"
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
                      v-model="formInfo.data.plannedEndTime"
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
                    <el-input v-model="formInfo.data.projectRemarks" placeholder="请输入项目备注"  type="textarea" />
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="财务信息" name="2">
          <el-form :model="formInfo.data" :rules="formInfo.rules" ref="projectRef1" label-width="110px">
            <el-row>
                <el-col :span="8">
                  <el-form-item label="商务(天)" prop="commerceDay">
                      <el-input v-model="formInfo.data.commerceDay" placeholder="请输入商务(天)" maxlength="30" @change="handleChangePrice" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单价(人天)" prop="unitPrice">
                      <el-input v-model="formInfo.data.unitPrice" placeholder="请输入单价" maxlength="30" @change="handleChangePrice" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="订单金额(元)" prop="orderAmount">
                      <el-input v-model="formInfo.data.orderAmount" placeholder="请输入订单金额" maxlength="30" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                  <el-form-item label="制作" prop="fabrication">
                    <el-radio-group v-model="formInfo.data.fabrication" class="ml-4">
                      <el-radio label="1">公司制作</el-radio>
                      <el-radio label="2">外包制作</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="formInfo.data.fabrication == 2">
                  <el-form-item label="外包金额(元)" prop="outsourcingAmount">
                    <el-input v-model="formInfo.data.outsourcingAmount" placeholder="请输入外包金额"  type="text" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="内部全职" prop="isContractor">
                    <el-radio-group v-model="formInfo.data.isContractor" class="ml-4">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="备注" prop="remarks">
                    <el-input v-model="formInfo.data.remarks" placeholder="请输入备注"  type="textarea" />
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="项目成员" name="3">
          <el-form :model="formInfo.data" :rules="formInfo.rules" ref="projectRef2" label-width="110px">
            <el-row>
                <el-col :span="12">
                  <el-form-item label="选择负责人" prop="chargeUserId">
                      <el-select v-model="formInfo.data.chargeUserId" filterable placeholder="请选择">
                        <!-- multiple -->
                        <el-option
                          v-for="item in listTypeInfo.userList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId"
                        />
                      </el-select>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="confirmOrder" :loading="loading">确 定</el-button>
              <el-button @click="closeOrder">取 消</el-button>
           </div>
        </template>
     </el-dialog>
    
     <!-- 任务 -->
     <el-dialog :title="taskTitle" v-model="taskOpen" width="70%" :close-on-click-modal="false">
      <el-form :model="formInfoTask.data" :rules="formInfoTask.rules" ref="taskRef" label-width="110px">
            <el-row>
              <el-col :span="8">
                  <el-form-item label="制作部门" prop="productionDepartmentId">
                    <!-- <el-select
                      v-model="formInfoTask.data.productionDepartmentId"
                      filterable
                      placeholder="制作部门"
                    >
                      <el-option
                        v-for="item in listTypeInfo.deptList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId"
                      />
                    </el-select> -->
                    <el-cascader
                      v-model="formInfoTask.data.productionDepartmentId"
                      :options="listTypeInfo.deptList"
                      :props="props"
                      :show-all-levels="false"
                      @change="handleChangeDept"
                      />
                  </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="任务名称" prop="assignmentName">
                    <el-input v-model="formInfoTask.data.assignmentName" placeholder="请输入任务名称" maxlength="50" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="注释" prop="projectExplanatory">
                    <el-input v-model="formInfoTask.data.projectExplanatory" placeholder="请输入注释" />
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="8">
                  <el-form-item label="项目流程" prop="artsProjectFlowPathName">
                    <el-select
                      v-model="formInfoTask.data.artsProjectFlowPathName"
                      multiple
                      filterable
                      allow-create
                      :reserve-keyword="false"
                      placeholder="项目流程"
                      @blur="handleFlowBlur"
                      @change="handleFlowChange"
                    >
                      <el-option
                        v-for="item in listTypeInfo.flowList"
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
                    <el-input v-model="formInfoTask.data.productionCycle" placeholder="请输入制作周期（天）" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="超出人天" prop="exceedingExpectations">
                  <el-input v-model="formInfoTask.data.exceedingExpectations" placeholder="请输入超出人天" />
                  <!-- <el-select v-model="formInfoTask.data.exceedingExpectations" filterable placeholder="请选择">
                      <el-option
                        v-for="item in listTypeInfo.enableList"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                      />
                    </el-select> -->
                </el-form-item>
              </el-col>
          </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="计划开始日期" prop="plannedStartTime">
                    <el-date-picker
                      v-model="formInfoTask.data.plannedStartTime"
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
                      v-model="formInfoTask.data.plannedEndTime"
                      type="date"
                      placeholder="请选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="handleChangeDate1"
                    />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="项目备注" prop="remarks">
                    <el-input v-model="formInfoTask.data.remarks" placeholder="请输入项目备注"  type="textarea" />
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                  <el-form-item label="任务截图" prop="assignmentThumbnail" class="fileUpload">
                    <div style="width: 100%;height: 200px;display: flex;justify-content: center;align-items: center;background-color: #e5e5e5;">
                      <el-upload
                        ref="uploadRef"
                        style="width: 100%;height: 100%;"
                        :limit="1"
                        accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
                        :headers="upload.headers"
                        :action="upload.url"
                        :disabled="upload.isUploading"
                        :on-progress="handleFileUploadProgress"
                        :on-success="handleFileSuccess"
                        :auto-upload="true"
                        drag
                      >
                      <el-image class="taskImg" v-if="formInfoTask.data.assignmentThumbnail" style="width: 100%;height: 200px;" :src="formInfoTask.data.assignmentThumbnail" fit="fill" />
                      <div v-else>请上传任务截图</div>
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
                      <el-button class="deleteImg" v-if="formInfoTask.data.assignmentThumbnail" type="primary" @click="handleDeleteImg">删 除</el-button>
                    </div>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="confirmTask" :loading="loading">确 定</el-button>
              <el-button @click="closeTask">取 消</el-button>
          </div>
        </template>
      </el-dialog>

    <!-- 新增成员对话框 -->
    <el-dialog title="添加成员" v-model="addMemberOpen" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form :model="formInfoMember.data" ref="addMemberRef" label-width="80px">
        <el-form-item label="负责阶段" prop="stageList" :rules="
        {
          required: true,
          message: '请选择负责阶段',
          trigger: 'blur',
        }
       ">
          <el-checkbox-group v-model="formInfoMember.data.stageList">
            <el-checkbox :label="item.dictLabel" name="type" v-for="item in listTypeInfo.checkboxList" :key="item.dictCode" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择成员" prop="userId" :rules="
          {
            required: true,
            message: '请选择成员',
            trigger: 'blur',
          }
         ">
          <el-select v-model="formInfoMember.data.userId" filterable placeholder="请选择">
            <el-option
              v-for="item in listTypeInfo.userList"
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
              <el-button type="primary" @click="submitAddMemberForm" :loading="loading">确 定</el-button>
              <el-button @click="addMembercCncel">取 消</el-button>
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
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload1.title" v-model="upload1.open" width="400px" append-to-body>
      <!-- <el-form :model="form" :rules="rules" ref="userRef" label-width="50px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="日期" prop="date">
                    <el-date-picker
                      v-model="form.date"
                      type="month"
                      value-format="YYYY-MM"
                      placeholder="请选择"
                    />
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form> -->
        <el-upload
          ref="uploadRef1"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload1.headers"
          :action="upload1.url + oId"
          :disabled="upload1.isUploading"
          :on-progress="handleFileUploadProgress1"
          :on-success="handleFileSuccess1"
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
              <el-button type="primary" @click="submitFileForm1">确 定</el-button>
              <el-button @click="upload1.open = false">取 消</el-button>
          </div>
        </template>
    </el-dialog>
  </div>
</template>

<script name="Contract">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";
import { Edit,Tickets } from "@element-plus/icons-vue";

export default defineComponent({
  components: { Edit },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }

    //设置表格状态背景颜色
    const tableRowClassName = ({row,rowIndex}) => {
      return 'ccc-row'
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
      props,
      tableRowClassName,
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
// .el-table{
//   min-height: 400px;
// }
.app-container {
  padding: 20px;
  height: calc(100vh - 114px);
}

.app-container>.el-row {
  height: 100%;
}

.app-container>.el-col {
  height: 100% !important;
  overflow: hidden;
}

.el-col-19 {
  height: 100%;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
}

.el-col-19 .el-table {
  flex: 1;
}
.el-table :deep(.el-table__cell){
  border: none;
}
.el-table :deep(thead>tr>th){
  border-right: 1px solid #e5e5e5 !important;
}
.title{
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-text{
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 5px solid #ed7d31;
    padding-left: 5px;
    .title-text-one{
      font-size: 18px;
      color: #ed7d31;
    }
  }
}

.fileUpload :deep(.el-upload){
  width: 100%;
  height: 100%;
  padding: 0 !important;
}
.fileUpload :deep(.el-upload .el-upload-dragger){
  width: 100%;
  height: 100%;
  padding: 0 !important;
  background-color: #e5e5e5;
  border: none;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fileUpload :deep(.el-form-item__content){
  line-height: 0 !important;
  // .el-upload-list{
  //   .el-upload-list__item-file-name {
  //     height: 14px;
  //     line-height: 14px;
  //   }
  // } 
}
.fileUpload :deep(.el-upload .el-upload-dragger .el-icon--upload){
  margin-bottom: 0 !important;
}

.fileUploads .cell .uploadRef{
  :deep(.el-upload){
    width: 100%;
    height: 100%;
    padding: 0 !important;
  }
}
.fileUploads .uploadRef :deep(.el-upload .el-upload-dragger){
  width: 100%;
  height: 100%;
  padding: 0 !important;
  background-color: #e5e5e5;
  border: none;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
}
.custom-tree-node .edit-append{
  display: none;
}
.custom-tree-node:hover .edit-append{
  display: block;
}
.head-bottom{
  width: 100%;
  // position: absolute;
  // left: 0;
  // bottom: 0;
  display: flex;
  // justify-content: center;
  margin-bottom: 10px;
  // margin-left: 24px;
}
.deleteImg{
  position: absolute;
  top: 0;
  right: 0;
  display: none;
}
.el-form-item__content:hover .deleteImg{
  display: block;
}
.deleteUserImg{
  position: absolute;
  top: 10px;
  right: 16px;
  font-size: 20px;
  display: none;
  cursor: pointer;
}
.fileUploads:hover .deleteUserImg{
  display: block;
}
.el-table :deep(.ccc-row){
  background-color: #cccccc !important;
}
.el-table :deep(.el-table__expand-icon>.el-icon){
  font-size: 20px !important;
}
.el-tree{
  height: 76vh;
  overflow-y: auto;
}
.el-tree :deep(.el-tree-node){
  margin-bottom: 5px;
}
</style>

