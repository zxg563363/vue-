<template>
  <div class="sparePart">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content">
      <div class="main" v-if="isShow">
        <div class="title">备件仓库信息</div>
        <div>
          <div v-for="(item,i) in data" :key="i" class="single" @mouseenter="id=i" @mouseleave="id=9999">
            {{item.warehouseName}}
            <i class="el-icon-delete" @click="delet(item.id)" style="color: red;" :style="id==i?'':'display:none'"></i>
            <i class="el-icon-edit" @click="change(item)" style="color: orange;" :style="id==i?'':'display:none'"></i>
          </div>
          <div class="addModel" @click="add">
            <div>+</div>
            <div>新增备件仓库</div>
          </div>
        </div>
      </div>
      <div class="modal" v-else>
        <div class="modal-header">
          <div></div>
          <div>{{title}}</div>
          <div>
            <el-button type="primary" @click="hide">取消</el-button>
            <el-button type="primary" @click="submitForm('addData')" v-if="isAdd">提交保存</el-button>
            <el-button type="primary" @click="submitForm('addData')" v-else>更新</el-button>
          </div>
        </div>
        <div class="modal-main">
          <div>
            <div class="header"></div>
            <div class="content">
              <el-form :model="addData" :rules="datarules" ref="addData" label-width="150px" class="demo-ruleForm">
                <el-form-item label="仓库名称" prop="warehouseName">
                  <el-input v-model="addData.warehouseName" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="address">
                  <el-input v-model="addData.address" placeholder="请输入仓库地址"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="principalName">
                  <el-input v-model="addData.principalName" placeholder="请选择负责人"readonly @click.native="choose()"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="addData.description" placeholder="请输入备注" type="textarea"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <DepToPerson v-bind:fatherData="tableData" v-bind:opens="opens" v-on:dialogOpen="getOpens"
          v-on:personParams="getPersonParams"></DepToPerson>
      </div>
    </div>
  </div>
</template>

<script type="javascript" src="./sparePart.js"></script>
<style scoped lang="less" src="./sparePart.less"></style>
