<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <el-row class="query-status">
        <el-col :span="6" v-for="(item,i)  in vm.evaluateStatus" :key='i'
                :class="item.selected ? 'active' : ''">
          <div @click="changeStatus(item,i)">{{item.label}}</div>
        </el-col>
      </el-row>
      <div class="box box-solid" style="margin-top: 10px;">
        <div class="box-body" id="query-area">
          <el-radio-group v-model="vm.queryObj.evaluationStatus" @change="evaluationStatusChange" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="evaluated">我评价的</el-radio-button>
            <el-radio-button label="solved">我解决的</el-radio-button>
          </el-radio-group>
          <el-form :inline="true" :model="vm.queryObj" size="small" style="float: right;">
            <el-form-item label="">
              <el-input v-model="vm.queryObj.uuId" style="width: 380px;"  placeholder="工单编号"></el-input>
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
          stripe
          max-height="620"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="工单编号"
            min-width="160">
            <template slot-scope="scope">
              <el-link :underline="false" title="点击查看" type="primary" @click="navigationOrder(scope.row.uuId)">{{scope.row.uuId}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            min-width="240"
            prop="description"
            label="情况说明">
          </el-table-column>
          <el-table-column
            width="120"
            prop="contactName"
            label="联系人">
          </el-table-column>
          <!--<el-table-column-->
            <!--width="120"-->
            <!--prop="contactPhone"-->
            <!--label="联系电话">-->
          <!--</el-table-column>-->
          <el-table-column
            label="是否解决"
            min-width="100">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" v-if="scope.row.solution==1">已解决</el-tag>
              <el-tag type="info" size="mini" v-else>未解决</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            prop="receipt"
            :show-overflow-tooltip="true"
            label="解决描述">
          </el-table-column>
          <el-table-column
            min-width="160"
            prop="solutionTime"
            label="解决时间">
          </el-table-column>
          <el-table-column
            min-width="120"
            :formatter="satisfactionFormatter"
            label="满意度">
          </el-table-column>
          <el-table-column
            min-width="140"
            label="处理速度">
            <template slot-scope="scope">
              <el-rate :disabled="true"
                       disabled-void-color="#c0c4cc"
                       v-model="scope.row.processing">
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="服务态度">
            <template slot-scope="scope">
              <el-rate :disabled="true"
                       disabled-void-color="#c0c4cc"
                       v-model="scope.row.serve">
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="evaluationUserName"
            label="评价人">
          </el-table-column>
          <el-table-column
            min-width="150"
            prop="evaluationTime"
            label="评价时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.visible!='-1'">
                <el-button v-if="scope.row.satisfaction=='-1'" @click="evaluateOrder(scope.row)" type="text" size="small"
                           icon="el-icon-trophy"
                           class="red">
                  评价工单
                </el-button>
                <el-button v-else @click="viewEvaluateOrder(scope.row)" type="text" size="small"
                           icon="el-icon-view"
                           class="red">
                  查看评价
                </el-button>
              </div>
              <div v-else>
                <el-link type="danger" disabled icon="el-icon-trophy">
                  禁止评价
                </el-link>
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
        :title="'评价工单【'+vm.currentEvaluate.uuId+'】'"
        :visible.sync="vm.dialogVisible"
        width="500px"
        :show-close="false">
        <el-form ref="evaluateForm" :model="vm.evaluateForm" label-width="120px" label-suffix="："
                 :v-loading="vm.dialogVisible"
                 size="small">
          <el-form-item label="满意度">
            <el-radio-group v-model="vm.evaluateForm.satisfaction" v-if="!vm.evaluateForm.uuId">
              <el-radio :label="2">好评</el-radio>
              <el-radio :label="1">中评</el-radio>
              <el-radio :label="0">差评</el-radio>
            </el-radio-group>
            <label v-else>{{({"0": '差评',"1": '中评',"2": '好评'}[vm.evaluateForm['satisfaction']])}}</label>
          </el-form-item>
          <el-form-item label="处理速度">
            <el-rate :disabled="!!vm.evaluateForm.uuId"
              v-model="vm.evaluateForm.processing"
              show-text>
            </el-rate>
          </el-form-item>
          <el-form-item label="服务态度">
            <el-rate :disabled="!!vm.evaluateForm.uuId"
              v-model="vm.evaluateForm.serve"
              show-text>
            </el-rate>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              style="width:300px;"
              :disabled="!!vm.evaluateForm.uuId"
              type="textarea"
              :rows="2"
              placeholder="请输入备注说明"
              v-model="vm.evaluateForm.idea">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="vm.dialogVisible = false" size="small">取消</el-button>
          <el-button v-if="!vm.evaluateForm.uuId" type="primary" size="small" @click="submitEvaluate">确定</el-button>
        </span>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
