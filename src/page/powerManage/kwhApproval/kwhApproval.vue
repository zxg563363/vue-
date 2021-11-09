<template>
	<div class="kwhApproval">
		<Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
		<div class="list" v-if="isInit">
			<div class="title">

			</div>
			<div class="content">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="id"
              label="设备规格">
            </el-table-column>
            <el-table-column
              prop="id"
              label="设备线路ID">
            </el-table-column>
            <el-table-column
              prop="id"
              label="用电状态">
            </el-table-column>
            <el-table-column
              prop="id"
              label="所在空间">
            </el-table-column>
            <el-table-column
              prop="id"
              label="线路位置">
            </el-table-column>
            <el-table-column
              prop="id"
              label="原因">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <span v-if="btn">
                  <el-button type="text" size="small" @click="handlePass(scope.row)" style="color:#13CE66;margin-right: 10px;">通过</el-button>
                  <el-button type="text" size="small" @click="handleRefuse(scope.row)" style="color:red;margin-right: 10px;">拒绝</el-button>
                </span>
                <el-button type="text" size="small" v-if="pass">已通过</el-button>
                <el-button type="text" size="small" v-if="refuse">已拒绝</el-button>
                <el-button type="text" size="small" @click="handleView(scope.row)">查看审批进展</el-button>
              </template>
            </el-table-column>
          </el-table>
			</div>
		</div>
    <div class="modal" v-else>
      <div class="title">
        <div></div>
        <div>审批流程进展</div>
      </div>
      <div class="content">
        {{data}}
      </div>
      <div class="footer">
        <el-button @click="handleHide">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script type="javascript" src="./kwhApproval.js"></script>
<style scoped lang="less" src="./kwhApproval.less"></style>
