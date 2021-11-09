<template>
  <el-row :gutter="12">
    <el-col :span="12">
      <el-card shadow="hover" class="box-card">
        <div slot="header" class="clearfix">
          <span class="f-s-14" style="font-weight: bold;">停送电信息</span>
        </div>
        <el-form :model="entityData"
                 v-loading="dataLoading"
                 label-suffix="：" class="basic-form"
                 label-width="150px" size="small">
          <el-form-item v-if="!isInIframe && entityData.pId"
                        :label="'关联'+(entityData.applyType==0 ? '送': '停')+'电编码'">
            <el-tooltip class="item" effect="dark" content="点击查看详细" placement="right">
              <el-link @click="viewDetail" type="primary" class="f-s-14" style="font-weight: bold;">
                {{ entityData.pId }}
              </el-link>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="(entityData.applyType==0 ? '停': '送')+'电编码'">
            <label style="font-weight: bold;" class="f-s-14">{{ entityData.id }}</label>
          </el-form-item>
          <el-form-item label="停送电时间">
            <label>{{ entityData.specifyTime }}</label>
          </el-form-item>
          <el-form-item label="设备名称">
            <label>{{ entityData.equipName }}</label>
          </el-form-item>
          <el-form-item label="设备编码">
            <label>{{ entityData.equipCode }}</label>
          </el-form-item>
          <el-form-item label="操作机柜号">
            <label>{{ entityData.containerNo }}</label>
          </el-form-item>
          <el-form-item v-if="entityData.applyType==0" label="停电原因">
            <label>{{ entityData.reason }}</label>
          </el-form-item>
          <el-form-item label="通知停(送)电人">
            <label>{{ entityData.createUserName }}</label>
          </el-form-item>
          <el-form-item label="停(送)电人">
            <label>{{ entityData.receiverName }}</label>
          </el-form-item>
          <el-form-item label="停(送)电协作人">
            <label>{{ entityData.togetherName }}</label>
          </el-form-item>
          <el-form-item v-if="entityData.modifyUserId!=entityData.createUserId" label="交接班人">
            <label>{{ entityData.modifyUserName }}</label>
          </el-form-item>
          <el-form-item label="状态">
            <el-tag v-if="entityData.status =='NEW'" type="warning" size="small" effect="dark">待审批
            </el-tag>
            <el-tag v-if="entityData.status =='DOING'" type="info" size="small" effect="dark">执行中
            </el-tag>
            <el-tag v-if="entityData.status =='OK'" type="success" size="small" effect="dark">已完成
            </el-tag>
            <el-tag v-if="entityData.status =='CANCEL'" size="small" effect="dark">已取消</el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <label>{{ entityData.createTime }}</label>
          </el-form-item>
          <el-form-item label="执行时间">
            <label>{{ entityData.executeTime }}</label>
          </el-form-item>
          <el-image
            class="apply-type"
            :src="icons[entityData.applyType]"
            fit="fill"></el-image>
        </el-form>

      </el-card>
    </el-col>
    <el-col :span="12">
      <ApprovalProcessNode :uuid="uuid" ref="approvalProcessNode"></ApprovalProcessNode>
    </el-col>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
