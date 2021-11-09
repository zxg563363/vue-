<template>
  <el-row id="warehouse">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
      <div style="padding: 12px 0;">
        <el-button @click="(e)=>{e.stopPropagation(),dialogVisible= true,vm.stock={}}" type="primary" size="small">
          <i class="el-icon-plus"></i>
          新建仓库
        </el-button>
      </div>
      <el-empty v-if="Object.keys(tableData).length === 0" description="暂无仓库信息~">
      </el-empty>

      <el-collapse v-if="Object.keys(tableData).length > 0" v-loading="tableDataLoading" v-model="activeNames">
        <el-collapse-item v-for="(value,key) in tableData" :key="key" :name="key">
          <template slot="title">
           <h2 class="f-s-16 text-bold">
             {{value[0]['onlyTeamName']}}（{{value.length}}）
           </h2>
          </template>
          <el-row :gutter="12" style="margin-top: 12px;">
            <el-col v-for="(stock, index) in value" :key="index" :span="6">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span class="text-bold f-s-13" style="line-height: 39px;">【{{stock.warehouseName}}】</span>
                  <div style="float: right;">
                    <el-button @click="editStock(stock)" type="text" title="编辑">
                      <i class="el-icon-edit"></i>
                    </el-button>
                    &nbsp;
                    <el-popconfirm
                      @confirm="deleteStock(stock)"
                      confirm-button-text='好的'
                      cancel-button-text='不用了'
                      icon="el-icon-info"
                      icon-color="red"
                      title="确定删除此仓库吗？">
                      <el-button slot="reference"  type="text" class="text-danger" title="移除">
                        <i class="el-icon-delete"></i>
                      </el-button>
                    </el-popconfirm>
                  </div>
                </div>
                <el-form :model="stock" label-width="100px" label-suffix="：" class="stock-info">
                  <el-form-item v-if="false" label="仓库所属">
                    {{stock.onlyTeamName}}
                  </el-form-item>
                  <el-form-item label="仓库地址">
                    {{stock.address}}
                  </el-form-item>
                  <el-form-item label="负责人">
                    {{stock.principalName}}
                  </el-form-item>
                  <el-form-item label="备注">
                    {{stock.description}}
                  </el-form-item>
                  <el-form-item label="创建时间">
                    {{stock.createTime}}
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-col>

    <!--新建/编辑仓库-->
    <el-dialog
      :title="(vm.stock.id ? '编辑': '创建')+'仓库'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="remoteMethod()"
      @opened="getChildDepartments()"
      width="500px">
      <el-form :model="vm.stock" :rules="vm.stockRules" ref="stockForm"
               v-loading="dataLoading"
               label-suffix="：" style="width: 450px;"
               label-width="120px" size="small">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="vm.stock.warehouseName" clearable placeholder="请输入仓库名称"></el-input>
        </el-form-item>
        <el-form-item label="仓库所属" prop="onlyTeamId">
          <el-select v-model="vm.stock.onlyTeamId"
                     @change="departmentsChange"
                     filterable clearable placeholder="请选择"
                     style="min-width: 330px;">
            <el-option
              v-for="item in vm.departments"
              :key="item.departId"
              :label="item.departName"
              :value="item.departId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="address">
          <el-select
            v-loading="remoteLoading"
            v-model="vm.stock.principalId"
            filterable
            remote
            reserve-keyword
            allow-create
            clearable
            style="width: 330px;"
            placeholder="请输入姓名"
            @change="userChange"
            :remote-method="remoteMethod"
            :loading="remoteLoading">
            <el-option
              v-for="item in vm.users"
              :key="item.id"
              :label="item.realName"
              :value="item.id">
              <span style="float: left">{{item.realName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.organizationName}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model="vm.stock.address" clearable placeholder="请输入仓库地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            type="textarea"
            :autosize="{minRows: 2, maxRows: 8}"
            placeholder="请输入备注"
            maxlength="500"
            show-word-limit
            v-model="vm.stock.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('stockForm')" size="small">取消</el-button>
        <el-button type="primary"
                   :loading="dataLoading"
                   @click="addStock('stockForm')" size="small">确定
        </el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
