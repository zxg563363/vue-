<template>
  <div class="kwhList">
  	<Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="list">
        <div>
          <el-button @click="urgency">紧急一键停送电</el-button>
        </div>
        <div>
          <el-table
           ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 120%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="终端编号"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="设备/线路ID"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="所在空间"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="当前用电状态"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="历史预警次数"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="预警类型统计"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="预警通知次数"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="自动关停次数"
              min-width='120'>
            </el-table-column>
            <el-table-column
              prop="id"
              label="共计供电时间"
              min-width='120'>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="400">
              <template slot-scope="scope">
                <el-button type="text" size="small">远程停送电</el-button>
                <el-button type="text" size="small">用电参数设置</el-button>
                <el-button type="text" size="small">预警处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
  </div>
</template>
<script type="javascript" src="./kwhList.js"></script>
<style scoped lang="less" src="./kwhList.less"></style>
