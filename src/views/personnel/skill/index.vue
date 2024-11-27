<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="姓名" prop="applicantName">
        <el-input
          v-model="queryParams.applicantName"
          placeholder="请输入姓名"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
       <el-form-item label="招聘跟进人" prop="followUpPersonId">
        <el-select
          v-model="queryParams.followUpPersonId"
          placeholder="请输入招聘跟进人"
          clearable
          filterable 
          style="width: 200px"
        >
          <el-option
            v-for="item in followUpPersonNameList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="面试结果" prop="interviewResults">
        <el-select
          v-model="queryParams.interviewResults"
          placeholder="面试结果"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
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
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="postList"
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="姓名" min-width="100" align="center" prop="applicantName" />
      <el-table-column
        label="应聘岗位"
        align="center"
        min-width="120"
        prop="applicantPostName"
      />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column
        label="星级"
        width="130"
        align="center"
      >
        <template #default="scope">
          <el-rate allow-half disabled v-model="scope.row.expectations" />
        </template>
      </el-table-column>
      <el-table-column
        label="职级"
        width="120"
        align="center"
        prop="applicantRank"
      >
        <template #default="scope">
          <span v-if="scope.row.applicantRank == 1">初级</span>
          <span v-if="scope.row.applicantRank == 2">中级</span>
          <span v-if="scope.row.applicantRank == 3">高级</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="120" align="center" prop="phonenumber" />
      <el-table-column label="邮箱" width="150" align="center" prop="email" />
      <el-table-column
        label="目前薪资/期望薪资"
        width="150"
        align="center"
        prop="salary"
      />
      <!-- <el-table-column
        label="期望薪资"
        align="center"
        prop="salary"
      /> -->
      <el-table-column
        label="招聘跟进人"
        width="100"
        align="center"
        prop="followUpPersonName"
      />
      <el-table-column label="测试评估" align="center" prop="testEvaluation">
        <template #default="scope">
          <span v-if="scope.row.testEvaluation == '1'">通过</span>
          <span v-else-if="scope.row.testEvaluation == '2'">不通过</span>
          <span v-else-if="scope.row.testEvaluation == '3'">待定</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="面试结果" align="center" prop="twoSideResult">
        <template #default="scope">
          <span v-if="scope.row.twoSideResult == '1'">通过</span>
          <span v-else-if="scope.row.twoSideResult == '2'">不通过</span>
          <span v-else-if="scope.row.twoSideResult == '3'">待定</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="入职情况" align="center" prop="entrySituation">
        <template #default="scope">
          <span v-if="scope.row.entrySituation == '1'">已入职</span>
          <span v-else-if="scope.row.entrySituation == '2'">未入职</span>
          <span v-else-if="scope.row.entrySituation == '3'">已离职</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="120" prop="remarks" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="状态" align="center" prop="status">
           <template #default="scope">
              <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
           </template>
        </el-table-column> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template #default="scope">
          <el-tooltip content="详情" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" :close-on-click-modal="false" width="90%" append-to-body>
      <div class="dialog-wrap">
        <div class="form-main">
          <div class="form-main-top">
            <div>简历编号：{{ dialogForm.id }}</div>
            <div>
              <el-button @click="submitResume">上传简历</el-button>
              <el-button @click="submitWorks">上传作品</el-button>
              <el-button @click="submitWorksPDF">上传作品PDF</el-button>
              <el-button @click="submitTest">上传测试</el-button>
              <!-- <el-button @click="submitForm">保 存</el-button>
              <el-button @click="cancel">关 闭</el-button> -->
            </div>
          </div>
          <div class="form-main-banner">
            <div class="form-main-left">
              <div class="form-main-left-text">基本信息</div>
              <div class="form-main-left-form">
                <el-form :model="dialogForm" label-width="80px">
                  <el-form-item label="姓名">
                    <el-input v-model="dialogForm.applicantName" />
                  </el-form-item>
                  <el-form-item label="应聘岗位">
                    <el-select v-model="dialogForm.applicantPostId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in postOptionsList"
                        :key="item.postId"
                        :label="item.postName"
                        :value="item.postId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <el-input v-model="dialogForm.age" />
                  </el-form-item>
                  <el-form-item label="工作年限">
                    <el-input v-model="dialogForm.workingExperience" />
                  </el-form-item>
                  <el-form-item label="职位年限">
                    <el-input v-model="dialogForm.positionAgeLimit" />
                  </el-form-item>
                  <el-form-item label="联系电话">
                    <el-input v-model="dialogForm.phonenumber" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="dialogForm.email" />
                  </el-form-item>
                </el-form>
              </div>
              <div class="form-main-left-text">岗位信息</div>
              <div class="form-main-left-form">
                <el-form :model="form" label-width="80px">
                  <el-form-item label="项目组">
                    <!-- <el-select v-model="dialogForm.projectTeamId" placeholder="请选择">
                      <el-option
                        v-for="item in projectOptionsList"
                        :key="item.deptId"
                        :label="item.deptName"
                        :value="item.deptId"
                      />
                    </el-select> -->
                    <el-cascader
                      v-model="dialogForm.projectTeamId"
                      :options="projectOptionsList"
                      :props="props"
                      :show-all-levels="false"
                      @change="handleChangeDept"
                      />
                  </el-form-item>
                  <el-form-item label="职级">
                    <el-select v-model="dialogForm.applicantRank" placeholder="请选择">
                      <el-option label="初级" value="1" />
                      <el-option label="中级" value="2" />
                      <el-option label="高级" value="3" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="薪资">
                    <el-input v-model="dialogForm.salary" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="form-main-center">
            <div class="main-tab">
              <div
                @click="selectFilter('jianli')"
                class="main-tab-item"
                :class="{ 'main-tab-item-active': selectTab == 'jianli' }"
              >
                {{ "简历" }}
              </div>
              <div
                @click="selectFilter('zuoping')"
                class="main-tab-item"
                :class="{ 'main-tab-item-active': selectTab == 'zuoping' }"
              >
                {{ "作品" }}
              </div>
              <div
                @click="selectFilter('zuopingPDF')"
                class="main-tab-item"
                :class="{ 'main-tab-item-active': selectTab == 'zuopingPDF' }"
              >
                {{ "作品PFD" }}
              </div>
              <div
                @click="selectFilter('ceshi')"
                class="main-tab-item"
                :class="{ 'main-tab-item-active': selectTab == 'ceshi' }"
              >
                {{ "测试" }}
              </div>
            </div>
            <div class="main-banner" v-if="selectTab == 'jianli'">
              <div class="main-banner-item">
                <div style="width: 100%;height: 100%;" v-if="imageUrl">
                  <iframe
                  v-if="isPdf"
                  :src="imageUrl + '#toolbar=0'"
                  type="application/x-google-chrome-pdf"
                  width="100%"
                  frameborder="0"
                  scrolling="auto"
                  height="100%" />
                  <el-image
                    v-else
                    :src="imageUrl"
                    :zoom-rate="1.2"
                    :preview-src-list="[imageUrl]"
                    :initial-index="4"
                    fit="cover"
                  />
                </div>
                <div style="width: 100%;height: 300px;line-height: 300px;text-align: center;" v-else> 请上传简历 </div>
                <div style="position: absolute;top: 0;right: 80px;" @click="handleDeleteSkill"><el-button>删 除</el-button></div>
                <div style="position: absolute;top: 0;right: 0;" @click="handleDownLoadSkill('',imageUrl)"><el-button>下 载</el-button></div>
              </div>
            </div>
            <div class="main-banner-tow" v-else-if="selectTab == 'zuoping'">
              <div v-if="fileList.length > 0" class="main-banner-tow-image">
                <div class="main-banner-image" v-for="(item,index) in fileList" :key="index">
                  <el-image
                    style="width: 100%; height: 120px;"
                    :src="item.url"
                    :zoom-rate="1.2"
                    :preview-src-list="[item.url]"
                    :initial-index="4"
                    fit="cover"
                  />
                  <el-button class="handleDeleteImg" @click="handleDeleteZuopin(index)">删除</el-button>
                  <div class="main-banner-image-text">{{ item.zName || item.fileName }}</div>
                </div>
              </div>
              <div style="width: 100%;height: 300px;line-height: 300px;text-align: center;" v-else> 请上传作品 </div>
            </div>
            <div class="main-banner" v-if="selectTab == 'zuopingPDF'">
              <div class="main-banner-item">
                <div style="width: 100%;height: 100%;" v-if="imageUrl1">
                  <iframe
                  v-if="isPdf1"
                  :src="imageUrl1 + '#toolbar=0'"
                  type="application/x-google-chrome-pdf"
                  width="100%"
                  frameborder="0"
                  scrolling="auto"
                  height="100%" />
                  <el-image
                    v-else
                    :src="imageUrl1"
                    :zoom-rate="1.2"
                    :preview-src-list="[imageUrl1]"
                    :initial-index="4"
                    fit="cover"
                  />
                </div>
                <div style="width: 100%;height: 300px;line-height: 300px;text-align: center;" v-else> 请上传作品PDF </div>
                <div style="position: absolute;top: 0;right: 80px;" @click="handleDeleteSkill"><el-button>删 除</el-button></div>
                <div style="position: absolute;top: 0;right: 0;" @click="handleDownLoadSkill('',imageUrl1)"><el-button>下 载</el-button></div>
              </div>
            </div>
            <div class="main-banner" v-else>
              <div class="main-banner-item1 test">
                <div style="width: 100%;height: 99%;" v-if="filesUrl">
                  <iframe
                  v-if="isPdf"
                  :src="filesUrl + '#toolbar=0'"
                  type="application/x-google-chrome-pdf"
                  width="100%"
                  frameborder="0"
                  scrolling="auto"
                  height="100%" />
                  <el-image
                    v-else
                    :src="filesUrl"
                    :zoom-rate="1.2"
                    :preview-src-list="[filesUrl]"
                    :initial-index="4"
                    fit="cover"
                  />
                </div>
                <div style="width: 100%;height: 300px;line-height: 300px;text-align: center;" v-else> 请上传文件 </div>
                <div style="position: absolute;top: 0;right: 80px;" @click="handleDeleteTest"><el-button>删 除</el-button></div>
                <div style="position: absolute;top: 0;right: 0;" @click="handleDownLoadTest('',filesUrl)"><el-button>下 载</el-button></div>
              </div>
            </div>
            </div>
            <div class="form-main-right">
              <div class="demo-collapse">
                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-collapse-item title="测试情况" name="1">
                    <div class="form-main-right-form">
                      <el-form :model="dialogForm" label-width="70px">
                        <el-form-item label="发送日期">
                          <el-date-picker
                            v-model="dialogForm.testSendTime"
                            type="date"
                            placeholder="请选择日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD HH:mm:ss"
                          />
                        </el-form-item>
                        <el-form-item label="回传日期">
                          <el-date-picker
                            v-model="dialogForm.testBackhaulTime"
                            type="date"
                            placeholder="请选择日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD HH:mm:ss"
                          />
                        </el-form-item>
                        <el-form-item label="结果">
                          <el-select v-model="dialogForm.testEvaluation" placeholder="请选择">
                            <el-option label="通过" value="1" />
                            <el-option label="不通过" value="2" />
                            <el-option label="待定" value="3" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="星级">
                          <el-rate v-model="dialogForm.expectations" />
                        </el-form-item>
                        <el-form-item label="测试反馈">
                          <el-input v-model="dialogForm.testFeedback" type="textarea" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="一面情况" name="2">
                    <div class="form-main-right-form">
                      <el-form :model="dialogForm" label-width="70px">
                        <el-form-item label="面试时间">
                          <el-date-picker
                            v-model="dialogForm.oneSideTime"
                            type="datetime"
                            placeholder="请选择时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                          />
                        </el-form-item>
                        <el-form-item label="面试官" class="item-select">
                          <el-select v-model="dialogForm.oneSidePeopleId" filterable placeholder="请选择">
                            <el-option
                              v-for="item in followUpPersonNameList"
                              :key="item.userId"
                              :label="item.userName"
                              :value="item.userId"
                            />
                          </el-select>
                          <el-button style="font-size: 16px;margin-left: 5px;" icon="Promotion" @click="handlePush(1)"></el-button>
                        </el-form-item>
                        <el-form-item label="结果">
                          <el-select v-model="dialogForm.oneSideResult" placeholder="请选择">
                            <el-option label="通过" value="1" />
                            <el-option label="不通过" value="2" />
                            <el-option label="待定" value="3" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="一面反馈">
                          <el-input v-model="dialogForm.oneSideFeedback" type="textarea" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="二面情况" name="3">
                    <div class="form-main-right-form">
                      <el-form :model="dialogForm" label-width="70px">
                        <el-form-item label="面试时间">
                          <el-date-picker
                            v-model="dialogForm.twoSideTime"
                            type="datetime"
                            placeholder="请选择时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                          />
                        </el-form-item>
                        <el-form-item label="面试官" class="item-select">
                          <el-select v-model="dialogForm.twoSidePeopleId" filterable placeholder="请选择">
                            <el-option
                              v-for="item in followUpPersonNameList"
                              :key="item.userId"
                              :label="item.userName"
                              :value="item.userId"
                            />
                          </el-select>
                          <el-button style="font-size: 16px;margin-left: 5px;" icon="Promotion" @click="handlePush(2)"></el-button>
                        </el-form-item>
                        <el-form-item label="结果">
                          <el-select v-model="dialogForm.twoSideResult" placeholder="请选择">
                            <el-option label="通过" value="1" />
                            <el-option label="不通过" value="2" />
                            <el-option label="待定" value="3" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="二面反馈">
                          <el-input v-model="dialogForm.twoSideFeedback" type="textarea" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="入职情况" name="4">
                    <div class="form-main-right-form">
                      <el-form :model="dialogForm" label-width="100px">
                        <el-form-item label="状态">
                          <el-select v-model="dialogForm.entrySituation" placeholder="请选择">
                            <el-option label="已入职" value="1" />
                            <el-option label="未入职" value="2" />
                            <el-option label="已离职" value="3" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="100" label="未入职原因" v-if="dialogForm.entrySituation == '2'">
                          <el-input v-model="dialogForm.remarks" type="textarea" />
                        </el-form-item>
                        <el-form-item label-width="100" label="问题及风险点" v-else>
                          <el-input v-model="dialogForm.remarks" type="textarea" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :loading="btnLoading">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 上传简历 -->
    <el-dialog
      v-model="dialogVisible"
      title="上传简历"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
    >
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          accept=".jpg,.jpeg,.png,.svg,.gif,.webp,.pdf"
          drag
          :headers="headers"
          :action="uploadUrl"
          :auto-upload="false"
          :beforeUpload="beforeUpload"
          :onRemove="onRemove"
          :onSuccess="onSuccess"
          :onChange="onChange"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件托到此处，或 <em>点击上传</em>
          </div>
        </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传作品 -->
    <el-dialog
      v-model="dialogVisible1"
      title="上传作品"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose1"
    >
        <el-upload
          ref="uploadRef1"
          class="upload-demo"
          drag
          :headers="headers"
          accept=".jpg,.png,.svg,.gif,.webp,.jpeg"
          :action="uploadUrl"
          multiple
          :auto-upload="false"
          :beforeUpload="beforeUpload1"
          :onRemove="onRemove1"
          :onSuccess="onSuccess1"
          :onChange="onChange1"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件托到此处，或 <em>点击上传</em>
          </div>
        </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm1">确 定</el-button>
          <el-button @click="dialogVisible1 = false">
            取 消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传作品 -->
    <el-dialog
      v-model="dialogVisible3"
      title="上传作品"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose3"
    >
        <el-upload
          ref="uploadRef3"
          class="upload-demo"
          drag
          :headers="headers"
          accept=".pdf"
          :action="uploadUrl"
          multiple
          :auto-upload="false"
          :beforeUpload="beforeUpload3"
          :onRemove="onRemove3"
          :onSuccess="onSuccess3"
          :onChange="onChange3"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件托到此处，或 <em>点击上传</em>
          </div>
        </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm3">确 定</el-button>
          <el-button @click="dialogVisible3 = false">
            取 消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传测试文件 -->
    <el-dialog
      v-model="dialogVisible2"
      title="上传测试"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose2"
    >
        <el-upload
          ref="uploadRef2"
          class="upload-demo"
          drag
          :headers="headers"
          :action="uploadUrl"
          multiple
          :auto-upload="false"
          :beforeUpload="beforeUpload2"
          :onRemove="onRemove2"
          :onSuccess="onSuccess2"
          :onChange="onChange2"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件托到此处，或 <em>点击上传</em>
          </div>
        </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm2">确 定</el-button>
          <el-button @click="dialogVisible2 = false">
            取 消
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Skill">
import Upload from "@/components/Upload/index.vue";
import { cloneDeep } from 'lodash-es';
import Cookies from "js-cookie";
import { listResume, delResume, getResume,addResume,editResume,listPost, handleUpload, uploads,resumePush} from "@/api/personnel/resume";
import { deptList } from "@/api/project/project";
import {Promotion} from '@element-plus/icons-vue'
import { allUser} from "@/api/system/user";
const route = useRoute();


