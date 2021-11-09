<template>
    <el-row>
      <el-col :span="24" style="padding-left: 6px; padding-right: 6px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;"><i class="el-icon-magic-stick"></i> 流程干预</span>
            <div style="float: right;">
              <el-button @click="getWorkFlowNodes" size="mini">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
              <el-button @click="submitIntervention" :loading="vm.nodesDataLoading" type="primary" size="mini">
                <i class="el-icon-check"></i>
                确定提交
              </el-button>
            </div>

          </div>
          <el-form ref="interventionForm" :model="interventionForm"
                   class="intervention-form"
                   style="width: 500px; margin: 0 auto;"
                   label-suffix="："
                   v-loading="vm.nodesDataLoading"
                   size="small" label-width="140px">
            <el-form-item label="流转节点至">
              <el-select v-model="interventionForm.nodeId" placeholder="请选择">
                <el-option
                  v-for="item in vm.nodes"
                  :key="item.nodeId"
                  :label="item.nodeName"
                  :value="item.nodeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会签关系">
              <el-radio-group v-model="interventionForm.countersignMode">
                <el-radio :label="1">会签</el-radio>
                <el-radio :label="0">非会签</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="流转至节点操作者">
              <div class="tag-group">
                <el-tag size="small" v-for="(item,i) in vm.users" :key="i" @close="handleClose(i)" closable>
                  {{item.userName}}
                </el-tag>
              </div>
              <el-button @click="opens = true" type="primary" icon="el-icon-plus" circle size="mini" plain></el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="padding-left: 6px; padding-right: 6px; margin-top: 10px;">
        <WorkOrderDetail v-if="scope=='OPS_CREATE'" :uuid="uuId" :completed="init" style="margin-left: 0; margin-right: 0;"></WorkOrderDetail>
        <power-switch-detail-single v-if="scope=='POWER_SWITCH'" :uuid="uuId"></power-switch-detail-single>
        <DepToPerson v-bind:fatherData="tableData" v-bind:opens="opens" v-on:dialogOpen="getOpens"
                     v-on:personParams="getPersonParams"></DepToPerson>
      </el-col>

    </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
