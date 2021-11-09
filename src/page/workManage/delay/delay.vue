<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <el-row v-if="false" class="query-status">
        <el-col :span="6" v-for="(item,i)  in vm.disposeStatus" :key='i'
                :class="item.selected ? 'active' : ''">
          <div @click="changeStatus(item,i)">{{item.label}}</div>
        </el-col>
      </el-row>
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-radio-group v-if="false" v-model="vm.queryObj.disposeStatus" @change="disposeStatusChange" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <!--<el-radio-button label="reviewed">待我审核</el-radio-button>-->
            <el-radio-button label="audited">我审核的</el-radio-button>
          </el-radio-group>
          <el-form :inline="true" :model="vm.queryObj" size="small" style="float: right;">
            <el-form-item label="">
              <el-input v-model="vm.queryObj.repairOrderId" style="width: 280px;"  placeholder="工单编号"></el-input>
            </el-form-item>
            <el-form-item label="" v-if="false">
              <el-date-picker
                v-model="vm.queryObj.applyTime"
                type="datetimerange"
                :picker-options="vm.pickerOptions"
                range-separator="至"
                start-placeholder="申请开始日期"
                end-placeholder="申请结束日期"
                align="right">
              </el-date-picker>
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
          max-height="475"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="工单编号"
            min-width="200">
            <template slot-scope="scope">
              <el-link :underline="false" title="查看工单" type="primary" @click="navigationOrder(scope.row.repairOrderId)">{{scope.row.repairOrderId}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            min-width="280"
            prop="cause"
            label="申请事由">
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="applyUserName"
            label="申请人">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="applyTime"
            label="申请时间">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="delayTime"
            label="延期时间">
          </el-table-column>
          <el-table-column
            label="审核状态"
            min-width="100">
            <template slot-scope="scope">
              <el-tag type="info" size="mini" v-if="scope.row.disposeStatus==0">待审核</el-tag>
              <el-tag type="success" size="mini" v-if="scope.row.disposeStatus==1">审核通过</el-tag>
              <el-tag type="danger" size="mini" v-if="scope.row.disposeStatus==2">审核拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.disposeStatus == 0">
                <el-button @click="approved(scope.row)" type="text" size="small"
                           icon="el-icon-view"
                           class="red">
                  延期审核
                </el-button>
              </div>
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

      <el-dialog
        :title="'审核工单延期【'+vm.currentDelay.repairOrderId+'】'"
        :visible.sync="vm.dialogVisible"
        width="500px"
        :show-close="false">
        <el-form ref="delayForm" :model="vm.delayForm" label-width="120px" label-suffix="："
                 :v-loading="vm.delayLoading"
                 size="small">
          <el-form-item label="审核">
            <el-radio-group v-model="vm.delayForm.agree" v-if="vm.currentDelay.disposeStatus==0">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">不通过</el-radio>
            </el-radio-group>
            <label v-else>{{({"1": '通过',"2": '不通过'}[vm.currentDelay['disposeStatus']])}}</label>
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input
              style="width:300px;"
              :disabled="vm.currentDelay.disposeStatus!=0"
              type="textarea"
              :rows="2"
              placeholder="请输入审批意见"
              v-model="vm.delayForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="vm.dialogVisible = false" size="small">取消</el-button>
          <el-button v-if="vm.currentDelay.disposeStatus==0"
                     :v-loading="vm.delayLoading"
                     type="primary" size="small" @click="submitDelay">确定</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
