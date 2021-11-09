<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" class="content">
      <div class="box box-solid">
        <div class="box-body" id="query-area" style="text-align: right;">
          <el-form :inline="true" :model="params" label-suffix="：" ref="queryForm" size="small">
            <el-form-item label="任务类型">
              <el-select v-model="params.taskType" clearable placeholder="请选择">
                <el-option
                  v-for="(item, key) in taskType"
                  :key="key"
                  :label="item.label"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建日期">
              <el-date-picker
                v-model="params.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">
                <i class="el-icon-search"></i>
                查询
              </el-button>
              <el-button @click="reset">重置</el-button>
              <!--<el-button type="text">展开 <i class="el-icon-arrow-down"></i></el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="content">
        <el-table
          stripe
          v-loading="dataLoading"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="任务名称"
            min-width="280">
            <template slot-scope="scope">
              <el-link :underline="false" title="点击查看" type="primary" @click="viewTask(scope.row)">{{scope.row.taskName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskType"
            label="任务类型"
            min-width="180">
            <template slot-scope="scope">
              <task-type :status="scope.row.taskType"></task-type>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="任务状态">
            <template slot-scope="scope" >
              <el-tooltip v-if="scope.row.taskStatus =='失败'"  :content="scope.row.errorInfo">
                <el-link :underline="false" type="danger">{{scope.row.taskStatus}} <i class="el-icon-warning-outline"></i></el-link>
              </el-tooltip>
              <el-link :underline="false" type="success" v-if="scope.row.taskStatus !='失败'">{{scope.row.taskStatus}}</el-link>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="errorInfo"-->
            <!--width="240"-->
            <!--label="任务消息">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--width="140"-->
            <!--prop="fileType"-->
            <!--label="文件类型">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--width="140"-->
            <!--prop="fileLength"-->
            <!--label="文件大小">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--width="140"-->
            <!--prop="taskRunTime"-->
            <!--label="任务耗时(ms)">-->
          <!--</el-table-column>-->
          <el-table-column
            width="160"
            prop="createUserName"
            label="创建用户">
          </el-table-column>
          <el-table-column
            width="180"
            prop="createTime"
            label="创建日期">
          </el-table-column>
          <el-table-column
            width="180"
            prop="expiryTime"
            label="失效日期">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="160">
            <template slot-scope="scope">
              <el-link v-if="scope.row.taskStatus == '失败'"
                       @click="retryTask(scope.row)"
                       size="small"
                       :underline="false"
                       icon="el-icon-refresh">
                重试
              </el-link>
              <el-link v-if="scope.row.taskStatus != '失败'" type="primary"
                       :underline="false"
                       :href="'/api-global/download/'+scope.row.id" target="download-iframe">
                <i class="el-icon-download"></i>
                下载
              </el-link>
              &nbsp;
              <el-popconfirm title="确定删除此任务吗？" @confirm="deleteTask(scope.row)">
                <el-link type="danger" :underline="false" slot="reference">
                  <i class="el-icon-delete"></i>
                  删除
                </el-link>
              </el-popconfirm>
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

      <!-- 弹出框 显示任务详细信息-->
      <el-dialog
        :title="'查看【'+taskDetail.taskName+'】'"
        :visible.sync="dialogVisible"
        width="600px">
        <el-row style="height: 300px; overflow-y: auto;">
          <el-col :span="16" :offset="4">
            <el-form ref="form" :model="taskDetail" :label-position="'right'" label-width="120px" size="small">
              <el-form-item label="任务名称：">
                <span>{{taskDetail.taskName}}</span>
              </el-form-item>
              <el-form-item label="任务类型：">
                <span>{{taskDetail.taskType}}</span>
              </el-form-item>
              <el-form-item label="任务状态：">
                <span>{{taskDetail.taskStatus}}</span>
              </el-form-item>
              <el-form-item label="执行结果：">
                <span>{{taskDetail.errorInfo}}</span>
              </el-form-item>
              <el-form-item label="文件类型：">
                <span>{{taskDetail.fileType}}</span>
              </el-form-item>
              <el-form-item label="文件大小：">
                <span>{{taskDetail.fileLength | renderSizeFormatter}}</span>
              </el-form-item>
              <el-form-item label="任务耗时(ms)：">
                <span>{{taskDetail.taskRunTime}}</span>
              </el-form-item>
              <el-form-item label="创建人：">
                <span>{{taskDetail.createUserName}}</span>
              </el-form-item>
              <el-form-item label="创建日期：">
                <span>{{taskDetail.createTime}}</span>
              </el-form-item>
              <el-form-item label="失效日期：">
                <span>{{taskDetail.expiryTime}}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
        </span>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
