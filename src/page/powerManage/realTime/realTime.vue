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
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">
            实时数据
            <span style="color: #1167fa;" v-if="vm.currentNode.name">【{{vm.currentNode.name}}】</span>
            <small>更新时间：{{vm.realData.time}}</small>
          </h5>
          <div class="widget-toolbar">
            <el-button size="mini">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <div style="padding: 12px 0 12px 0; min-height: 300px;" v-loading="vm.realDataLoading">
      <el-row>
        <el-col :span="24">
          <RealTimeData
            :external-type-code.sync="vm.currentNode.externalTypeCode"
            :collector-id.sync="vm.currentNode.id"></RealTimeData>
        </el-col>
      </el-row>
      <el-row v-if="false" :gutter="12">
        <el-col :span="5"
                v-for="(item,i) in vm.model" :key="i"
                class="clock-display">
            <div class="clock-field">
              <div class="numbers">
                <p class="type" style="color: #e7f0ff;">{{item.paramsName || '&nbsp;'}}</p>
              </div>
            </div>
            <div class="clock-field">
              <div class="numbers">
                <p class="minutes">{{vm.modelMap[item['paramsKey']] | numberRound}}</p>
                <!--<p class="placeholder">88.8</p>-->
                <p class="type">单位（{{item.unitName}}）</p>
              </div>
            </div>
        </el-col>
      </el-row>
        <el-row  v-if="false" style="background-color: rgba(20,24,53,1)">
          <el-col   :span="6" v-if="powerInstrument[item['paramsKey']]" v-for="(item,i) in vm.model" :key="i">
            <!--<h1>{{item['paramsKey']}}</h1>-->
            <!--<code>{{powerInstrument[item['paramsKey']]}}</code>-->
            <GaugeCharts :data="vm.modelMap[item['paramsKey']]" :params="powerInstrument[item['paramsKey']]"></GaugeCharts>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
