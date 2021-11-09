<template>
  <el-row class="deviceList">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-row>
            <el-col :span="10">
              <el-button @click="dialogVisible = true,addSpace = {}" type="primary" size="small">
                <i class="el-icon-plus"></i>
                新建空间
              </el-button>
            </el-col>
            <el-col :span="14" style="text-align: right;">
              <el-form :inline="true" size="small" class="demo-form-inline">
                <el-form-item label="">
                  <el-input v-model="searchData" style="width: 280px;" placeholder="请输入空间名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="search">
                    查询
                  </el-button>
                  <el-button size="small" @click="()=>{searchData = '',getMess()}">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="content">
        <el-table
          v-loading="isLoading"
          ref="multipleTable"
          :data="tableData"
          style="width: 100%;"
          row-key="id"
          :indent="20"
          :select-on-indeterminate="false"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'haschildren'}">
          <!--  <el-table-column
            type="selection"
            width="55"> -->
          <!-- </el-table-column> -->
          <!-- <el-table-column
          prop="companyId"
          label="序号"
          sortable
          >
          </el-table-column> -->
          <el-table-column
            fixed="left"
            align="left"
            prop="spaceName"
            label="名称"
            min-width="200"
            sortable>
          </el-table-column>
          <el-table-column
            prop="spaceCode"
            min-width="160"
            align="center"
            label="编码">
          </el-table-column>
          <el-table-column
            prop="createTime"
            min-width="140"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="description"
            min-width="160"
            align="center"
            label="备注">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            min-width="216">
            <template slot-scope="scope">
              <el-button @click="()=>{addSpace['pId'] = scope.row['id'],addSpace['pName'] = scope.row['spaceName'],dialogVisible = true}" type="text" size="small">
                <i class="el-icon-folder-add"></i>
                添加子空间
              </el-button>
              <el-button @click="()=>{addSpace = JSON.parse(JSON.stringify(scope.row)), dialogVisible = true}" type="text" size="small">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button type="text" size="small" @click="deleteSpace(scope.row)">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-col>

    <!--添加空间-->
    <el-dialog
      :title="(addSpace['id'] ? '编辑': '新建') +'空间'"
      :visible.sync="dialogVisible"
      width="460px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form v-loading="isLoading"
               :model="addSpace" :rules="datarules" ref="addSpace" size="small" label-width="110px" label-suffix="：">
        <el-form-item v-if="addSpace.pName" label="父级空间">
          <label>{{addSpace.pName}}</label>
        </el-form-item>
        <el-form-item label="空间名称" prop="spaceName">
          <el-input v-model="addSpace.spaceName" placeholder="请输入空间名称"></el-input>
        </el-form-item>
        <el-form-item label="空间编码" prop="spaceCode">
          <el-input v-model="addSpace.spaceCode" placeholder="请输入空间编码"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addSpace.description" type='textarea'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false,addSpace = {}" size="small">取消</el-button>
        <el-button v-if="addSpace.id" :loading="isLoading" type="primary" @click="submitForm('addSpace')" size="small">保存更新</el-button>
        <el-button v-else :loading="isLoading" type="primary" @click="submitForm('addSpace')" size="small">立即创建</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script type="javascript" src="./deviceScape.js"></script>
<style scoped lang="less" src="./deviceScape.less"></style>
