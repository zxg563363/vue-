<template>
  <el-dialog
    class="version-changelog"
    :visible.sync="dialogVisible"
    :lock-scroll="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="18vh"
    width="600px">
    <div slot="title" class="version-changelog-header">
      <el-image class="img" style="height: 196px;" :src="require('../../static/img/update-version.png')"
                fit="fill"></el-image>
    </div>
    <div class="version-changelog-body">
      <div class="changelog-title">v8.1.5：工作台支持添加卡片</div>
      <div class="changelog-content">
        <div class="changelog-item ng-star-inserted">1.  工作台支持卡片管理，新增审批、简报、公告三种卡片</div>
        <div class="changelog-item ng-star-inserted">2.【项目】优化上帝视角，设置了全局项目可见权限的成员，可进入项目进行查看 </div>
      </div>
      <el-button type="text">
        查看更多
        <i class="el-icon-right f-s-14"></i>
      </el-button>
    </div>
  </el-dialog>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
