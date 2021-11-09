<template>
  <el-row :gutter="12" class="deviceList">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="6" style="margin-top: 12px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;">设备类型</span>
          <div style="float: right;">
            <el-button @click="addType()" size="mini" type="primary">
              <i class="el-icon-plus"></i>
              新建类型
            </el-button>
            <el-button @click="$refs['deviceTypeTree'].getData()" size="mini" plain>
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <DeviceType ref="deviceTypeTree" :on-click-node="onClickNode">
          <template slot="node" slot-scope="{node, data}">
            <span class="tree-extends-op">
              <el-button title="添加子类"
                 type="text"
                 size="small"
                 @click.stop="addSubtype(node,data)">
                <i class="el-icon-folder-add f-s-14"></i>
                添加子类
              </el-button>
              <el-button title="删除"
                         type="text"
                         size="small"
                         class="remove-btn"
                         @click.stop="deleteDeviceType(node,data)">
                <i class="el-icon-delete f-s-13"></i>
                删除
              </el-button>
            </span>
          </template>
        </DeviceType>
      </el-card>
    </el-col>
    <el-col :span="18" style="margin-top: 12px;">
      <el-card v-loading="vm.loading" class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;">
            <label>【{{vm.isUpdate ? '编辑' : '新建'}}】</label>类型信息
          </span>
          <div style="float: right;">
            <el-button :loading="vm.loading" v-if="!vm.isUpdate"
                       @click="handleDeviceType"
                       size="mini" type="primary">
              <i class="el-icon-check"></i>
              保存
            </el-button>
            <el-button :loading="vm.loading" v-if="vm.isUpdate"
                       @click="handleDeviceType"
                       size="mini" type="primary">
              <i class="el-icon-check"></i>
              确定提交
            </el-button>
            <el-button :loading="vm.loading" v-if="vm.isUpdate"
                       @click="deleteDeviceType(null,addData)"
                       size="mini" type="danger">
              <i class="el-icon-delete"></i>
              移除
            </el-button>
          </div>
        </div>
        <el-form :model="addData" :rules="datarules" size="small"
                 ref="deviceTypeForm" style="width: 50%;" label-width="160px"
                 label-suffix="："
                 class="demo-ruleForm">
          <el-form-item label="设备类型父级">
            <label style="font-weight: bold;">{{addData.parentName}}</label>
          </el-form-item>
          <el-form-item label="设备类型名称" prop="typeName">
            <el-input v-model="addData.typeName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类型编码" prop="typeCode">
            <el-input v-model="addData.typeCode" maxlength="5" placeholder="请输入设备编码"></el-input>
          </el-form-item>
          <el-form-item label="日期格式">
            <el-select v-model="addData.dateFormat">
              <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="序号长度">
            <el-select v-model="addData.sequenceSize">
              <el-option v-for="item in options0" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addData.description" type='textarea'></el-input>
          </el-form-item>
        </el-form>
        <el-divider content-position="left">扩展内容</el-divider>
        <fm-making-form id="makingform" ref="makingformcheck" preview style="height:700px;display: block;" :layout-fields='[]'
                        clearable>
        </fm-making-form>
      </el-card>
    </el-col>

  </el-row>
</template>

<script type="javascript" src="./deviceType.js"></script>
<style scoped lang="less" src="./deviceType.less"></style>
