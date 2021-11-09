<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-descriptions v-loading="vm.dataLoading" class="margin-top" :colon="true" :column="1" size="small" border>
            <el-descriptions-item>
              <template slot="label">
                <label class="f-s-13" style="font-weight: bold;">周期类型：</label>
              </template>
              <el-radio-group @change="dateCommand" v-model="params.dateType" size="mini">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="diy">自定义</el-radio-button>
              </el-radio-group>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <label class="f-s-13" style="font-weight: bold;">周期选择：</label>
              </template>
              <el-form :inline="true" :model="params" class="demo-form-inline">
                <el-form-item label="" style="width: 350px;">

                  <el-button-group v-if="params.dateType!='diy'" size="mini">
                    <el-button size="mini"  @click="dateCommand(params.dateType)">
                      {{queryMap[params.dateType]['value']}}
                    </el-button>
                    <el-button @click="prevDate(params.dateType)" size="mini" icon="el-icon-arrow-left"></el-button>
                    <el-button @click="nextDate(params.dateType)"  size="mini" ><i class="el-icon-arrow-right el-icon--right"></i></el-button>
                  </el-button-group>
                  <label class="f-s-13" v-if="params.dateType=='week'" style="font-weight: bold;">{{params.start}} ~ {{params.end}}</label>
                  <label class="f-s-13" v-if="params.dateType=='month'" style="font-weight: bold;">{{moment(params.start).format('YYYY-MM')}}</label>
                  <label class="f-s-13" v-if="params.dateType=='day'" style="font-weight: bold;">{{params.start}}</label>

                  <!--自定义-->
                  <el-date-picker v-if="params.dateType=='diy'" size="mini"
                    v-model="dateRange"
                    type="daterange"
                    align="left"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="设备选择：" style="font-weight: bold;font-size: 13px;">
                  <el-select size="small" @change="searchData" v-model="params.equipId" filterable clearable  placeholder="请选择">
                    <el-option
                      v-for="item in vm.equipments"
                      :key="item.id"
                      :label="item.equipName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-button @click="searchData" size="small" type="primary">
                    <i class="el-icon-search"></i>
                    搜索
                  </el-button>
                  <el-button @click="resetData" size="small">
                    重置
                  </el-button>
                </el-form-item>
                <div style="float: right;">
                  <el-button @click="exportExcel" size="small" type="primary"><i class="el-icon-upload2"></i> Excel导出({{tableData.length}})</el-button>
                </div>
              </el-form>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <el-table
        v-loading="tableDataLoading"
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          fixed
          prop="id"
          label="停电编号"
          width="155">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row.id)" type="text" size="small">{{scope.row.id}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="id1"
          label="送电编号"
          width="155">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row.id1)" type="text" size="small">{{scope.row.id1}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="equipName"
          min-width="160"
          show-overflow-tooltip
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="equipCode"
          min-width="160"
          show-overflow-tooltip
          label="设备编码">
        </el-table-column>
        <el-table-column
          prop="containerNo"
          label="配电柜编码"
          width="90">
        </el-table-column>

        <el-table-column
          prop="reason"
          min-width="180"
          width="*"
          show-overflow-tooltip
          label="停电原因">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          min-width="120"
          label="通知停电人">
        </el-table-column>
        <el-table-column
          prop="specifyTime"
          min-width="150"
          label="停电时间">
        </el-table-column>
        <el-table-column
          prop="receiverName"
          min-width="120"
          label="停电人">
        </el-table-column>
        <el-table-column
          prop="createUserName"
          min-width="120"
          label="通知送电人">
        </el-table-column>
        <el-table-column
          prop="specifyTime1"
          min-width="150"
          label="送电时间">
        </el-table-column>
        <el-table-column
          prop="receiverName1"
          min-width="120"
          label="送电人">
        </el-table-column>
        <el-table-column
          prop="reason1"
          min-width="120"
          label="备注">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
