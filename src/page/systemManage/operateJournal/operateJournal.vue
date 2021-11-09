<template>
    <el-row class="operateJournal">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

        <el-col :span="24" style="padding-top: 12px;">
          <div class="box box-solid">
            <div class="box-body" id="query-area" style="text-align: right">
              <el-form :inline="true" :model="vm.queryObj" size="small" class="demo-form-inline">
                <el-form-item label="">
                  <el-input v-model="vm.queryObj.keyword"  placeholder="请输入关键字" style="width: 280px;"></el-input>
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
            max-height="537"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              fixed
              label="操作名称"
              :show-overflow-tooltip="true"
              width="220">
              <template slot-scope="scope">
                {{scope.row.operationName}}
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="operationType"
              label="操作类型">
            </el-table-column>
            <el-table-column
              min-width="240"
              prop="operationUrl"
              :show-overflow-tooltip="true"
              label="访问地址">
            </el-table-column>

            <el-table-column
              min-width="140"
              prop="remoteAddr"
              label="访问IP">
            </el-table-column>
            <el-table-column
              width="160"
              prop="createUserName"
              label="操作用户">
            </el-table-column>
            <el-table-column
              min-width="160"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作时间">
            </el-table-column>
            <el-table-column
              min-width="140"
              prop="operationMsg"
              label="操作内容">
              <template slot-scope="scope">
                <el-popover
                  placement="left"
                  width="400"
                  @show="rowFormatter(scope.row)"
                  trigger="click">
                  <pre class="language-javascript" v-html="vm.codeStr"></pre>
                  <el-button type="text" size="small" slot="reference">查看操作内容</el-button>
                </el-popover>
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

<script type="javascript" src="./operateJournal.js"></script>
<style scoped lang="less" src="./operateJournal.less"></style>
