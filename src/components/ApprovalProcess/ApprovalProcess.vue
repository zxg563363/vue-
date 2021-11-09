<template>
  <el-dialog :title="title ? title : '审批'" :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="600px" :show-close="false">
    <el-form :model="approval"  :rules="approvalRules" ref="approvalForm"
             v-loading="dataLoading"
             label-suffix="：" style="width: 550px;"
             label-width="140px"  size="small">
      <el-form-item label="审核" prop="agree">
        <el-radio-group v-model="approval.agree">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="remark">
        <el-input v-model="approval.remark" type="textarea" :autosize="{minRows: 2, maxRows: 8}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false,approval={agree: true,remark: ''}" size="small">取消</el-button>
      <el-button type="primary" @click="processApproval" size="small" :v-loading="dataLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
