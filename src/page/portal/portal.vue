<template>
  <div class="portal">
    <div class="top">
      <div class="title">智能化选煤厂综合管理系统</div>
    </div>
    <el-row>
      <el-col :span="4">
        <div class="left-border"></div>
      </el-col>

      <el-col :span="16">

          <el-row :gutter="140" style="margin-top: 120px;">
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="6">
              <a href="/index.html#/index" class="portal-menu-item">
                <div class="portal-item">
                  <img :src="icons[0]"/>
                </div>
                <span class="item-name">设备管理中心</span>
              </a>

            </el-col>
            <el-col :span="6">
              <a href="/index.html#/power/realTime" class="portal-menu-item">
                <div class="portal-item">
                  <img :src="icons[1]"/>
                </div>
                <span class="item-name">配电管理中心</span>
              </a>
            </el-col>
            <el-col :span="6">
              <div>
                <div class="portal-item">
                  <img :src="icons[2]"/>
                </div>
                <span class="item-name">调度指挥中心</span>
              </div>
            </el-col>
            <el-col :span="3">&nbsp;</el-col>
          </el-row>

        <el-row :gutter="140" style="margin-top: 90px;">
          <el-col :span="6">
            <div>
              <div class="portal-item">
                <img :src="icons[4]"/>
              </div>
              <span class="item-name">生产管理中心</span>
            </div>

          </el-col>
          <el-col :span="6">
            <div>
              <div class="portal-item">
                <img :src="icons[5]"/>
              </div>
              <span class="item-name">安全管理中心</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <div class="portal-item">
                <img :src="icons[6]"/>
              </div>
              <span class="item-name">经营决策中心</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <div class="portal-item">
                <img :src="icons[7]"/>
              </div>
              <span class="item-name">基础系统平台</span>
            </div>
          </el-col>
        </el-row>

      </el-col>
      <el-col :span="4">
        <div class="right-border"></div>
      </el-col>
    </el-row>


  </div>

</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
