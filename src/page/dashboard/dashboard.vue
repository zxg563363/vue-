<template>
  <el-row>
    <el-col :span="24">
      <el-row :gutter="12">
        <el-col :span="10">
          <el-card class="box-card"  v-loading="vm.repairCountLoading">
            <div slot="header" class="clearfix" style="height: 32px; line-height: 32px;">
              <span style="font-weight: bold;"><i class="el-icon-odometer f-s-16"></i> 工单数据概览</span>
              <el-form :inline="true" size="mini" style="float: right;" class="dashboard-form">
                <el-form-item label="">
                  <el-date-picker
                    v-model="vm.repairDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="" style="height: 32px; line-height: 32px;">
                  <el-button @click="getRepairCount" style="float: right;" type="primary" plain>
                    <i class="el-icon-search"></i>
                    查询
                  </el-button>
                </el-form-item>
              </el-form>

            </div>
            <el-row :gutter="12">
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-edit text-primary f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.total - vm.repairCount.undo - vm.repairCount.ok}}</h4>
                      <h6>进行中的</h6>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-send-o text-warning f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.undo}}</h4>
                      <h6>未开始的</h6>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 12px;">
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-file-text-o text-purple f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.total}}</h4>
                      <h6>共创建的</h6>
                    </div>
                  </div>
                </div>
              </el-col>

              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-check text-success f-s-24"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.ok}}</h4>
                      <h6>完成的</h6>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 12px;">
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-percent text-muted f-s-24"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.undo_rate}}%</h4>
                      <h6>未开始的（%）</h6>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-percent text-muted f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.ok_rate}}%</h4>
                      <h6>总完成率（%）</h6>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 12px;">
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-percent text-muted f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.ok_js_rate}}%</h4>
                      <h6>完成及时率（%）</h6>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="card">
                  <div class="media">
                    <div class="media-left meida media-middle">
                      <span><i class="fa fa-flash text-muted f-s-22"></i></span>
                    </div>
                    <div class="media-body media-text-right">
                      <h4 class="f-s-26">{{vm.repairCount.doing_rate}}%</h4>
                      <h6>响应及时率（%）</h6>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card"  v-loading="vm.repairTrendLoading">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;"><i class="el-icon-data-line f-s-16"></i> 工单趋势</span>
              <el-form :inline="true" size="mini" style="float: right;" class="dashboard-form">
                <el-form-item label="">
                  <el-date-picker
                    v-model="vm.repairTrendDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="" style="height: 32px; line-height: 32px;">
                  <el-button @click="getRepairTrend" style="float: right;" type="primary" plain>
                    <i class="el-icon-search"></i>
                    查询
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <TimesharingLineCharts :data="vm.repairTrend" :height="370"></TimesharingLineCharts>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 10px;">
        <el-col :span="11">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;"><i class="el-icon-document f-s-16"></i> {{vm.currentBacklog.label}}({{vm.backLogTableData.length}})</span>
              <el-form :inline="true" size="mini" style="float: right;" class="dashboard-form">
                <el-form-item label="">
                  <el-dropdown split-button @command="handleCommand">
                    {{vm.currentBacklog.label}}
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="todo">待我处理</el-dropdown-item>
                      <el-dropdown-item command="approved">发起审批</el-dropdown-item>
                      <el-dropdown-item command="delay">延期审批</el-dropdown-item>
                      <el-dropdown-item command="cooperation">我协作的</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-form>
            </div>

            <el-table
              v-show="vm.currentBacklog.key != 'delay'"
              stripe
              height="303"
              v-loading="vm.backlogLoading"
              :data="vm.backLogTableData"
              class="order-table"
              style="width: 100%;">
              <el-table-column
                fixed="left"
                align="center"
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                fixed
                prop="uuId"
                label="工单编号"
                min-width="150">
                <template slot-scope="scope">
                  <el-button title="点击查看" @click="viewOrder(scope.row.uuId)" type="text">{{scope.row.uuId}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                min-width="200"
                show-overflow-tooltip
                label="情况说明">
              </el-table-column>
              <el-table-column
                prop="urgency"
                label="优先级">
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                label="创建时间"
                width="140">
              </el-table-column>
            </el-table>

            <el-table
              v-show="vm.currentBacklog.key === 'delay'"
              stripe
              height="303"
              v-loading="vm.backlogLoading"
              :data="vm.backLogTableData"
              class="order-table"
              style="width: 100%;">
              <el-table-column
                fixed="left"
                align="center"
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                fixed
                prop="repairOrderId"
                label="工单编号"
                min-width="160">
                <template slot-scope="scope">
                  <el-button title="点击查看" @click="viewOrder(scope.row.repairOrderId)" type="text">{{scope.row.repairOrderId}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                min-width="200"
                prop="cause"
                label="申请事由">
              </el-table-column>
              <el-table-column
                min-width="120"
                prop="applyUserName"
                label="申请人">
              </el-table-column>
              <el-table-column
                min-width="80"
                align="center"
                prop="applyTime"
                label="申请时间">
              </el-table-column>
              <el-table-column
                min-width="80"
                align="center"
                prop="delayTime"
                label="延期时间">
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card"  v-loading="vm.catalogCountLoading">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;"><i class="el-icon-pie-chart f-s-16"></i> 服务目录统计</span>
              <el-form :inline="true" size="mini" style="float: right;" class="dashboard-form">
                <el-form-item label="">
                  <el-date-picker
                    v-model="vm.repairCatalogDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="" style="height: 32px; line-height: 32px;">
                  <el-button @click="getCatalogCount" style="float: right;" type="primary" plain>
                    查询
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <PieCharts :data="vm.repairCatalog"></PieCharts>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card"  v-loading="vm.spareUseCountLoading">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;"><i class="el-icon-s-order f-s-16"></i> 备件消耗统计</span>
              <el-button @click="getSpareUseCount" style="float: right; padding: 3px 3px" type="text" size="small">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
            <el-table
              :data="vm.spareUseCount"
              height="309"
              stripe
              border
              style="width: 100%">
              <el-table-column
                prop="spareName"
                label="备件名称"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="total"
                align="center"
                label="数量">
                <template slot-scope="scope">
                  {{scope.row.total}}{{scope.row.spareUnitName}} - {{scope.row.spareModel}}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-card class="box-card" v-loading="vm.timeSharingLoading">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;"><i class="el-icon-data-line f-s-16"></i> 任务分时统计</span>
              <el-button @click="getTimeSharingTask" style="float: right; padding: 3px 0" type="text" size="small">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
            <TimesharingLineCharts :data="vm.timeSharingChartsData" :height="309"></TimesharingLineCharts>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
