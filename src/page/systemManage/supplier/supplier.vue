<template>
  <div class="supplier">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row>
      <el-col :span="24">
        <div id="query-area" class="box box-solid">
          <div class="box-body">
            <el-row>
              <el-col :span="12">
                <el-form :inline="true">
                  <el-form-item>
                    <el-button @click="dialogVisible=true, entityData={}" type="primary" size="small">
                      <i class="el-icon-plus"></i>
                      创建供应商
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12" style="text-align: right;">
                <el-form :inline="true">
                  <el-form-item>
                    <el-input type='text'
                              style="width: 220px;"
                              v-model="query.key"
                              size="small" placeholder="请输入供应商名称、联系人、电话"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="search" type="primary" size="small">搜索</el-button>
                    <el-button @click="query.key = '', search()" size="small">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col v-for="(item,index) in tableData" :key="index" :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix card-header" style="position: relative;">
            <el-row>
              <el-col :span="6" style="padding: 12px 0px; text-align: center;">
                <el-button circle class="card-header-btn" style="width: 48px; height: 48px;">{{item.supplierName.substring(0,1)}}</el-button>
              </el-col>
              <el-col :span="18">
                <h3 style="line-height: 72px;font-weight: bold; width:auto; max-width: 290px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                    class="text-primary f-s-13">{{item.supplierName}}</h3>
              </el-col>
            </el-row>
            <div style="position: absolute; right: 12px; top:92px; text-align: right;z-index: 1;">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-link @click="editSupplier(item)" type="primary" size="small" icon="el-icon-edit" :underline="false"></el-link>
              </el-tooltip>
              &nbsp;
              <el-popconfirm @confirm="removeSupplier(item)" title="确定删除吗？">
                <el-link type="danger" slot="reference" size="small" icon="el-icon-delete" :underline="false"></el-link>
              </el-popconfirm>
            </div>
          </div>
          <el-form label-width="100px" label-suffix="：" class="card-form">
            <el-form-item label="信用编号">
              {{item.supplierNumber}}
            </el-form-item>
            <el-form-item label="企业全称">
              <span style="max-width: 290px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                 {{item.supplierName}}
              </span>
            </el-form-item>
            <el-form-item label="企业简称">
              {{item.supplierNickName}}
            </el-form-item>
            <el-form-item label="等级">
              <el-tag size="small" effect="dark">{{grade[item.supplierGrade]['text']}}</el-tag>
            </el-form-item>
            <el-form-item label="联系人">
              {{item.supplierLinkUser}}
            </el-form-item>
            <el-form-item label="联系电话">
              {{item.supplierLinkPhone}}
            </el-form-item>
            <el-form-item label="账户绑定">
              <el-link  icon="el-icon-user-solid" :underline="false" type="primary">{{item.supplierAccountName}}</el-link>
            </el-form-item>
            <el-form-item v-if="false" label="供应内容">
              <show-more :content="item.purchasingContent"></show-more>
            </el-form-item>
            <!--<el-divider><span class="f-s-13">供应</span> <i class="el-icon-shopping-bag-1"></i> <span class="f-s-13">内容</span></el-divider>-->
          </el-form>

        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align: right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handleCurrentChange"
          @next-click="handleCurrentChange"
          :current-page.sync="pageData.pageNumber"
          :page-sizes="pageSizes"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, sizes"
          :total="pageData.recordCount">
        </el-pagination>
      </el-col>
    </el-row>

    <!--供应商信息 弹出框-->
    <el-dialog
      :title="(entityData.id ? '编辑': '创建')+'供应商'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="750px">
      <el-form :inline="false" :model="entityData" :rules="vm.rules" ref="supplierForm"
               v-loading="dataLoading"
               label-suffix="：" style="width: 700px;"
               label-width="150px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业信用统一编码" prop="supplierNumber">
              <el-input v-model="entityData.supplierNumber" clearable placeholder="请输入企业信用统一编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="企业全称" prop="supplierName">
              <el-input v-model="entityData.supplierName" clearable placeholder="请输入企业全称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="企业简称" prop="supplierNickName">
              <el-input v-model="entityData.supplierNickName" clearable placeholder="请输入企业简称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="联系电话" prop="supplierLinkPhone">
              <el-input v-model="entityData.supplierLinkPhone" clearable placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人" prop="supplierLinkUser">
              <el-input v-model="entityData.supplierLinkUser" clearable placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="供应等级" prop="supplierGrade">
              <el-select v-model="entityData.supplierGrade" clearable placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in grade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户绑定" prop="supplierAccountId">
              <el-tag v-if="entityData.supplierAccountId" :disable-transitions="true"
                      @close="entityData.supplierAccountId='', entityData.supplierAccountName=''"
                      size="small" effect="dark" closable>{{entityData.supplierAccountName}}</el-tag>
              <el-button v-if="!entityData.supplierAccountId" @click="opens=true" icon="el-icon-plus" type="primary" circle size="small"></el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="供应内容" prop="purchasingContent">
          <el-input type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    maxlength="500"
                    show-word-limit
                    v-model="entityData.purchasingContent" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('supplierForm')" size="small">取消</el-button>
        <el-button type="primary"
                   :loading="dataLoading"
                   @click="addSupplier('supplierForm')" size="small">确定
        </el-button>
      </div>
    </el-dialog>
    <DepToPerson v-bind:fatherData="[]"
                 v-bind:opens="opens"
                 v-on:dialogOpen="getOpens"
                 :multi-select="false"
                 v-on:personParams="getPersonParams"></DepToPerson>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
