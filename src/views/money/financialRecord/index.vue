<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2024-01-23 10:50:40
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
              :props="{ label: 'categoryName', children: 'children',class:customNodeClass }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" style="border-left: 1px solid #e5e5e5;">
        <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
        </el-form> -->

        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
              >新增</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row> -->
        <div class="container-title"><span style="color: #666;">财务总览</span><el-button type="primary" icon="Upload" @click="handleImport">导入工资</el-button></div>
        <div class="container">
          <el-row :gutter="10">
            <el-col :span="spanLeft">
              <div class="container-left">
                <el-row :gutter="10" class="el-row-bom">
                  <el-col :span="15">
                    <div class="boxs-left">
                      <el-row :gutter="10" class="el-row-bom">
                        <el-col :span="12">
                          <div class="box">
                            <el-descriptions title="总收入" :column="1">
                              <el-descriptions-item label="本月"><el-statistic title="" :value="financialObj.totalIncomeThisMonth" value-style="color:#f71702" /></el-descriptions-item>
                              <el-descriptions-item label="上月"><el-statistic title="" :value="financialObj.totalIncomeLastMonth" value-style="color:#f71702" /></el-descriptions-item>
                            </el-descriptions>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="box">
                            <el-descriptions title="总支出" :column="1">
                              <el-descriptions-item label="本月"><el-statistic title="" :value="financialObj.totalExpenditureThisMonth" value-style="color:#f71702" /></el-descriptions-item>
                              <el-descriptions-item label="上月"><el-statistic title="" :value="financialObj.totalExpenditureLastMonth" value-style="color:#f71702" /></el-descriptions-item>
                            </el-descriptions>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10">
                        <el-col :span="12">
                          <div class="box">
                            <el-descriptions title="净利润" :column="1">
                              <el-descriptions-item label="本月"><el-statistic title="" :value="financialObj.netProfitThisMonth" value-style="color:#f71702" /></el-descriptions-item>
                              <el-descriptions-item label="上月"><el-statistic title="" :value="financialObj.netProfitLastMonth" value-style="color:#f71702" /></el-descriptions-item>
                            </el-descriptions>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="box">
                            <el-descriptions title="人员总成本(万元)" :column="1">
                              <el-descriptions-item label="本月"><el-statistic title="" :value="financialObj.personnelTotalExpenditureThisMonth" value-style="color:#f71702" /></el-descriptions-item>
                              <el-descriptions-item label="上月"><el-statistic title="" :value="financialObj.personnelTotalExpenditureLastMonth" value-style="color:#f71702" /></el-descriptions-item>
                            </el-descriptions>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="9">
                    <div class="box1">
                      <div style="width: 100%;display: flex;align-items: flex-start;margin-left: 20px;color: #0d06db;font-weight: bold;">净利润率</div>
                      <el-progress type="circle" color="#24b6c4" stroke-width="10" :percentage="financialObj.netProfitMargin" />
                      <div style="color: #f71702;display: flex;align-items: center;height: 26px;line-height: 26px;"><span style="color:#24b6c4;font-size: 12px;margin-right: 10px;">目标</span> 0%</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="el-row-bom">
                  <el-col :span="12">
                    <div id="myChart2" class="box2"></div>
                  </el-col>
                  <el-col :span="12">
                    <div id="myChart3" class="box2"></div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="el-row-bom">
                  <el-col :span="24">
                    <div id="myChart4" class="box3"></div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="spanRight">
              <div class="container-right">
                <el-row :gutter="10" class="el-row-bom">
                  <el-col :span="24">
                    <div class="box4">
                      <div class="box-title">
                        公司基础费用
                      </div>
                      <!-- <div class="box-list-xs">
                        <div style="width: 20%;box-sizing: border-box;"></div>
                        <div style="width: 40%;box-sizing: border-box;color:#f71702;text-align: center;font-weight: bold;">深圳</div>
                        <div style="width: 40%;box-sizing: border-box;color:#f71702;text-align: center;font-weight: bold;">成都</div>
                      </div> -->
                      <div class="box-list" v-for="(item,index) in financialObj.financeReportCostFormsTwo" :key="index">
                        <div style="font-size: 14px;color: #0d06db;font-weight: bold;width: 26%;">{{ item.name }}</div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">本月</div>
                            <el-statistic title="" :value="item.expenditureThisMonth" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">上月</div>
                            <el-statistic title="" :value="item.expenditureLastMonth" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="box-list">
                        <div style="color: #fff;font-weight: bold;margin-right: 6px;">水电租金</div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#f71702;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">本月</div>
                            <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#f71702;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">上月</div>
                            <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                      </div> -->
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="el-row-bom">
                  <el-col :span="24">
                    <div class="box5">
                      <div class="box-title">
                        各团队收支
                      </div>
                      <div class="box-lists" v-for="(item,index) in financialObj.financeReportCostFormsOne" :key="index">
                        <div style="font-size: 14px;color: #0d06db;font-weight: bold;width: 26%;">{{ item.name }}</div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">本月</div>
                            <!-- <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic> -->
                            <el-statistic title="" :value="item.expenditureThisMonth" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                          <div class="box-list-xs">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">上月</div>
                            <!-- <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic> -->
                            <el-statistic title="" :value="item.expenditureLastMonth" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                        <div class="box-list-xx">
                          <!-- <div class="box-list-xl">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">盈利</div>
                            <el-statistic title="" :value="item.profit" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                          <div class="box-list-xl">
                            <div style="color:#42ec18;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">盈利</div>
                            <el-statistic title="" :value="item.profit" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div> -->
                        </div>
                      </div>
                      <!-- <div class="box-lists">
                        <div style="color: #fff;font-weight: bold;margin-right: 6px;">深圳场景</div>
                        <div class="box-list-xx">
                          <div class="box-list-xs">
                            <div style="color:#f71702;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">本月</div>
                            <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                          <div class="box-list-xs">
                            <div style="color:#f71702;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">上月</div>
                            <el-statistic title="" :value="621500" value-style="color:#f71702;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                        <div class="box-list-xx">
                          <div class="box-list-xl">
                            <div style="color:#f71702;font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">盈利</div>
                            <el-statistic title="" :value="621500" value-style="color:#e7c03b;font-size:14px;"></el-statistic>
                          </div>
                          <div class="box-list-xl">
                            <div style="color:rgba(251, 251, 251, .5);font-size:12px;padding: 0px 4px 0 4px;box-sizing: border-box;">盈利</div>
                            <el-statistic title="" :value="621500" value-style="color:#e7c03b;font-size:14px;"></el-statistic>
                          </div>
                        </div>
                      </div> -->
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="50px">
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
         </el-form>
         <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url + '?data=' + form.date"
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
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
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
  </div>
