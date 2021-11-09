<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-form :inline="true" :model="vm.queryObj" size="small" class="demo-form-inline">
            <el-form-item label="条件筛选：">
              <el-input v-model="vm.queryObj.equipmentCode"  placeholder="设备编码"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="vm.queryObj.equipmentName"  placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="vm.queryObj.checkUserName"  placeholder="填写人"></el-input>
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
        v-loading="tableDataLoading"
        stripe
        max-height="537"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          fixed
          label="设备编码"
          :show-overflow-tooltip="true"
          width="240">
          <template slot-scope="scope">
            <el-link :underline="false" title="点击查看" type="primary" @click="showTaskFillInModal(scope.row)">{{scope.row.equipmentCode}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="设备名称"
          :show-overflow-tooltip="true"
          width="280">
          <template slot-scope="scope">
            {{scope.row.equipmentName}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="200"
          prop="equipmentTypeName"
          :show-overflow-tooltip="true"
          label="设备类型">
        </el-table-column>
        <el-table-column
          min-width="160"
          prop="operateTime"
          label="填报时间">
        </el-table-column>
        <el-table-column
          min-width="140"
          prop="checkUserName"
          label="填报人">
        </el-table-column>
        <el-table-column
          width="160"
          label="任务状态">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.status == 0" size="small">未执行</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success" size="small">已执行</el-tag>
            <el-tag v-else type="danger" size="small">异常</el-tag>
            <el-tag v-if="isTaskTimeout(scope.row.operateTime,scope.row.endTime)" type="danger" size="small">超时</el-tag>

          </template>
        </el-table-column>
        <el-table-column
          width="160"
          prop="startTime"
          label="开始时间">
        </el-table-column>
        <el-table-column
          width="160"
          prop="endTime"
          label="结束时间">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="任务类型">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.jobType == 'auto'" type="primary" size="small">计划任务</el-tag>
            <el-tag v-else type="success" size="small">临时任务</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          min-width="140"
          :show-overflow-tooltip="true"
          prop="teamName"
          label="所属班组">
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
          layout="total, prev, pager, next, jumper, sizes"
          :total="pageData.recordCount">
        </el-pagination>
      </el-col>
    </el-row>
    </el-col>

    <el-dialog
      :title="'【'+vm.task.equipmentName+'】'"
      :visible.sync="vm.dialogVisible"
      width="550px"
      :show-close="false">
      <fm-generate-form :edit="true" :data="vm.taskForm"
                        :value="vm.taskFormData"
                        v-if="vm.taskForm.list.length>0" style="width: 500px; margin: 0 auto; max-height: 400px;overflow-y: auto;">
      </fm-generate-form>
      <div style="width: 200px; margin: 0 auto; text-align: center;" v-if="vm.taskForm.list.length==0">
        <el-empty :image-size="200"></el-empty>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vm.dialogVisible = false" type="danger" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
