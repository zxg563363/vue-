<template>
  <el-row>
    <el-col :span="24">
      <el-page-header @back="goBack">
        <template slot="content">
          <div class="el-page-header__content">{{this.vm.isUpdate ? '编辑' : '添加'}}表单</div>
          <div style="position: absolute;right: 0px; top: 0;">
            <el-button v-if="!this.vm.isUpdate" type="primary" size="small" @click="saveForm">
              <i class="el-icon-check"></i>
              立即创建
            </el-button>

            <el-button v-if="this.vm.isUpdate" type="primary" size="small" @click="modifyForm">
              <i class="el-icon-check"></i>
              保存更新
            </el-button>
          </div>
        </template>
      </el-page-header>

      <el-row>
        <el-col :span="12" :offset="6" style="padding-top: 20px;">
          <el-form :model="ruleForm" :rules="rules" ref="designForm" label-width="100px">
            <el-form-item label="表单名称" prop="name">
              <el-input size="small" v-model="ruleForm.name" clearable placeholder="请输入表单名称">
              </el-input>
            </el-form-item>

            <el-form-item v-if="false" label="表单类型" prop="formType">
              <el-select size="small" v-model="ruleForm.formType" clearable placeholder="请选择表单类型" style="width: 100%;">
                <el-option label="巡检" value="inspection"></el-option>
                <el-option label="保养" value="maintain"></el-option>
                <el-option label="点检" value="spotcheck"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark" placeholder="请添加备注"></el-input>
            </el-form-item>
          </el-form>

        </el-col>
        <el-col :span="24">
          <fm-making-form
            id="makingform"
            ref="makingform"
            preview
            style="height:600px;display: block;"
            :layout-fields = '[]'
            clearable>
          </fm-making-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
