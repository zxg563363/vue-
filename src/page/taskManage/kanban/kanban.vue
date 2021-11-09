<template>
  <el-row id="task-kanban">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;"><i class="el-icon-pie-chart f-s-16"></i> 任务类型统计</span>
          <el-form :inline="true" size="mini" style="float: right;" class="dashboard-form">
            <el-form-item label="">
              <el-date-picker
                v-model="vm.taskTypeDate"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" style="height: 32px; line-height: 32px;">
              <el-button @click="getTaskType" style="float: right;" type="primary" plain>
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-row :gutter="12">
          <el-col :span="8">
            <PieCharts :data="vm.taskTypeData" :height="240" v-loading="vm.taskTypeLoading"></PieCharts>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="12">
              <el-col v-for="(item, key) in vm.taskCards" :key="key" :span="8">
                <el-card class="box-card card-item" :id="item.id" v-loading="vm.taskTypeLoading">
                  <div slot="header" class="card-header">
                    <span>{{item.label}}任务</span>
                  </div>
                  <div class="task-num">
                    <h2>{{item.completed}} / {{item.untreated}}</h2>
                  </div>
                  <div class="task-num">
                    <h3>已处理 / 未处理</h3>
                  </div>
                  <div class="task-num">
                    <div class="text-tips">及时率 {{item.timeliness}}%</div>
                    <div class="text-tips">异常率 {{item.abnormal}}%</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
      </el-card>

    </el-col>
    <el-col :span="24">
      <el-card class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;"><i class="el-icon-data-line"></i> 任务分时统计</span>
          <el-button @click="getTimeSharingTask" style="float: right; padding: 3px 0" type="text" size="small">
            <i class="el-icon-refresh"></i>
            刷新
          </el-button>
        </div>
        <TimesharingLineCharts :data="vm.timeSharingChartsData" v-loading="vm.timeSharingLoading"></TimesharingLineCharts>
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-card class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;"><i class="el-icon-s-flag"></i> 班组任务分布情况</span>
          <div style="float: right; padding: 3px 0;">

            <el-radio-group @change="changeTaskTeamsItem" v-model="vm.taskTeamsCurrentTab" size="mini">
              <el-radio-button label="inspection">巡检</el-radio-button>
              <el-radio-button label="maintain">保养</el-radio-button>
              <el-radio-button label="spotcheck">点检</el-radio-button>
            </el-radio-group>
            &nbsp;&nbsp;
            <el-button @click="getTaskForTeams" type="text" size="small">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>

        </div>
        <BarLineCharts :data="vm.taskTeamsData" v-loading="vm.taskTeamsLoading"></BarLineCharts>
      </el-card>
    </el-col>

    <el-col :span="24">
      <el-card class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;"><i class="el-icon-box"></i> 设备任务分布情况</span>
          <div style="float: right; padding: 3px 0;">

            <el-button @click="getTaskForEquipment" type="text" size="small">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>

        </div>
        <BarLineCharts :data="vm.taskEquipmentData" v-loading="vm.taskEquipmentLoading"></BarLineCharts>
      </el-card>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
