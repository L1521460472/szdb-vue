<template>
    <div class="app-container">
       <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="客户名称" label-width="80px" style="width: 280px" prop="projectEnterpriseName">
            <el-input
               v-model="queryParams.projectEnterpriseName"
               placeholder="请输入客户名称"
               clearable
            />
          </el-form-item>
          <el-form-item label="需求名称" label-width="80px" prop="id">
            <el-select v-model="queryParams.id" placeholder="需求名称" filterable clearable style="width: 200px">
                <el-option
                   v-for="item in artsProjectList"
                   :key="item.projectId"
                   :label="item.projectName"
                   :value="item.projectId"
                />
             </el-select>
          </el-form-item>
          <el-form-item label="项目名称" label-width="80px" style="width: 280px" prop="projectCategoryOneName">
            <el-input
               v-model="queryParams.projectCategoryOneName"
               placeholder="请输入项目名称"
               clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="部门" label-width="80px" style="width: 280px" prop="deptId">
            <el-cascader
                v-model="queryParams.deptId"
                :options="departmentList"
                :props="props"
                filterable
                :show-all-levels="false"
                @change="handleChangeDept"
                />
          </el-form-item>
          <el-form-item label="是否回款" label-width="80px" prop="isCollection">
            <el-select v-model="queryParams.isCollection" placeholder="是否回款" filterable clearable style="width: 200px">
                <el-option
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                />
             </el-select>
          </el-form-item>
          <el-form-item label="项目代码" label-width="80px" style="width: 280px" prop="projectCode">
            <el-input
               v-model="queryParams.projectCode"
               placeholder="请输入项目代码"
               clearable
            />
          </el-form-item>
          <el-form-item label="项目状态" label-width="80px" prop="projectState">
                 <el-select
                    v-model="queryParams.projectState"
                    placeholder="项目状态"
                    clearable
                    style="width: 200px"
                 >
                    <el-option
                       v-for="dict in options1"
                       :key="dict.value"
                       :label="dict.label"
                       :value="dict.value"
                    />
                 </el-select>
              </el-form-item>
          <el-form-item label="制作类型" label-width="80px" prop="type">
              <el-select
                v-model="queryParams.type"
                placeholder="制作类型"
                clearable
                style="width: 200px"
              >
                <el-option
                    v-for="dict in options2"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
          </el-form-item>
          <el-form-item label="订单类型" label-width="80px" prop="fabrication">
              <el-select
                v-model="queryParams.fabrication"
                placeholder="订单类型"
                clearable
                style="width: 200px"
              >
                <el-option
                    v-for="dict in options3"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
          </el-form-item>
          <el-form-item label="日期" label-width="80px" prop="month">
            <!-- <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="shortcuts"
            /> -->
            <el-date-picker
              v-model="dateRange"
              type="monthrange"
              range-separator="~"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleChangeTime"
            />
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
             <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
       </el-form>
 
       <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" align="center" type="index" />
          <el-table-column label="客户名称" align="center" min-width="110" prop="projectEnterpriseName" />
          <el-table-column label="项目代码" align="center" min-width="110" prop="projectCode" />
          <el-table-column label="项目状态" align="center" prop="projectState" min-width="90">
             <template #default="scope">
                <!-- <span style="display: block;width: 100%;height: 100%;text-align: center;background-color: red;color: #fff;" v-if="scope.row.projectState == '1'">进度正常</span>
                <span style="display: block;width: 100%;height: 100%;text-align: center;background-color: red;color: #fff;" v-else-if="scope.row.projectState == '2'">存在风险</span>
                <span style="display: block;width: 100%;height: 100%;text-align: center;background-color: red;color: #fff;" v-else-if="scope.row.projectState == '3'">进度失控</span>
                <span v-else-if="scope.row.projectState == '4'">已完成</span> -->
                <span style="color: #42ec18;" v-if="scope.row.projectState == '1'">进度正常</span>
                <span style="color: #ff9725;" v-else-if="scope.row.projectState == '2'">存在风险</span>
                <span style="color: #f71702;" v-else-if="scope.row.projectState == '3'">进度失控</span>
                <span style="color: #0d06db;" v-else>已完成</span>
                <!-- <span style="display: block;width: 100%;height: 100%;text-align: center;background-color: red;color: #fff;" v-else>未完成</span> -->
             </template>
          </el-table-column>
          <el-table-column label="需求名称" align="center" min-width="110" prop="projectName" />
          <el-table-column label="制作类型" align="center" min-width="110" prop="type">
            <template #default="scope">
              <span v-if="scope.row.type == 1">美术</span>
              <span v-if="scope.row.type == 2">开发</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="项目名称" align="center" min-width="110" prop="projectCategoryOneName" />
          <!-- <el-table-column label="图片" align="center" prop="projectThumbnail" /> -->
          <el-table-column label="商务人天" align="center" prop="commerceDay">
            <template #default="scope">
                <span>{{ scope.row.artsProjectFinance ? scope.row.artsProjectFinance.commerceDay : '' }}</span>
             </template>
          </el-table-column>
          <el-table-column label="单价" align="center" prop="unitPrice">
             <template #default="scope">
                <span>{{ scope.row.artsProjectFinance ? scope.row.artsProjectFinance.unitPrice : '' }}</span>
             </template>
          </el-table-column>
          <el-table-column label="订单金额" align="center" min-width="110" prop="orderAmount" show-overflow-tooltip>
             <template #default="scope">
                <span>{{ scope.row.artsProjectFinance ? scope.row.artsProjectFinance.orderAmount : '' }}</span>
             </template>
          </el-table-column>
          <el-table-column label="订单类型" align="center" prop="fabrication">
             <template #default="scope">
                <span v-if="scope.row.artsProjectFinance && scope.row.artsProjectFinance.fabrication == '1'">内部</span>
                <span v-else>外包</span>
             </template>
          </el-table-column>
          <el-table-column label="外包金额" align="center" prop="outsourcingAmount">
             <template #default="scope">
                <span>{{ scope.row.artsProjectFinance ? scope.row.artsProjectFinance.outsourcingAmount : '' }}</span>
             </template>
          </el-table-column>
          <el-table-column label="是否回款" align="center" prop="collection">
             <template #default="scope">
                <span v-if="scope.row.collection == '1'">是</span>
                <span style="display: block;width: 100%;height: 100%;text-align: center;background-color: red;color: #fff;" v-else>否</span>
             </template>
          </el-table-column>
          <el-table-column label="回款金额" align="center" prop="collectionAmount">
             <!-- <template #default="scope">
                <span v-if="scope.row.artsProjectFinance.isCollection == '1'">是</span>
                <span v-else>否</span>
             </template> -->
          </el-table-column>
          <el-table-column label="利润解析" align="center" prop="profit">
             <template #default="scope">
              <span @click="handleProjectOpen(scope.row)" style="color: #409eff;cursor: pointer;">{{ scope.row.profit }}</span>
             </template>
          </el-table-column>
          <!-- <el-table-column label="是否包人" align="center" prop="postSort" /> -->
          <el-table-column label="内部全职" align="center" prop="isContractor">
             <template #default="scope">
                <span v-if="scope.row.artsProjectFinance && scope.row.artsProjectFinance.isContractor == '1'">是</span>
                <span v-else>否</span>
             </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width" fixed="right">
             <template #default="scope">
                <el-tooltip content="合同" placement="top">
                  <el-button link type="primary" icon="Tickets" @click="handleContract(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="回款" placement="top">
                  <el-button link type="primary" icon="Connection" @click="handleCollection(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="开票" placement="top">
                  <el-button link type="primary" icon="Money" @click="handleInvoicing(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="详情" placement="top">
                  <el-button link type="primary" icon="View" @click="handleUpdate(scope.row)"></el-button>
                </el-tooltip>
             </template>
          </el-table-column>
       </el-table>

       <div style="display: flex;justify-content: space-between;align-items: center;">
        <div style="border-left: 5px solid #409eff;color: #666;font-weight: 600;padding-left: 5px;">
          统计  
          <span class="orderText">订单数量：{{ orderNumber }}</span>
          <span class="orderText">订单金额：{{ orderAmount }}</span>
          <span class="orderText">外包金额：{{ outsourceAmount }}</span>
          <span class="orderText">回款金额：{{ collectionAmount }}</span>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
       />
       </div>
 
       
 
       <!-- 添加或修改项目对话框 -->
       <el-dialog :title="title" v-model="open" width="80%" append-to-body>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="项目信息" name="1">
            <el-form :model="form" :rules="rules" ref="projectRef" label-width="110px" disabled>
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
                        clearable
                        class="inline-input w-50"
                        placeholder="项目企业"
                        />
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="项目代码" prop="projectCategoryOneName">
                        <el-autocomplete
                        v-model="form.projectCategoryOneName"
                        clearable
                        class="inline-input w-50"
                        placeholder="项目代码"
                        />
                    </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row>
                <el-col :span="8">
                  <el-form-item label="制作部门" prop="responsibleDepartmentName">
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
                    <el-input v-model="form.responsibleDepartmentName" placeholder="请输入制作部门" maxlength="30" />
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
                    <el-form-item label="项目分类" prop="projectExplanatory">
                        <el-input v-model="form.artsProjectFlowPathName" placeholder="请输入注释" />
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
            </el-form>
            </el-collapse-item>
            <el-collapse-item title="财务信息" name="2">
            <el-form :model="form" :rules="rules" ref="projectRef1" label-width="110px" disabled>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="制作周期(天)" prop="unitPrice1">
                            <el-input v-model="form.unitPrice1" placeholder="请输入单价" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单价(人天)" prop="unitPrice">
                            <el-input v-model="form.unitPrice" placeholder="请输入单价" maxlength="30" />
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
                    <el-col :span="12">
                    <el-form-item label="外包金额(元)" prop="outsourcingAmount">
                        <el-input v-model="form.outsourcingAmount" placeholder="请输入外包金额"  type="text" />
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否完成" prop="isContractor">
                            <el-radio-group v-model="form.isContractor" class="ml-4">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="2">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
        </el-collapse>
          <template #footer>
             <div class="dialog-footer">
                <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
                <el-button @click="cancel">取 消</el-button>
             </div>
          </template>
       </el-dialog>
       <!-- 回款 -->
       <el-dialog title="回款明细" v-model="open1" width="500" append-to-body :close-on-click-modal="false">
          <el-form ref="collectionRef" :model="formInfo.data" :rules="formInfo.rules" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="项目名称" prop="projectName">
                  {{ formInfo.data.projectName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="待回款金额">
                  {{ formInfo.data.orderAmount }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" label-width="0">
                  <el-button text type='primary' plain @click="handleAllCollection">全部回款</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="回款金额" prop="collectionAmount">
                  <el-input v-model.number="formInfo.data.collectionAmount" placeholder="请输入回款金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="回款日期" prop="collectionTime">
                  <el-date-picker
                    v-model="formInfo.data.collectionTime"
                    type="date"
                    placeholder="请选择回款日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件" class="fileUpload" prop="fileUrl">
                  <el-upload
                    ref="uploadRef"
                    accept=".jpg,.png,.svg,.gif,.webp,.pdf,.jpeg"
                    :headers="upload.headers"
                    :action="upload.url"
                    :disabled="upload.isUploading"
                    :on-progress="handleFileUploadProgress"
                    :on-success="handleFileSuccess"
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
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
             <div class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
                <el-button @click="close">取 消</el-button>
             </div>
          </template>
        </el-dialog>

        <!-- 开票 -->
       <el-dialog title="开票记录" v-model="open2" width="500" append-to-body :close-on-click-modal="false">
          <el-form ref="invoiceRef" v-if="open2" :model="formInfo1.data" :rules="formInfo1.rules" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="项目名称" prop="projectName">
                  {{ formInfo1.data.projectName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="待开票金额">
                  {{ formInfo1.data.orderAmount }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" label-width="0">
                  <el-button text type='primary' plain @click="handleAllInvoice">全部开票</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="开票金额" prop="invoiceAmount">
                  <el-input v-model.number="formInfo1.data.invoiceAmount" placeholder="请输入开票金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="开票日期" prop="invoiceTime">
                  <el-date-picker
                    v-model="formInfo1.data.invoiceTime"
                    type="date"
                    placeholder="请选择开票日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件" class="fileUpload" prop="fileUrl">
                  <el-upload
                    ref="uploadRef1"
                    accept=".jpg,.png,.svg,.gif,.webp,.pdf,.jpeg"
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
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
             <div class="dialog-footer">
                <el-button type="primary" @click="confirm1">确 定</el-button>
                <el-button @click="close1">取 消</el-button>
             </div>
          </template>
        </el-dialog>
        <el-dialog title="新建合同" v-model="open3" width="500" append-to-body :close-on-click-modal="false">
          <el-form ref="contractRef" :model="formInfo2.data" :rules="formInfo2.rules" label-width="90px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="项目名称" prop="itemName">
                  {{ formInfo2.data.itemName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="合同日期" prop="contractTime">
                  <el-date-picker
                    v-model="formInfo2.data.contractTime"
                    type="date"
                    placeholder="请选择合同日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="附件" class="fileUpload" prop="fileUrl">
                  <el-upload
                    ref="uploadRef2"
                    accept=".jpg,.png,.svg,.gif,.webp,.pdf,.jpeg"
                    :headers="upload2.headers"
                    :action="upload2.url"
                    :disabled="upload2.isUploading"
                    :on-progress="handleFileUploadProgress2"
                    :on-success="handleFileSuccess2"
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
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
             <div class="dialog-footer">
                <el-button type="primary" @click="confirm2">确 定</el-button>
                <el-button @click="close2">取 消</el-button>
             </div>
          </template>
        </el-dialog>
        <el-dialog title="利润解析" v-model="open4" width="800" append-to-body :close-on-click-modal="false">
          <div style="text-align: right;margin-bottom: 10px;"><span class="orderText">
            订单总金额：{{ profitObj.orderAmount }}</span>
            <span class="orderText">人工总成本：{{ profitObj.costLaborTotal }}</span>
            <span class="orderText" style="margin-right: 0;">总利润：
              <!-- {{ profitObj.profitTotal }} -->
              <div style="display: inline-block;" v-if="profitObj.profitTotal >= 0"><span class="orderText2">{{ profitObj.profitTotal }}</span><img style="width: 30px; height: 20px;" src="@/assets/images/top1.png" /></div>
              <div style="display: inline-block;" v-if="profitObj.profitTotal < 0"><span class="orderText1">{{ profitObj.profitTotal }}</span><img style="width: 30px; height: 20px;" src="@/assets/images/down1.png" /></div>
            </span>
          </div>
          <el-table v-loading="loading" :data="tableData" row-key="id" :expand-row-keys="expands" @expand-change="expandChange" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column type="expand">
              <template #default="props">
                <div style="margin-left: 299px;">
                  <el-table :data="props.row.children" :show-header="false" border>
                    <!-- <el-table-column label="姓名" align="center" width="80" prop="userName" />
                    <el-table-column label="总消耗成本" align="center" prop="total" /> -->
                    <el-table-column label="阶段" align="center" prop="stageName" />
                    <el-table-column label="工时（天）" align="center" prop="timeConsuming" />
                    <el-table-column label="日成本单价" align="center" prop="dailyCost" />
                    <el-table-column label="日成本合计" align="center" prop="timeConsuming2" />
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" width="55" align="center" type="index" />
            <el-table-column label="姓名" align="center" width="80" prop="name" />
            <el-table-column label="总消耗成本" align="center" prop="total" />
            <el-table-column label="阶段" align="center" prop="stateName" />
            <el-table-column label="工时（天）" align="center" prop="workDay" />
            <el-table-column label="日成本单价" align="center" prop="price" />
            <el-table-column label="日成本合计" align="center" prop="totalPrice" />
          </el-table>
        </el-dialog>
    </div>
 </template>
 
 <script setup name="OrderStatistics">
 import { listProject,deptList, projectStatistics,getOrderProfit } from "@/api/money/orderStatistics";
 import { addCollection, CollectionPrepare } from "@/api/money/collectionDetails";
 import { addInvoice } from "@/api/money/invoicingRecord";
 import { addContract,updateContract } from "@/api/money/contract";
 import { artsList } from "@/api/project/project";
 import { getToken } from "@/utils/auth";
 const router = useRouter();
 const { proxy } = getCurrentInstance();
 
 const projectList = ref([]);
 const artsProjectList = ref([]);
 const departmentList = ref([]);
 const departmentOptions = ref([]);//部门
//  利润解析数据
 const profitObj = ref({
  orderAmount:'',
  costLaborTotal:'',
  profitTotal:'',
 });
 const tableData = ref([]);
 const expands = ref([]);
 const open = ref(false);
 const open1 = ref(false);
 const open2 = ref(false);
 const open3 = ref(false);
 const open4 = ref(false);
 const loading = ref(true);
 const dateRange = ref([]);
 const total = ref(0);
 const title = ref("");
 const projectRef = ref("");
 const projectRef1 = ref("");
 const orderNumber = ref(0);
 const orderAmount = ref(0);
 const collectionAmount = ref(0);
 const outsourceAmount = ref(0);
 const activeNames = ref(['1','2'])
 const options = ref([{
        value: 1,
        label: '已回款',
      }, {
        value: 2,
        label: '未回款'
      }]);
const options1 = ref([{
    value: 1,
    label: '进度正常',
    disabled: true,
  }, {
    value: 2,
    label: '存在风险'
  }, {
    value: 3,
    label: '进度失控'
  }, {
    value: 4,
    label: '已完成'
  }]);

const options2 = ref([{
    value: 2,
    label: '开发',
  }, {
    value: 1,
    label: '美术'
  }]);
const options3 = ref([{
    value: 1,
    label: '内部',
  }, {
    value: 2,
    label: '外包'
  }]);

const shortcuts = [
  {
    text: '近1个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '近1季度',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '近1年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      return [start, end]
    },
  },
]

 
 const data = reactive({
   form: {
    projectEnterpriseName: '',
    projectCategoryOneName: '',
    projectCategoryTwoName: '',
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
     id: undefined,
     deptId: undefined,
     projectCategoryOneName: undefined,
     isCollection: undefined,
     date: undefined,
     startTime: undefined,
     endTime: undefined,
     month: []
   },
   rules: {

   }
 });
 const props = {
  value: 'id',
  // expandTrigger: 'hover',
  checkStrictly : true
 }
 // 回款明细表单
const formInfo = reactive({
  ref: {},
  span: 12,
  data: {
    collectionAmount: 0
  },
  disabled: false,
  fieldList: [],
  rules: {
    projectId: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    collectionAmount: [
      { required: true, message: '必填', trigger: 'blur' },
    ],
    collectionTime: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    fileUrl: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
  },
  labelWidth: "150px",
});
 /*** 回款明细上传文件*/
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
    url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
    id: null,
  });
 // 开票明细表单
 const formInfo1 = reactive({
  ref: {},
  span: 12,
  data: {
    invoiceAmount: 0
  },
  disabled: false,
  fieldList: [],
  rules: {
    projectId: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    invoiceAmount: [
      { required: true, message: '必填', trigger: 'blur' },
    ],
    invoiceTime: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    fileUrl: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
  },
  labelWidth: "150px",
});
 /*** 开票明细上传文件*/
const upload1 = reactive({
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
  url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
  id: null,
});
 // 合同表单
 const formInfo2 = reactive({
  ref: {},
  span: 12,
  data: {},
  disabled: false,
  fieldList: [],
  rules: {
    itemId: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    contractTime: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
    fileUrl: [
      { required: true, message: '必填', trigger: 'blur' }
    ],
  },
  labelWidth: "150px",
});
 /*** 开票明细上传文件*/
const upload2 = reactive({
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
  url: import.meta.env.VITE_APP_BASE_API + "/common/upload",
  id: null,
});
 const { queryParams, form, rules } = toRefs(data);
 
 watch(
  () => open1.value,
  (val) => {
    if (!val) {
      let obj = formInfo.data;
      Object.keys(obj).forEach((k) => {
        obj[k] = null;
      });
      proxy.$refs["uploadRef"].clearFiles();
      proxy.resetForm("collectionRef");
    }
  }
);
watch(
  () => open2.value,
  (val) => {
    if (!val) {
      let obj = formInfo1.data;
      Object.keys(obj).forEach((k) => {
        obj[k] = null;
      });
      proxy.$refs["uploadRef1"].clearFiles();
      proxy.resetForm("invoiceRef");
    }
  }
);

/** 展开 */
const expandChange = (row, expandedRows) => {
  // console.log(row,expandedRows,'expandChange')
  expands.value = []
  if(expandedRows.length){
    row.isExpandeds = true                      
    expands.value.push(row.id)
  }else{
    row.isExpandeds = false
  }
  //  tableData.value = response.rows
  //   ?.map((item,index)=>{
  //     item.id = index
  //     item.isExpandeds = false
  //     return item
  //   });
}
 
 /** 查询项目列表 */
 function getList() {
   loading.value = true;
   listProject(proxy.addDateRange(queryParams.value,dateRange.value)).then(response => {
     projectList.value = response.rows;
     total.value = response.total;
     loading.value = false;
   });
   getProjectStatistics()
 }
 /** 查询项目列表 */
 function getArtsList() {
   artsList().then(response => {
    artsProjectList.value = response.data;
   });
 }
 /** 查询项目统计 */
 function getProjectStatistics() {
  console.log(dateRange.value)
  const params = {
    pageNum: queryParams.value.pageNum,
    pageSize: queryParams.value.pageSize,
    isCollection: queryParams.value.isCollection,
    // beginTime: dateRange.value ? dateRange.value[0] : null,
    // endTime: dateRange.value ? dateRange.value[1] : null,
    id: queryParams.value.id,
    deptId: queryParams.value.deptId,
  }
  
   projectStatistics(params).then(response => {
    //  projectList.value = response.rows;
    orderNumber.value = response.data.orderNumber;
    orderAmount.value = response.data.orderAmount;
    collectionAmount.value = response.data.collectionAmount;
    outsourceAmount.value = response.data.outsourceAmount;
    //  loading.value = false;
   });
 }
 /** 查询部门列表 */
function getDeptTreeList() {
  deptList().then(response => {
    departmentList.value = response.data;
 });
};
//部门下拉选择
const handleChangeDept = (value) => {
//   console.log(value)
  queryParams.value.deptId = value.slice(-1)[0]
}
 /** 取消按钮 */
 function cancel() {
   open.value = false;
   reset();
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
  //  getProjectStatistics()
 }
 /** 重置按钮操作 */
 function resetQuery() {
   dateRange.value = []
   proxy.resetForm("queryRef");
   handleQuery();
 }
 /** 多选框选中数据 */
 function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.postId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
 }
 function sumAdd(arr){
  var sum = 0;
  arr.forEach(function(value) {
    sum += value.timeConsuming2;
  })
  return sum
 }
 /** 利润解析 */
 function handleProjectOpen(row) {
  getOrderProfit(row.id).then(response => {
    console.log(response)
    profitObj.value.orderAmount = response.data.orderAmount
    profitObj.value.costLaborTotal = response.data.costLaborTotal
    profitObj.value.profitTotal = response.data.profitTotal
    tableData.value = []
    Object.keys(response.data.data).forEach(async(k,val) => {
      // obj[k] = null;
      tableData.value.push({
        name: k,
        id: val,
        total: sumAdd(response.data.data[k]),
        children: response.data.data[k],
      })
    });
    console.log(tableData.value)
    // tableData.value = response.data.data
   });
   open4.value = true
 }

 /** 合同 */
 function handleContract(row) { 
  // console.log(row)
  formInfo2.data.itemId = row.id
  formInfo2.data.itemName = row.projectName
  formInfo2.data.type = row.type
  open3.value = true;
 }
 /** 回款 */
 function handleCollection(row) {
  // console.log(row)
  formInfo.data.projectId = row.id
  formInfo.data.projectName = row.projectName
  const params = {
    type: 1,
    projectType: row.type,
    projectId: row.id
  }
  CollectionPrepare(params).then(response => {
    if(response.code == 200){
      formInfo.data.orderAmount = response.data
    }
  });
  open1.value = true;
 }
 /** 开票 */
 function handleInvoicing(row) {
  // console.log(row)
  formInfo1.data.projectId = row.id
  formInfo1.data.projectName = row.projectName
  const params = {
    type: 2,
    projectType: row.type,
    projectId: row.id
  }
  CollectionPrepare(params).then(response => {
    if(response.code == 200){
      formInfo1.data.orderAmount = response.data
    }
  });
  open2.value = true;
 }
 /** 修改项目信息 */
 function handleEdit(row) {
  // console.log(row)
  router.push({ path: "/arts/project", query: { detailId :row.id } });
 }
 /** 详情按钮操作 */
 function handleUpdate(row) {
    form.value = {
      ...row,
    }
    if(row.artsProjectFlowPathName == null){
      form.value.artsProjectFlowPathName = []
    }else{
      form.value.artsProjectFlowPathName = row.artsProjectFlowPathName.split(',')
    }
    form.value.artsProjectFlowPathIdList = []
    form.value.unitPrice = row.artsProjectFinance.unitPrice
    form.value.unitPrice1 = row.productionCycle
    form.value.fabrication = row.artsProjectFinance.fabrication
    form.value.outsourcingAmount = row.artsProjectFinance.outsourcingAmount
    form.value.orderAmount = row.artsProjectFinance.orderAmount
    form.value.remarks = row.artsProjectFinance.remarks
    form.value.isContractor = row.artsProjectFinance.isContractor
    form.value.projectId = row.artsProjectFinance.projectId
    open.value = true;
    title.value = "订单详情";
 }
 /** 关闭弹窗 */
 const close = () => {
    open1.value = false;
  };
  /** 保存 */
  const confirm = () => {
    proxy.$refs["collectionRef"].validate(valid => {
      if (valid) {
        if(formInfo.data.collectionAmount > Number(formInfo.data.orderAmount)){
          proxy.$modal.msgWarning("回款金额不能超过待回款金额");
          return
        }
        addCollection(formInfo.data).then(response => {
          if(response.code == 200){
            open1.value = false;
            proxy.$modal.msgSuccess("回款成功");
          }
        });
      }
    });
  };
  /** 全部回款 */
  const handleAllCollection = () => {
    formInfo.data.collectionAmount = formInfo.data.orderAmount
  };
  /**文件上传中处理 */
  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess = (response, file, fileList) => {
      formInfo.data.fileUrl = response.url
      formInfo.data.fileName = response.originalFilename
      upload.isUploading = false;
      // proxy.$refs["uploadRef1"].handleRemove(file);
  };
 /** 关闭弹窗 */
 const close1 = () => {
    open2.value = false;
  };
  /** 保存 */
  const confirm1 = () => {
    proxy.$refs["invoiceRef"].validate(valid => {
      if (valid) {
        if(formInfo1.data.invoiceAmount > Number(formInfo1.data.orderAmount)){
          proxy.$modal.msgWarning("开票金额不能超过待开票金额");
          return
        }
        addInvoice(formInfo1.data).then(response => {
          if(response.code == 200){
            open2.value = false;
            proxy.$modal.msgSuccess("开票成功");
          }
        });
      }
    });
  };
  /** 全部开票 */
  const handleAllInvoice = () => {
    formInfo1.data.invoiceAmount = formInfo1.data.orderAmount
  };
  /**文件上传中处理 */
  const handleFileUploadProgress1 = (event, file, fileList) => {
    upload1.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess1 = (response, file, fileList) => {
      formInfo1.data.fileUrl = response.url
      formInfo1.data.fileName = response.originalFilename
      upload1.isUploading = false;
      // proxy.$refs["uploadRef1"].handleRemove(file);
  };
  /** 关闭弹窗 */
 const close2 = () => {
    open3.value = false;
  };
  /** 保存 */
  const confirm2 = () => {
    proxy.$refs["contractRef"].validate(valid => {
      if (valid) {
        addContract(formInfo2.data).then(response => {
          if(response.code == 200){
            open3.value = false;
            proxy.$modal.msgSuccess("新建合同成功");
          }
        });
      }
    });
  };
   /**文件上传中处理 */
   const handleFileUploadProgress2 = (event, file, fileList) => {
    upload2.isUploading = true;
  };
  /** 文件上传成功处理 */
  const handleFileSuccess2 = (response, file, fileList) => {
      formInfo2.data.fileUrl = response.url
      formInfo2.data.fileName = response.originalFilename
      upload2.isUploading = false;
      // proxy.$refs["uploadRef2"].handleRemove(file);
  };
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
    // queryParams.value.beginTime = val[0];
    // queryParams.value.endTime = val[1];
    dateRange.value = val;
  };
 
 getList();
 getArtsList();
//  getProjectStatistics();
 getDeptTreeList();
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
 .fileUpload :deep(.el-upload .el-upload-dragger){
   padding: 0 !important;
 }
 .fileUpload :deep(.el-form-item__content){
   line-height: 0 !important;
   .el-upload-list{
     .el-upload-list__item-file-name {
       height: 14px;
       line-height: 14px;
     }
   } 
 }
 .fileUpload :deep(.el-upload .el-upload-dragger .el-icon--upload){
   margin-bottom: 0 !important;
 }
 .orderText{
  color: #409eff;
  font-weight: 600;
  margin: 0 20px;
 }
 .orderText1{
  color: #666;
  font-weight: 600;
  margin: 0;
  margin-left: 0;
 }
 .orderText2{
  display: inline-block;
  color: #ff9725;
  font-weight: 600;
  margin: 0 ;
  margin-left: 0;
 }
 </style>