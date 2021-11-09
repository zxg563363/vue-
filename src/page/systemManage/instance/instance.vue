<template>
  <el-row class="operateJournal">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area" style="text-align: left;">
          <el-form :inline="true" :model="vm.queryObj" size="small" label-suffix="：" class="demo-form-inline">
            <el-form-item label="流程实例ID">
              <el-input v-model="vm.queryObj.workflowInsId"  placeholder="请输入实例ID" style="width: 280px;"></el-input>
            </el-form-item>
            <el-form-item label="流程实例名称">
              <el-input v-model="vm.queryObj.workflowName"  placeholder="请输入流程实例名称" style="width: 280px;"></el-input>
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
      <div class="content">
        <el-table
          v-loading="vm.tableDataLoading"
          stripe
          max-height="687"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="流程实例ID"
            prop="workflowInsId"
            :show-overflow-tooltip="true"
            min-width="160">
            <!--<template slot-scope="scope">-->
              <!--<el-button title="点击查看" type="text">{{scope.row.workflowInsId}}</el-button>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
            fixed
            label="流程实例名称"
            prop="workflowName"
            :show-overflow-tooltip="true"
            min-width="270">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="status"
            label="流程状态">
            <template slot-scope="scope">
              <span class="el-tag el-tag--small el-tag--dark" :class="workflowInsStates[scope.row.status]['color']">{{workflowInsStates[scope.row.status]['label']}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="scopeName"
            label="业务范围">
          </el-table-column>
          <!--<el-table-column-->
            <!--min-width="120"-->
            <!--prop="workflowVersion"-->
            <!--label="流程版本">-->
          <!--</el-table-column>-->
          <el-table-column
            min-width="160"
            prop="createUserName"
            label="创建用户">
          </el-table-column>
          <el-table-column
            min-width="160"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            min-width="160"
            :show-overflow-tooltip="true"
            prop="finishTime"
            label="完成时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button @click="interventionProcess(scope.row)" type="text" size="small">
                <i class="el-icon-magic-stick"></i>
                流程干预
              </el-button>
              <!--<el-button type="text" size="small">-->
                <!--<i class="el-icon-delete"></i>-->
                <!--删除-->
              <!--</el-button>-->
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
