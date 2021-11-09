<template>
  <el-row :gutter="12" id="power-real-time">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="6" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">采集终端信息</h5>
          <div class="widget-toolbar">
            <el-button  size="mini" @click="getTreeData">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="power-real-time-tree"
               v-loading="vm.treeLoading"
               fullscreen="false">
            <el-input
              size="small"
              placeholder="输入关键字进行过滤"
              v-model="vm.filterText">
            </el-input>
            <el-tree
              ref="tree"
              :filter-node-method="filterNode"
              :data="vm.treeData"
              node-key="id"
              default-expand-all
              :props="{label: 'name'}"
              :expand-on-click-node="false"
              @node-click="handleNodeClick">
            </el-tree>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18" style="padding-top: 12px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold">【{{vm.currentNode.name}}】&nbsp;
            <small v-if="false" class="text-warning">
              <i class="el-icon-bottom"></i>
              <i class="el-icon-bottom"></i>
              <i class="el-icon-bottom"></i>
              为考虑性能，查询的日期区间最大支持2小时及以内！
            </small>
          </span>
        </div>
        <el-form :inline="true" :model="params" size="mini" label-suffix="："
                 label-width="120px" class="demo-form-inline">
          <el-form-item label="日期类型">
            <el-radio-group @change="dateType" v-model="params.dateType" size="mini">
              <el-radio label="interval">区间</el-radio>
              <el-radio label="time_share">分时</el-radio>
              <el-radio label="customize">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="日期选择">
            <el-select v-if="params.dateType=='interval'" v-model="params.dateTypeValue" clearable  size="mini">
              <el-option v-for="(item,index) in conditionMap.interval.options" :key="index" :label="item.value" :value="item.label"></el-option>
            </el-select>
            <el-date-picker v-if="params.dateType=='time_share'"
              v-model="params.dateTypeDateValue"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <el-select v-if="params.dateType=='time_share'" v-model="params.dateTypeValue"  size="mini">
              <el-option label="00:00 ~ 23:59:59" :value="0"></el-option>
              <el-option v-for="(item,index) in conditionMap.interval.options" :key="index" :label="item.interval" :value="item.label"></el-option>
            </el-select>

            <el-date-picker v-if="params.dateType=='customize'"
                            v-model="params.times"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="params" size="mini" label-suffix="："
                 label-width="120px"
                 v-loading="vm.realDataLoading" class="demo-form-inline">
          <el-form-item label="参数项">
            <el-select v-model="params.key" placeholder="请选择">
              <el-option
                v-for="item in vm.models"
                :key="item.paramsKey"
                :label="item.paramsName"
                :value="item.paramsKey">
                <span style="float: left; font-size: 13px;">{{ item.paramsName }}</span>
                <span style="float: right; color: #8492a6; font-size: 12px">{{ item.unitName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="queryHistoryData" type="primary">
              <i class="el-icon-search"></i>
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <LargeDataAreaCharts v-loading="vm.historyDataLoading" :data="vm.historyData" :height="500"></LargeDataAreaCharts>
      </el-card>
    </el-col>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
