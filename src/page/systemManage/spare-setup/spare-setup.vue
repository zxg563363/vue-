<template>
  <div class="spareConfig">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row :gutter="12" style="margin-top: 12px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f-s-14 text-bold" style="line-height: 39px;">入库类型</span>
            <el-button type="text" style="float: right;">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f-s-14 text-bold" style="line-height: 39px;">出库类型</span>
            <el-button type="text" style="float: right;">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f-s-14 text-bold" style="line-height: 39px;">备件单位</span>
            <el-button type="text" style="float: right;">
              <i class="el-icon-refresh"></i>
            </el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
