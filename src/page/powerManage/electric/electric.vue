<template>
  <div class="electric">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content">
       <el-aside width="300px" class="left_content">
         <div class="treeTop">
           <div class="treeTitle">设备列表</div>
         </div>
         <el-tree ref="deviceTreeRef" :data="equitData" :props="equitProps" :default-expand-all="true" @node-click="getEquitId" :expand-on-click-node="false" highlight-current class="leftTrees">
           <!-- :current-node-key="id" -->
         </el-tree>
       </el-aside>
      <div class="right_content">
        <div class="title">
          用电实时监测
        </div>
        <div class="nowEcharts" id="nowEcharts" style="width: 1200px;height: 500px;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less" src="./electric.less"></style>
<script src="./electric.js"></script>
