<template>
  <el-row id="power-command">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" class="content">
      <div class="box box-solid">
        <div class="box-body" id="query-area" style="text-align: right;">
          <el-form :inline="true" :model="params" ref="queryForm" size="small">
            <el-form-item label="">
              <el-input v-model="params.keyword" placeholder="编号、名称等"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">
                <i class="el-icon-search"></i>
                查询
              </el-button>
              <el-button @click="reset">重置</el-button>
              <!--<el-button type="text">展开 <i class="el-icon-arrow-down"></i></el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <el-table
        v-loading="tableDataLoading"
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          fixed
          prop="id"
          label="指令序号"
          width="140">
          <template slot-scope="scope">
            {{scope.row.commandSequence}}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="commandName"
          label="指令名称"
          width="160">
        </el-table-column>
        <el-table-column
          prop="commandCode"
          width="100"
          label="指令编码">
        </el-table-column>
        <el-table-column
          prop="commandParams"
          min-width="160"
          show-overflow-tooltip
          label="指令参数">
        </el-table-column>
        <el-table-column
          prop="equipCode"
          width="140"
          show-overflow-tooltip
          label="设备编码">
        </el-table-column>
        <el-table-column
          prop="equipName"
          min-width="150"
          show-overflow-tooltip
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="executeStatus"
          width="140"
          label="执行状态">
        </el-table-column>
        <el-table-column
          prop="executeMsg"
          width="140"
          show-overflow-tooltip
          label="失败消息">
        </el-table-column>
        <el-table-column
          prop="validity"
          width="100"
          label="有效性">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="155"
          label="创建时间">
        </el-table-column>
      </el-table>
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