const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/common/upload"
const headers = {Authorization: Cookies.get('Admin-Token')};
const { proxy } = getCurrentInstance();
const options = ref([{
          value: 1,
          label: '通过'
        }, {
          value: 2,
          label: '不通过'
        }]);
        
const postList = ref([]);
const dialogForm = ref({});
const followUpPersonNameList = ref([]);
const postOptionsList = ref([]);
const projectOptionsList = ref([]);
const open = ref(false);
const loading = ref(true);
const btnLoading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const selectTab = ref("jianli");
const activeNames = ref(['1','2','3','4'])
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false) // 作品PDF
const queryRef = ref(null)
const resumeId = ref(null)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 50,
    applicantName: undefined,
    followUpPersonId: undefined,
    interviewResults: '',
  },
  rules: {
    //  postName: [{ required: true, message: "岗位名称不能为空", trigger: "blur" }],
    //  postCode: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }],
    //  postSort: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }],
  },
});

// watch(
//     () => open,
//     (val) => {
//       if (!val) {
//         Object.keys(dialogForm.value).forEach((k) => {
//           dialogForm.value[k] = null;
//         });
//       }
//     }
//   );

const { queryParams, form, rules } = toRefs(data);

const uploadRef = ref(null)
const uploadRef1 = ref(null)
const uploadRef2 = ref(null)
const uploadRef3 = ref(null)
const imageUrl = ref(null)
const imageUrl1 = ref(null)
const filesUrl = ref(null)
const isPdf = ref(false)
const isPdf1 = ref(false)
const file = ref(null)
const files1 = ref(null)
const files = ref([])
const testFiles = ref([])
const fileList = ref([])
const fileList1 = ref([])
const props = {
  value: 'id',
  // expandTrigger: 'hover',
  checkStrictly : true
}

