<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-02-15 10:37:39
 * @LastEditors: lijiancong
 * @LastEditTime: 2025-02-24 16:28:15
-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input
               v-model="queryParams.supplierName"
               placeholder="请输入供应商名称"
               clearable
               style="width: 200px !important"
            />
      </el-form-item>
      <el-form-item label="归属城市" prop="locationCity">
        <el-tree-select
          v-model="queryParams.locationCity"
          :data="cityCode"
          :props="{ value: 'name', label: 'name', children: 'city' }"
          value-key="name"
          placeholder="请选择所在城市"
          check-strictly
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="供应商等级" prop="supplierLevel">
        <el-select v-model="queryParams.supplierLevel" placeholder="请选择供应商等级" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.supplierDJList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商规模" prop="supplierScale">
        <el-select v-model="queryParams.supplierScale" placeholder="请选择供应商规模" clearable filterable style="width: 200px">
          <el-option
              v-for="item in listTypeInfo.supplierList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务范围" prop="scopeBusiness">
        <el-select v-model="queryParams.scopeBusiness" placeholder="请选择业务范围" multiple clearable filterable style="width: 200px">
          <el-option
              v-for="item in member_shtick_type"
              :key="item.value"
              :label="item.label"
              :value="item.label"
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
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAddOpen"
          >新增</el-button>
          <el-button
            type="danger"
            plain
            @click="handleClear"
          >一键清空授权</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column label="供应商名称" align="center" prop="supplierName">
      </el-table-column>
      <el-table-column label="归属城市" align="center" prop="locationCity" />
      <el-table-column label="供应商等级" align="center" prop="supplierLevel">
        <template #default="scope">
          <div v-if="scope.row.supplierLevel == '合格供应商'" style="display: inline-block;width: 6px;height: 6px;border-radius: 3px;background-color: #0d06db;margin-right: 3px;"></div>
          <div v-else-if="scope.row.supplierLevel == '退出供应商'" style="display: inline-block;width: 6px;height: 6px;border-radius: 3px;background-color: #f71702;margin-right: 3px;"></div>
          <div v-else-if="scope.row.supplierLevel == '淘汰供应商'" style="display: inline-block;width: 6px;height: 6px;border-radius: 3px;background-color: #f71702;margin-right: 3px;"></div>
          <div v-else style="display: inline-block;width: 6px;height: 6px;border-radius: 3px;background-color: #42ec18;margin-right: 3px;"></div>
          <span>{{scope.row.supplierLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商规模" align="center" prop="supplierScale" />
      <el-table-column label="业务范围" align="center" prop="scopeBusiness" />
      <el-table-column label="联系人" align="center" prop="contactPerson" />
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="职务" align="center" prop="positionLiaisonPerson" />
      <el-table-column label="入库时间" align="center" prop="storageTime" />
      <el-table-column label="状态" align="center" prop="supplierStatus">
      <template #default="scope">
          <span>{{ scope.row.supplierStatus == '1' ? '开通': '冻结' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-tooltip content="授权" placement="top">
                <el-button link type="primary" icon="Tools" @click="handleTools(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="查看" placement="top">
                <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="冻结" placement="top">
                <el-button link type="primary" icon="Lock" @click="handleOpenOrClose(scope.row,'0')"></el-button>
            </el-tooltip>
            <el-tooltip content="开通" placement="top">
                <el-button link type="primary" icon="Unlock" @click="handleOpenOrClose(scope.row,'1')"></el-button>
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
    

    <Dialog
      :visible="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :width="'80%'"
      @close="dialogInfo.visible = false"
      @handleClick="handleClick"
    >
      <el-form ref="supplierRef" :model="formInfo.data" :rules="formInfo.rules" label-width="110px" :disabled="type == 'view'">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="供应商基础信息" name="1" disabled>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="公司名称" prop="supplierName">
                      <el-input v-model="formInfo.data.supplierName" placeholder="请输入公司名称" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所在城市" prop="locationCity">
                      <!-- <el-select v-model="formInfo.data.locationCity" multiple placeholder="请选择所在城市">
                          <el-option
                            v-for="item in cityCode"
                            :key="item.adcode"
                            :label="item.name"
                            :value="item.adcode"
                          ></el-option>
                      </el-select> -->
                      <el-tree-select
                        v-model="formInfo.data.locationCity"
                        :data="cityCode"
                        :props="{ value: 'name', label: 'name', children: 'city' }"
                        value-key="name"
                        placeholder="请选择所在城市"
                        check-strictly
                     />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商规模" prop="supplierScale">
                      <el-select v-model="formInfo.data.supplierScale" placeholder="请选择供应商规模">
                          <el-option
                            v-for="item in listTypeInfo.supplierList"
                            :key="item.value"
                            :label="item.key"
                            :value="item.key"
                          ></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="对接人" prop="contactPerson">
                      <el-input v-model="formInfo.data.contactPerson" placeholder="请输入对接人" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="对接人职位:" prop="positionLiaisonPerson">
                      <el-input v-model="formInfo.data.positionLiaisonPerson" placeholder="请输入对接人职位:" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码" prop="mobile">
                      <el-input v-model="formInfo.data.mobile" placeholder="请输入手机号码" maxlength="30" />
                    </el-form-item>
                </el-col>
              </el-row>
       
              <el-row>
                <el-col :span="8">
                    <el-form-item label="供应商等级:" prop="supplierLevel">
                      <el-select v-model="formInfo.data.supplierLevel" placeholder="请选择供应商等级">
                          <el-option
                            v-for="item in listTypeInfo.supplierDJList"
                            :key="item.value"
                            :label="item.key"
                            :value="item.key"
                          ></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务范围" prop="scopeBusiness">
                      <!-- multiple -->
                      <el-select v-model="formInfo.data.scopeBusiness" multiple filterable clearable placeholder="请选择业务范围">
                          <el-option
                            v-for="item in member_shtick_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label"
                          ></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入库时间" prop="storageTime">
                      <el-date-picker
                        v-model="formInfo.data.storageTime"
                        type="date"
                        placeholder="入库时间"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <el-form-item label="公司经营地址" prop="businessAddressCompany">
                      <el-input v-model="formInfo.data.businessAddressCompany" placeholder="请输入公司经营地址" maxlength="30" />
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="公司介绍" prop="companyIntroduction">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="formInfo.data.companyIntroduction"
                      placement="top"
                    >
                      <el-input v-model="formInfo.data.companyIntroduction" placeholder="请输入公司介绍" :autosize="{ minRows: 1, maxRows: 4 }" type="textarea" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="8">
                  <el-form-item label="供应商LOGO" prop="status">
                    <el-upload
                      ref="uploadRef1"
                      class="avatar-uploader"
                      :show-file-list="false"
                      :headers="upload1.headers"
                      :action="upload1.url"
                      :disabled="upload1.isUploading"
                      :auto-upload="true"
                      :on-progress="handleFileUploadProgress"
                      :on-success="handleFileSuccess"
                    >
                      <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商营业执照" prop="remarks">
                    <el-upload
                      ref="uploadRef2"
                      class="avatar-uploader"
                      :limit="5"
                      v-model:file-list="imageUrl2"
                      :headers="upload2.headers"
                      :action="upload2.url"
                      :disabled="upload2.isUploading"
                      list-type="picture-card"
                      :auto-upload="true"
                      :on-preview="handlePictureCardPreview"
                      :on-success="handleFileSuccess1"
                      :on-remove="handleRemove1"
                    >
                      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商资质证书" prop="remarks">
                    <el-upload
                      ref="uploadRef3"
                      class="avatar-uploader"
                      :limit="5"
                      v-model:file-list="imageUrl3"
                      :headers="upload3.headers"
                      :action="upload3.url"
                      :disabled="upload3.isUploading"
                      list-type="picture-card"
                      :auto-upload="true"
                      :on-preview="handlePictureCardPreview"
                      :on-success="handleFileSuccess2"
                      :on-remove="handleRemove2"
                    >
                      <!-- <img v-if="imageUrl3" :src="imageUrl3" class="avatar" /> -->
                      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="供应商财务信息" name="2" disabled>
            <el-row>
              <el-col :span="12">
                <el-form-item label="发票抬头" prop="invoiceHeader">
                  <el-input v-model="formInfo.data.invoiceHeader" placeholder="请输入发票抬头" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业税号" prop="enterpriseNumber">
                  <el-input v-model="formInfo.data.enterpriseNumber" placeholder="请输入企业税号" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开户银行" prop="bankDeposit">
                  <el-input v-model="formInfo.data.bankDeposit" placeholder="请输入开户银行" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行账号" prop="bankAccount">
                  <el-input v-model="formInfo.data.bankAccount" placeholder="请输入银行账号" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位地址" prop="unitAddress">
                  <el-input v-model="formInfo.data.unitAddress" placeholder="请输入单位地址" maxlength="30" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话号码" prop="phoneNumber">
                  <el-input v-model="formInfo.data.phoneNumber" placeholder="请输入电话号码" maxlength="30" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>  
      </el-form>
    </Dialog>
    <el-dialog v-model="dialogVisible">
      <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <el-dialog
      v-model="dialogVisible1"
      title="授权"
      width="500"
    >
      <el-form ref="supplierRef1" :model="formInfo1.data" :rules="formInfo1.rules" label-width="110px">
        <el-form-item label="授权用户" prop="userId">
          <el-select v-model="formInfo1.data.userId" placeholder="授权用户" clearable filterable style="width: 200px" @change="handleChangeUser">
            <el-option
                v-for="item in listTypeInfo.userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基本信息" prop="infoEncipher">
          <el-radio-group v-model="formInfo1.data.infoEncipher">
            <el-radio label="0">加密</el-radio>
            <el-radio label="1">不加密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="财务信息" prop="financeEncipher">
          <el-radio-group v-model="formInfo1.data.financeEncipher">
            <el-radio label="0">加密</el-radio>
            <el-radio label="1">不加密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="handleAuthorize">
            授权
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { ref, getCurrentInstance, defineComponent,onBeforeUnmount, shallowRef, onMounted} from "vue";
import {mainForm, mainTable, baseDialog} from "./hooks/index";
import { getToken } from "@/utils/auth";
import { cityCode } from "@/utils/china";

export default defineComponent({
  components: { },
  setup() {
    const instance = getCurrentInstance()?.proxy;
    const { member_shtick_type } = instance.useDict("member_shtick_type");
    const props = {
      value: 'id',
      // expandTrigger: 'hover',
      checkStrictly : true
    }
    const activeNames = ref([])
    const handleChange = (val) => {
      console.log(val)
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
      cityCode,
      activeNames,
      handleChange,
      member_shtick_type,
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
  height: calc(100vh - 84px) !important;
  min-height: calc(100vh - 84px) !important;
  display: flex;
  flex-direction: column;
}
.app-container .el-table{
  flex: 1;
}
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
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
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader :deep(.el-upload--picture-card){
  width: 100px;
  height: 100px;
}
:deep(.el-upload-list--picture-card .el-upload-list__item){
  width: 100px;
  height: 100px;
}
.w-full{
  width: 100%;
}
</style>

