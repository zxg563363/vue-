<template>
  <div style="height: auto; width: 100%; position: relative;">
    <el-timeline v-loading="dataLoading">
      <el-timeline-item v-for="(item, index) in list" :key="index" :timestamp="item.createTime" placement="top">
        <el-card v-if="item.messageType=='新建'||item.messageType=='开始'||item.messageType=='完成'||item.messageType=='取消'||item.messageType=='修改'">
          <p><span>{{item.userName}}</span>{{item.messageType}}了工单 #{{item.repairOrderId}}</p>
          <p v-if="item.messageType=='取消'" style="margin-left: 10px;">取消内容为:<span style="color: red;">{{item.contents.updateContent}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='启动'">
          <p><span>{{item.userName}}</span>发起了工单 #{{item.repairOrderId}} 审批</p>
          <p style="margin-left: 10px;">下个审批节点为【{{item.contents.nodeName}}】处理人：<span>{{item.contents.executorName}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='分配'">
          <p><span>{{item.userName}}</span>把工单 #{{item.repairOrderId}} {{item.messageType}}给<span>{{item.contents.executorName}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='审批'">
          <p><span>{{item.userName}}</span>{{item.messageType}}了工单 #{{item.repairOrderId}}</p>
          <p style="margin-left: 10px;">审核结果:<span>【{{item.contents.agree ? '同意' : '拒绝'}}】</span></p>
          <p style="margin-left: 10px;">审核意见：<span style="color: red;">{{item.contents.updateContent}}</span></p>
          <p v-if="item.contents['next']" style="margin-left: 10px;">下个审批节点为【{{item.contents.nodeName}}】处理人：<span>{{item.contents.executorName}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='催单'">
          <p><span>{{item.userName}}</span>催办了工单 #{{item.repairOrderId}}</p>
          <p style="margin-left: 10px;">催单内容为:<span style="color: red;">{{item.contents.updateContent}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='延期'">
          <p><span>{{item.userName}}</span>延期了工单 #{{item.repairOrderId}}</p>
          <p style="margin-left: 10px;">延期内容为:<span style="color: red;">{{item.contents.updateContent}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='添加'">
          <p><span>{{item.userName}}</span>添加了备注 #{{item.repairOrderId}}</p>
          <p style="margin-left: 10px;">备注内容为:<span style="color: red;">{{item.contents.updateContent}}</span></p>
        </el-card>
        <el-card v-if="item.messageType=='协作'">
          <p><span>{{item.userName}}</span>将工单 #{{item.repairOrderId}}{{item.contents.updateType=='del'?'移除':'添加'}}了协作人员<span>{{item.contents.updateContent}}</span></p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div v-if="pageData.length>1" class="editor-wrapper-expand" :class="{'editor-wrapper-expand-open':isExpand}">
      <div @click="expandContent" class="editor-wrapper-expand-button" :class="{'editor-wrapper-expand-button-up':isExpand}">
        <span></span>
        {{isExpand ? '收起' : '展开'}}信息
      </div>
    </div>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
