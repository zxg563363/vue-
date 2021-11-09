<template>
  <el-row id="warehouse">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
      <el-table :data="tableData"
                v-loading="tableDataLoading"
                stripe
                style="width: 100%">
        <el-table-column
          fixed
          prop="spareCode"
          min-width="140px"
          label="备件编码">
          <template slot-scope="scope">
            <el-button title="点击查看" type="text">{{scope.row.spareCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed min-width="140px" prop="spareName" label="备件名称">
        </el-table-column>
        <el-table-column prop="spareTypeName" label="备件类型">
        </el-table-column>
        <el-table-column prop="spareModel" label="备件规格">
        </el-table-column>
        <el-table-column prop="spareUnitName" label="备件单位">
        </el-table-column>
        <el-table-column prop="warehouseName" label="所属仓库">
        </el-table-column>
        <el-table-column prop="spareNum" label="库存数量">
        </el-table-column>
        <el-table-column prop="safeNum" label="安全库存">
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
