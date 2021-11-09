<template>
  <el-row id="warehouse">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="ime">
            <span style="float: right">
              <el-select
                v-model="branch"
                filterable
                remote
                clearable
                placeholder="选择二级公司"
                :loading="loading"
                @change="searchBranch"
              >
                <el-option
                  v-for="item in SecondaryDepartments"
                  :key="item.departId"
                  :label="item.departName"
                  :value="item.departId"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="spare"
                filterable
                remote
                clearable
                placeholder="请输入供应商备件"
                :remote-method="SpareCondition"
                :loading="loading"
                @change="detailsData"
              >
                <el-option
                  v-for="item in spares"
                  :key="item.spareId"
                  :label="item.spareName + '（' + item.spareCode + '）'"
                  :value="item.spareId"
                >
                </el-option>
              </el-select>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column
              prop="branchName"
              label="二级公司"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="spareName"
              label="备件名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="spareCode"
              label="备件编号"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              prop="spareModel"
              label="备件型号"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column prop="maximum" label="上限" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="minimum" label="下限" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="spareNum"
              label="备件数量"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <a v-if="scope.row.spareNum < scope.row.minimum">
                  <el-link type="danger" v-html="scope.row.spareNum"></el-link>
                   <el-link type="danger" @click="apply(scope.row)">补货申请</el-link>
                </a>

                <el-link
                  v-else
                  type="success"
                  v-html="scope.row.spareNum"
                ></el-link>
              </template>
            </el-table-column>
          </el-table>

          <div class="paging">
            <el-pagination
              background
              layout="total, prev, pager, next, sizes"
              :total="totaldata"
              @current-change="handleCurrent"
              @size-change="handleSizeChange"
              :current-page.sync="spareData.page.pageNumber"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
