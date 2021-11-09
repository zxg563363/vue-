<template>
  <div class="workorder">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content">
      <div class="title">
        <el-row>
           <el-col :span="4" v-for="(item,i) in statusData" :key='i' :class="statusId==item.id?'active':''"><div @click='changeStatu(item)' >{{item.value}}</div></el-col>
        </el-row>
        <div class="ime">
          <el-button
            size="small"
            v-for="(item,i) in imeData" :key="i" :class="imeId==item.id?'active':''" @click='changeime(item)'>{{item.value}}</el-button>
          <span style="float: right;">
            <el-input type='text' v-model="searchData" size="small" placeholder="请输入工单编号"></el-input>
            <el-button @click="search" type="primary" size="small">搜索</el-button>
            <el-button @click="reset" size="small">重置</el-button>
          </span>
        </div>
        <div class="addwork">
          <el-button @click="routes" size="small" type="primary">
            <i class="el-icon-plus"></i>
            新建工单
          </el-button>
        </div>
      </div>
       <el-table
         v-loading="dataLoading"
         stripe max-height="685"
          :data="workData"
          style="width: 100%">
          <el-table-column
            fixed
            prop="uuId"
            label="工单编号"
            width="200">
             <template slot-scope="scope">
                <el-link title="点击查看" :underline="false" type="primary" size="small" @click="handleClick(scope.row)">{{scope.row.uuId}}</el-link>
              </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="title"
            label="工单名称"
            show-overflow-tooltip
            width="200">
          </el-table-column>
         <el-table-column
           prop="description"
           width="300"
           show-overflow-tooltip
           label="情况说明">
         </el-table-column>
          <el-table-column
            prop="catalogName"
            min-width="160"
            show-overflow-tooltip
            label="工单类型">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="状态">
            <template slot-scope="scope">
              <order-status :status="scope.row.status"></order-status>
            </template>
          </el-table-column>
          <el-table-column
            prop="urgency"
            label="优先级">
          </el-table-column>
          <el-table-column
            prop="source"
            label="来源">
          </el-table-column>
          <el-table-column
            prop="zoneName"
            min-width="140"
            show-overflow-tooltip
            label="空间名称">
          </el-table-column>
          <el-table-column
            prop="contactName"
            label="联系人">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="创建时间"
            width="140">
          </el-table-column>
        </el-table>
        <div class="paging">
          <el-pagination @current-change="handleCurrent"
                         @size-change="handleSizeChange" background layout="total, prev, pager, next, sizes" :total="totalData"
                         :page-size.sync="pageSize" :current-page.sync="page">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script type="javascript" src="./workorder.js"></script>
<style scoped lang="less" src="./workorder.less"></style>
