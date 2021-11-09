<template>
  <div class="pageIndex">
    <el-button>首页</el-button>
    <el-row :gutter="24" style="margin-top: 14px;">
      <el-col :span="9">
        <div class="today">
          <div class="title">今日工单简报</div>
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <div>500</div>
              <div>工单总数</div>
            </el-col>
            <el-col :span="6">
              <div>250</div>
              <div>已完成</div>
            </el-col>
            <el-col :span="6">
              <div>250</div>
              <div>未处理</div>
            </el-col>
            <el-col :span="6">
              <div>10</div>
              <div>已超时</div>
            </el-col>
          </el-row>
          <div class="active">完成率76%</div>
        </div>
      </el-col>
      <el-col :span="5">
        <div>
          <div class="title">巡检任务</div>
          <el-row  type="flex" align="middle" style="height: 150px;">
            <el-col :span="24">
              <div>88 / 32</div>
              <div>已完成 / 待处理</div>
            </el-col>
          </el-row>
          <div class="footer">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="active">及时率76%</div>
              </el-col>
              <el-col :span="12">
                <div class="active">异常率76%</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div>
          <div class="title">点检任务</div>
          <el-row  type="flex" align="middle" style="height: 150px;">
            <el-col :span="24">
              <div>88 / 32</div>
              <div>已完成 / 待处理</div>
            </el-col>
          </el-row>
          <div class="footer">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="active">及时率76%</div>
              </el-col>
              <el-col :span="12">
                <div class="active">异常率76%</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div>
          <div class="title">保养任务</div>
          <el-row  type="flex" align="middle" style="height: 150px;">
            <el-col :span="24">
              <div>88 / 32</div>
              <div>已完成 / 待处理</div>
            </el-col>
          </el-row>
          <div class="footer">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="active">及时率76%</div>
              </el-col>
              <el-col :span="12">
                <div class="active">异常率76%</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="14">
        <div>
          <div class="header">审核列表</div>
          <el-table
            :data="auditTable"
            style="width: 100%"
           >
            <el-table-column
              prop="id"
              label="工单编号"
             >
            </el-table-column>
            <el-table-column
              prop="id"
              label="审批名称"
             >
            </el-table-column>
            <el-table-column
              prop="id"
              label="当前节点">
            </el-table-column>
            <el-table-column
              prop="id"
              label="审批人">
            </el-table-column>
            <el-table-column
              prop="id"
              label="审批发起时间"
              min-width="120">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <div class="header">任务通知</div>
          <div class="single" v-for="(item,i) in taskList" :key='i'>
            <div><img src="../../static/img/logo.png"></div>
            <div>
              <div class="info">
                <span>任务提交通知</span>
                <span>2021-06-17  14:00:00</span>
              </div>
              <div>【张三】提交了巡检任务反馈，请查收！</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <div style="height: 400px;">
          <div class="title">设备类型</div>
          <div id="equitType" style="height: 340px;width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="height: 400px;">
          <div class="title">备件类型</div>
          <div id="spareType" style="height: 360px;width: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="height: 400px;">
          <div class="header">备件低库存预警</div>
          <el-table
            :data="spareTable"
            style="width: 100%"
           >
            <el-table-column
              prop="id"
              label="备件名称"
             >
            </el-table-column>
            <el-table-column
              prop="id"
              label="类型"
             >
            </el-table-column>
            <el-table-column
              prop="id"
              label="库存">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="height: 400px;">
          <div class="title">今日任务执行情况</div>
          <div id="taskMess" style="width: 100%;height:340px ;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="javascript" src="./pageIndex.js"></script>
<style scoped lang="less" src="./pageIndex.less"></style>
