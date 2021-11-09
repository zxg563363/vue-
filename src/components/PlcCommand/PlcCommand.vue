<template>
  <el-dialog
    title="添加命令"
    :visible.sync="open"
    width="1160px"
    :fullscreen="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="opened">
    <el-row :gutter="12" v-loading="tableDataLoading">
      <el-col  v-for="(item,index) in tableData" :key="index" :span="8">
        <el-card class="box-card" :shadow="item.checked ? '' : 'hover'">
          <div slot="header" class="clearfix">
            <span class="f-s-13" style="font-weight: bold;">【{{item.commandCode}}】</span>
            <div style="float: right">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </div>
          </div>
          <el-form label-suffix="：" size="mini" :model="item" label-width="90px" class="command-form">
            <el-form-item label="名称">
              <span class="eq-value">{{item.commandName}}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span class="eq-value">{{item.description}}</span>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-tag v-if="item.validity==1" effect="dark" type="primary" size="small">启用</el-tag>
              <el-tag v-else type="danger" effect="dark" size="small">禁用</el-tag>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <div style="float: left;">
        <el-button size="small" type="primary" plain @click="getData"><i class="el-icon-refresh"></i> 刷新</el-button>
      </div>
      <el-button size="small" @click="cancelAddEquipment">取消</el-button>
      <el-button type="primary" size="small" @click="confirmAddEquipment()">确定({{totalNum}})</el-button>
    </span>
  </el-dialog>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