</template>

<script name="ProjectTemplate">
import { ref,  getCurrentInstance, defineComponent} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const customNodeClass= (data,node)=>{
      console.log(data)
      if(data.isFontWeight){
        return 'is-font-weight'
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
      customNodeClass,
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
.app-container{
  display: flex;
  flex-direction: column;
}
.container-title{
  font-size: 24px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
}
.el-row-bom {
  margin-bottom: 10px;
}
.container{
  width: 100%;
  flex: 1;
  background-color: #fff;
}
.container-left{
  background-color: #fff;
}
.container-right{
  background-color: #fff;
}
.box{
  height: 100px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.box1{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 210px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.box2{
  height: 200px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.box3{
  height: 200px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.box4{
  height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.box5{
  height: 420px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e5e5e5;
}
.el-descriptions{
  padding: 6px 12px;
  :deep(.el-descriptions__header){
    margin-bottom: 8px;
  }
  :deep(.el-descriptions__title){
    color: #0d06db;
  }
  :deep(.el-descriptions__table){
    .el-descriptions__cell{
      padding-bottom: 0;
      display: flex;
      align-items: center;
    }
  }
  :deep(.el-descriptions__label){
    font-size: 12px;
    color: #24b6c4;
  }
  :deep(.el-descriptions__content){
    font-size: 18px;
    color: #f71702;
    .el-statistic{
      display: inline-block;
    }
  }
}
.el-descriptions :deep(.el-descriptions__body){
  background: none;
  padding-left: 12px;
}
.box-title{
  text-align: center;
  color: #0d06db;
  font-weight: bold;
  font-size: 18px;
  padding-top: 10px;
  box-sizing: border-box;
}
.box-list{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 16px;
  box-sizing: border-box;
}
.box-lists{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  box-sizing: border-box;
}
.box-list-xx{
  width: 37%;
}
.box-list-xs{
  width: 100%;
  display: flex;
  align-items: center;
  .el-statistic{
    // width: 40%;
    line-height: 14px;
  }
}
.box-list-xl{
  width: 100%;
  display: flex;
  align-items: center;
  .el-statistic{
    width: 60%;
    line-height: 14px;
  }
}
.el-progress--circle :deep(.el-progress__text){
  font-weight: bold;
  color: #24b6c4;
}
.el-tree :deep(.is-font-weight > .el-tree-node__content){
  font-weight: 600;
}
</style>

