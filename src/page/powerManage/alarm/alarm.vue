<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
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
          label="编号"
          width="170">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="collectorName"
          label="传感器名称"
          width="190">
        </el-table-column>
        <el-table-column
          prop="address"
          width="70"
          label="短地址">
        </el-table-column>
        <el-table-column
          prop="content"
          min-width="160"
          show-overflow-tooltip
          label="告警内容">
        </el-table-column>
        <el-table-column
          prop="spaceName"
          width="140"
          show-overflow-tooltip
          label="位置">
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
          prop="alarmTime"
          width="155"
          label="告警时间">
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
