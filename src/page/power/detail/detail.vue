<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
      <PowerSwitchDetail :is-show-back="true"></PowerSwitchDetail>
    </el-col>
  </el-row>

</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
