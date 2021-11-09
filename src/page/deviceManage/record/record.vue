<template>
  <div class="inventory">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content">
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="spareName" label="备件名称">
          </el-table-column>
          <el-table-column prop="spareCode" label="备件编号">
          </el-table-column>
          <el-table-column prop="spareTypeName" label="备件类型">
          </el-table-column>
          <el-table-column prop="spareUnitName" label="备件单位">
          </el-table-column>
          <el-table-column prop="spareModel" label="备件型号">
          </el-table-column>
          <el-table-column prop="warehouseName" label="备件库">
          </el-table-column>
          <el-table-column prop="surplusNum" label="库存">
          </el-table-column>
          <el-table-column prop="changeNum" label="变化数量">
          </el-table-column>
          <el-table-column prop="orderName" label="出入库类型">
          </el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <el-pagination @current-change="handleCurrentChange" background layout="total,prev, pager, next" :total="totalData"
          :page-size="10" :current-page.sync="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="javascript" src="./record.js"></script>
<style scoped lang="less" src="./record.less"></style>