/** 查询企业部门 */
function getCategoryDetail(id) {
  deptList().then(response => {
    projectOptionsList.value = response.data;
 });
};

//部门下拉选择
const handleChangeDept = (value) => {
  //   console.log(value)
  dialogForm.value.projectTeamId = value.slice(-1)[0]
}

const handleClose = () => {
  dialogVisible.value = false
}
const handleClose1 = () => {
  dialogVisible1.value = false
}
const handleClose2 = () => {
  dialogVisible2.value = false
}
// 确定上传简历
const handleConfirm = () => {
  uploadRef.value.submit()
}
// 确定上传作品
const handleConfirm1 = () => {
  uploadRef1.value.submit()
}
// 确定上传作品
const handleConfirm2 = () => {
  uploadRef2.value.submit()
}
/** 折叠面板 */
const handleChange = (val) => {
  console.log(val)
}

/** 查询查询人事简历列表 */
function getList() {
  loading.value = true;
  listResume(queryParams.value).then((response) => {
    postList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询招聘跟进人 */
function getFollowUpPersonNameList() {
  allUser().then((response) => {
    followUpPersonNameList.value = response.rows;
  });
}
/** 查询招聘跟进人 */
function getPostOptionsList() {
  listPost().then((response) => {
    postOptionsList.value = response.data;
  });
}
/** 取消按钮 */
function cancel() {
  imageUrl.value = null;
  imageUrl1.value = null;
  filesUrl.value = null;
  file.value = null;
  files.value = [];
  fileList.value = [];
  selectTab.value = 'jianli';
  reset();
  open.value = false;
}
/** 表单重置 */
function reset() {
  Object.keys(dialogForm.value).forEach((k) => {
    dialogForm.value[k] = null;
  });
  proxy.resetForm("postRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  console.log(queryRef.value)
  proxy.resetForm("queryRef");
  // queryRef.value.resetFields();
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.postId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  imageUrl.value = null;
  imageUrl1.value = null;
  filesUrl.value = null;
  fileList.value = [];
  nextTick(() => {
    open.value = true;
    title.value = "新增简历";
  });
  
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  title.value = "简历详情";
  dialogForm.value = cloneDeep(row);
  dialogForm.value.expectations = Number(dialogForm.value.expectations)
  dialogForm.value.projectTeamId = dialogForm.value.projectTeamId;
  resumeId.value = row.id;
  if (row.resumeFileList.length > 0 && row.resumeFileList[0].fileName.slice(-3) === 'pdf') {
    isPdf.value = true
  } else {
    isPdf.value = false
  }
  if(row.resumeFileList.length > 0){
    files.value = row.resumeFileList
    imageUrl.value = import.meta.env.VITE_APP_BASE_API + row.resumeFileList[0].fileName;
  }else{
    imageUrl.value = null
  }
  if(row.resumeFileList1 && row.resumeFileList1.length > 0){
    files1.value = row.resumeFileList1
    imageUrl1.value = import.meta.env.VITE_APP_BASE_API + row.resumeFileList1[0].fileName;
  }else{
    imageUrl1.value = null
  }
  if(row.testFileList.length > 0){
    testFiles.value = row.testFileList
    filesUrl.value = import.meta.env.VITE_APP_BASE_API + row.testFileList[0].fileName;
  }else{
    filesUrl.value = null
  }
  if(row.worksFileList.length > 0){
    fileList.value = row.worksFileList.map((item)=>{
      item.url = import.meta.env.VITE_APP_BASE_API + item.fileName;
      if(item.fileName){
        const num = item.fileName.lastIndexOf('/')
        item.zName = item.fileName.substring(num + 1)
      }
      return item
    });
  }
  open.value = true;
}
/** 上传简历 */
function submitResume() {
  dialogVisible.value = true
}
/** 删除简历 */
function handleDeleteSkill(){
  imageUrl.value = null;
  files.value = []
}
/** 下载简历 */
function handleDownLoadSkill(fileName, objectUrl){
  const el = document.createElement('a');
  el.download = Date.now() + '简历';
  el.style.display = 'none';
  el.href = objectUrl;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
/** 删除作品 */
function handleDeleteZuopin(index){
  fileList.value.splice(index,1)
}

/** 上传作品 */
function submitWorks() {
  dialogVisible1.value = true
}
/** 上传作品 */
function submitWorksPDF() {
  dialogVisible3.value = true
}
/** 上传测试 */
function submitTest() {
  dialogVisible2.value = true
}
/** 下载简历 */
function handleDownLoadTest(fileName, objectUrl){
  const el = document.createElement('a');
  el.download = Date.now() + '测试';
  el.style.display = 'none';
  el.href = objectUrl;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
/** 删除测试文件 */
function handleDeleteTest(){
  filesUrl.value = null;
  testFiles.value = []
}
// 上传简历文件前
const beforeUpload = (obj) => {
  // console.log(obj)
  // file.value = (obj as any).file
}
// 移除简历文件
const onRemove = (ob) => {
  // file.value = {}
}
// 上传简历文件时
const onChange = (files) => {
  // console.log(files, fileList.value)
  file.value = files.file
}
// 上传简历文件成功
const onSuccess = (response, file, fileList) => {
  // console.log(response, file, fileList)
  files.value = [];
  if (response.originalFilename.slice(-3) === 'pdf') {
    isPdf.value = true
  } else {
    isPdf.value = false
  }
  imageUrl.value = response.url
  proxy.$refs["uploadRef"].handleRemove(file);
  if(dialogForm.value.id){
    response.personnelResumeId = dialogForm.value.id;
    response.type = 1;
  }else{
    // response.personnelResumeId = null;
    response.type = 1;
  }
  files.value.push(response)
  setTimeout(()=>{
    dialogVisible.value = false
  },300)
}
// 上传作品文件前
const beforeUpload1 = (obj) => {
  const isPDF = obj.type === 'application/pdf';
  if (isPDF) {
    proxy.$modal.msgError("上传文件不能是 PDF 格式!");
  }
  return !isPDF;
}
// 移除作品文件
const onRemove1 = (ob) => {
  // file.value = {}
}
// 上传作品文件时
const onChange1 = (files) => {
  // console.log(files, fileList.value)
  // fileList.value = files.fileList
}
// 上传作品文件成功
const onSuccess1 = (response, file, fileLists) => {
  // console.log(response, file, fileLists)
  if(dialogForm.value.id){
    response.personnelResumeId = dialogForm.value.id;
    response.type = 2;
  }else{
    // response.personnelResumeId = null;
    response.type = 2;
  }
  fileList.value.push(response)
  proxy.$refs["uploadRef1"].handleRemove(file);
  setTimeout(()=>{
    dialogVisible1.value = false
  },300)
}
// 上传测试文件前
const beforeUpload2 = (obj) => {
  // console.log(obj)
  // file.value = (obj as any).file
}
// 移除测试文件
const onRemove2 = (ob) => {
  // file.value = {}
}
// 上传测试文件时
const onChange2 = (files) => {
  // console.log(files, fileList.value)
  // fileList.value = files.fileList
}
// 上传测试文件成功
const onSuccess2 = (response, file, fileLists) => {
  // console.log(response, file, fileLists)
  testFiles.value = [];
  if (response.originalFilename.slice(-3) === 'pdf') {
    isPdf.value = true
  } else {
    isPdf.value = false
  }
  filesUrl.value = response.url
  proxy.$refs["uploadRef2"].handleRemove(file);
  if(dialogForm.value.id){
    response.personnelResumeId = dialogForm.value.id;
    response.type = 3;
  }else{
    // response.personnelResumeId = null;
    response.type = 3;
  }
  testFiles.value.push(response)
  setTimeout(()=>{
    dialogVisible2.value = false
  },300)
}
// 上传作品文件前
const beforeUpload3 = (obj) => {
  const isPDF = obj.type === 'application/pdf';
  if (isPDF) {
    proxy.$modal.msgError("上传文件不能是 PDF 格式!");
  }
  return !isPDF;
}
// 移除作品文件
const onRemove3 = (ob) => {
  // file.value = {}
}
// 上传作品文件时
const onChange3 = (files) => {
  // console.log(files, fileList.value)
  // fileList.value = files.fileList
}
// 上传作品文件成功
const onSuccess3 = (response, file, fileLists) => {
  // console.log(response, file, fileLists)
  if(dialogForm.value.id){
    response.personnelResumeId = dialogForm.value.id;
    response.type = 2;
  }else{
    // response.personnelResumeId = null;
    response.type = 2;
  }
  fileList1.value.push(response)
  proxy.$refs["uploadRef3"].handleRemove(file);
  setTimeout(()=>{
    dialogVisible3.value = false
  },300)
}
/** 提交按钮 */
function submitForm() {
  const params = {
    ...dialogForm.value,
    resumeFileList:files.value,
    worksFileList:fileList.value,
    testFileList:testFiles.value,
  }
  btnLoading.value = true
  if(!dialogForm.value.id){
    addResume(params).then((response) => {
      btnLoading.value = false
      getList();
      open.value = false;
    }).catch(() => {
      btnLoading.value = false
    })
  }else{
    editResume(params).then((response) => {
      btnLoading.value = false
      getList();
      open.value = false;
    }).catch(() => {
      btnLoading.value = false
    })
  }
}
/** 删除按钮操作 */
function handleDelete(row) {
  const name = row.applicantName;
  proxy.$modal
    .confirm('是否确认删除名字为"' + name + '"的简历吗？')
    .then(function () {
      return delResume(row.id);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "system/post/export",
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`
  );
}

function selectFilter(type) {
  selectTab.value = type;
}
/** 推送 */
function handlePush(val) {
  if(val == 1){
    const params = {
      id: resumeId.value,
      userId: dialogForm.value.oneSidePeopleId,
    }
    resumePush(params).then((response) => {
      if(response.code == 200){
        proxy.$modal.msgSuccess("推送成功");
      }
    })
  }else{
    const params = {
      id: resumeId.value,
      userId: dialogForm.value.twoSidePeopleId,
    }
    resumePush(params).then((response) => {
      if(response.code == 200){
        proxy.$modal.msgSuccess("推送成功");
      }
    })
  }
  
}

getList();
getCategoryDetail(0);
getFollowUpPersonNameList();
getPostOptionsList();

onMounted(() => {
  if(route.query.detailId){
    setTimeout(()=>{
      postList.value.map((item)=>{
        if(item.id == route.query.detailId){
          handleUpdate(item)
        }
      })
    },500)
  }
})
</script>
<style scoped>
.dialog-wrap {
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 3px;
}
.dialog-form-content {
  flex: 1;
  overflow: auto;
}
.form-number {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  position: absolute;
  top: 15px;
  left: 10px;
  display: flex;
  align-items: center;
}
.top-opt-btn {
  padding-top: 2px;
  padding-bottom: 2px;
}
.form-item-box {
  padding-bottom: 40px;
  border-top: 1px solid #eee;
}
.opt {
  display: flex;
  align-items: center;
  position: absolute;
  top: -26px;
  left: 0px;
  width: 750px;
}
.opt-gap {
  flex: 1;
}
.mr {
  margin-right: 5px;
}
.ml {
  margin-left: 5px;
}

.form-dialog-header {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  border-bottom: 1px solid #ccc;
  color: #fff;
  padding: 0 30px;
}
.form-dialog-header-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.time-range-box {
  font-size: 12px;
  color: #999;
  padding: 5px 30px;
}

.form-main {
  width: 100%;
  height: 100%;
  border: 1px solid #e5e5e5;
}
.form-main-top{
  width: 100%;
  height: 50px;
  display: flex;
  font-weight: 600;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}
.form-main-banner{
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
}
.form-main-banner :deep(.el-form .el-form-item__label) {
  font-weight: 400 !important;
}
.form-main-left {
  width: 270px;
  height: 100%;
  padding: 0 20px;
  overflow-y: auto;
}
.form-main-left-text{
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e5;
}
.form-main-left-form{
  margin: 20px 0;
}
.form-main-right-form{
  margin: 20px 0;
  /* border-top: 1px solid #e5e5e5; */
}
.form-main-center {
  width: calc(100% - 570px);
  height: 100%;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
}
.form-main-right {
  width: 300px;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
}
.main-text {
  width: 100%;
  height: 50px;
  padding-left: 20px;
  line-height: 50px;
  font-size: 16px;
}

.form-main-right-box {
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}
.form-main-right-box-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: orchid;
  text-align: center;
}
.form-main-right-box-banner {
  width: 100%;
  height: 100px;
  background-color: #fff;
  color: #333;
  padding: 12px;
  box-sizing: border-box;
}
.main-tab {
  width: 100%;
  height: 40px;
  display: flex;
  border-bottom: 1px solid #ebeef5;
}
.main-tab-item {
  width: 50%;
  height: 40px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  border-right: 1px solid #ebeef5;
}
.main-tab-item-active {
  background-color: #999;
}
.main-banner {
  width: 100%;
  height: calc(100% - 51px);
  /* min-height: 700px; */
  padding: 20px;
  overflow-y: auto;
  /* display: flex;
  justify-content: space-between; */
}
.main-banner-tow {
  width: 100%;
  height: calc(100% - 51px);
  /* min-height: 700px; */
  padding: 20px;
  overflow-y: scroll;
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap; */
}
.main-banner-tow-image{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.main-banner-item {
  width: 100%;
  height: 100%;
  position: relative;
}
.test{
  overflow-y: auto;
}
.main-banner-item img {
  display: block;
  width: 100%;
  height: 100%;
}
.main-banner-item1{
  width: 100%;
  height: 100%;
  position: relative;
}
.main-banner-image {
  width: 30%;
  height: 180px;
  text-align: center;
  margin-right: 20px;
  margin-bottom: 10px;
  position: relative;
}
.main-banner-image-text{
  width: 100%;
  height: 60px;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.main-banner-image:nth-child(3n){
  margin-right: 0;
}
.item-select :deep(.el-form-item__content){
  flex-wrap: nowrap;
}
.app-container{
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
.handleDeleteImg{
  position: absolute;
  top: 0;
  right: 0;
}
</style>