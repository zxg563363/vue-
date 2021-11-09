<template>
  <el-row class="addRules">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" class="content">
      <div class="title">
        <el-button type="primary" size="small" @click="addRule"><i class="el-icon-circle-plus" style="margin-right: 5px;"></i>添加规则</el-button>
      </div>
      <el-table
        stripe
        :v-loading="tableDataLoading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="ruleName"
          label="规则包名称"
          min-width="280">
          <template slot-scope="scope">
            <el-button @click="updateRule(scope.row)" type="text" size="small">
              {{scope.row.ruleName}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="220">
        </el-table-column>
        <el-table-column
          label="触发类型">
          <template slot-scope="scope">
            {{scope.row.triggerAction|statusFormat}}
          </template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级">
        </el-table-column>
        <!-- <el-table-column
           label="是否锁定">
           <template slot-scope="scope">
             {{scope.row.locking==0?'未锁定':'锁定'}}
           </template>
         </el-table-column>
         <el-table-column
           label="数据有效">
           <template slot-scope="scope">
             {{scope.row.validity==0?'无效':'有效'}}
           </template>
         </el-table-column> -->
        <el-table-column
          min-width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
          </template>
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

<script src="./rules.js" type="javascript"></script>
<style scoped src="./rules.less" lang="less"></style>
