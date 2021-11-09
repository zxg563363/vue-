<template>
  <el-steps :active="active" finish-status="success">
    <el-step title="待分配"></el-step>
    <el-step title="待处理"></el-step>
    <el-step :title="status!='DELAY' ? '处理中': '处理中（延期中）'"></el-step>
    <el-step :title="status!='CANCEL' ? '已完成' : '已取消'"></el-step>
  </el-steps>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
