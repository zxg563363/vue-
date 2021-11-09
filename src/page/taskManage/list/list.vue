<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-form :inline="true" :model="vm.queryObj" size="small" class="demo-form-inline">
            <el-form-item label="条件筛选：">
              <el-input v-model="vm.queryObj.name" style="width: 380px;"  placeholder="计划名称"></el-input>
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
          <el-button @click="$router.push({name: 'task_plan_add'})" type="primary" size="small">
            <i class="el-icon-plus"></i>
            新建任务计划
          </el-button>
        </div>
      </div>
      <div class="content">
        <keep-alive>
          <el-table
            stripe
            max-height="475"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              fixed
              label="计划名称"
              width="260">
              <template slot-scope="scope">
                <el-link :underline="false" title="点击查看" type="primary" @click="$router.push({name: 'task_plan_update',params:{id: scope.row.id}})">{{scope.row.name}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              prop="planType"
              label="计划类型">
              <template slot-scope="scope">
                {{{'inspection':'巡检','maintain':'保养','spotcheck':'点检'}[scope.row.planType]}}
              </template>
            </el-table-column>
            <el-table-column
              width="160"
              prop="teamName"
              label="所属班组">
            </el-table-column>
            <el-table-column
              label="周期类型"
              width="140">
              <template slot-scope="scope">
                {{scope.row.repeatType | repeatTypeFormatter}}
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              prop="repeatScope"
              label="循环周期">
            </el-table-column>
            <el-table-column
              width="220"
              prop="repeatTimes"
              label="时间点">
            </el-table-column>
            <el-table-column
              width="120"
              label="状态">
              <template slot-scope="scope" >
                <el-tag v-if="scope.row.validity == 0" type="danger" size="small">无效</el-tag>
                <el-tag v-if="scope.row.validity == 1" type="success" size="small">有效</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              width="180"
              :show-overflow-tooltip="true"
              prop="describe"
              label="备注">
            </el-table-column>
            <el-table-column
              width="120"
              prop="createUserName"
              label="创建用户">
            </el-table-column>
            <el-table-column
              width="140"
              prop="modifyTime"
              label="修改日期">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="160">
              <template slot-scope="scope">
                <el-button @click="updatePlanValidity(scope.row)" type="text" size="small"
                           icon="el-icon-view"
                           class="red">
                  {{scope.row.validity == 0 ? '启用' : '禁用'}}
                </el-button>

                <el-popconfirm
                  title="确定删除此计划吗？" @confirm="removePlan(scope.row)">
                  <el-button type="text" size="small" class="red"
                             slot="reference"
                             icon="el-icon-delete">
                    移除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </keep-alive>
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
