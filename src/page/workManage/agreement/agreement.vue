<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-form :inline="true" :model="vm.queryObj" size="small" class="demo-form-inline">
            <el-form-item label="条件筛选：">
              <el-input v-model="vm.queryObj.slaName" style="width: 380px;"  placeholder="协议名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSubmit">
                查询
              </el-button>
              <el-button size="small" @click="onReset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="box box-solid">
        <div class="box-body">
          <el-button @click="addAgreement" type="primary" size="small">
            <i class="el-icon-plus"></i>
            新建服务协议
          </el-button>
        </div>
      </div>
      <div class="content">
        <el-table
          v-loading="vm.tableDataLoading"
          stripe
          max-height="618"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            prop="slaName"
            label="协议名称"
            min-width="200">
            <template slot-scope="scope">
              <el-link @click="modifyAgreement(scope.row)" :underline="false" title="查看服务协议" type="primary">
                {{scope.row.slaName}}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="slaVersion"
            label="版本号"
            min-width="140">
          </el-table-column>
          <el-table-column
            fixed
            min-width="220"
            :show-overflow-tooltip="true"
            prop="servicePromise"
            label="描述">
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="startDate"
            label="开始时间">
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="endDate"
            label="截止时间">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="modifyTime"
            label="更新时间">
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="100">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" v-if="scope.row.validity==1">启用</el-tag>
              <el-tag type="danger" size="mini" v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            min-width="140">
            <template slot-scope="scope">
              <el-button @click="viewAgreement(scope.row)" type="text" size="small"
                         icon="el-icon-setting"
                         class="red">
                设置
              </el-button>
              <el-button @click="removeAgreement(scope.row)" type="text" size="small"
                         icon="el-icon-delete"
                         class="red">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
