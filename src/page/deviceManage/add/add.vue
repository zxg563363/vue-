<template>
  <el-row>
    <el-col :span="24" class="addType">
      <el-page-header @back="backPage">
        <template slot="content">
          <div class="el-page-header__content">{{vm.isUpdate ? '编辑' : '添加'}}设备</div>
          <div style="position: absolute;right: 0px; top: 0;">

            <el-button v-if="!vm.isUpdate" :loading="vm.dataLoading" type="primary" size="small" @click="saveDevice">
              <i class="el-icon-check"></i>
              立即创建
            </el-button>

            <el-button v-if="vm.isUpdate" :loading="vm.dataLoading" type="primary" size="small" @click="saveDevice">
              <i class="el-icon-check"></i>
              确定保存
            </el-button>
            <el-button v-if="vm.isUpdate" type="primary" plain size="small" @click="getDeviceInfo">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
            <el-button size="small" type="primary" plain @click="resetForm">
              <i class="el-icon-close"></i>
              重置
            </el-button>
          </div>
        </template>
      </el-page-header>
      <div class="widget-box" style="margin-top: 12px;">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">基本信息</h5>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <el-form :model="addData" :rules="datarules" size="small" label-suffix="：" ref="deviceForm"
                     v-loading="vm.dataLoading"
                     style="width: 800px; margin: 0 auto;"
                     label-width="100px" class="demo-ruleForm">
              <el-form-item v-if="!vm.isUpdate" label="设备编码" prop="equipCode">
                <el-input v-model="addData.equipCode" placeholder="请输入设备编码"></el-input>
              </el-form-item>
              <el-form-item label="设备名称" prop="equipName">
                <el-input v-model="addData.equipName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
              <el-form-item v-if="!vm.isUpdate" label="设备类型" prop="typeId">
                <el-cascader v-model="addData.typeId" style="width: 60%;"
                  :options="vm.deviceTypeArr" @change="typeChange" ref="deviceType"
                  :props="{checkStrictly: true,label: 'typeName',value:'id'}"
                  clearable></el-cascader>
              </el-form-item>
              <el-form-item label="设备型号" prop="model">
                <el-input v-model="addData.model" placeholder="请输入设备型号"></el-input>
              </el-form-item>
              <el-form-item label="设备地点" prop="spaceId">
                <el-cascader v-model="addData.spaceId" style="width: 60%;"
                   :options="vm.deviceSpaceArr" ref="deviceSpace"
                   :props="{checkStrictly: true,label: 'spaceName',value:'id'}"
                   clearable></el-cascader>
              </el-form-item>
              <el-form-item label="厂家" prop="manufacturers">
                <el-input v-model="addData.manufacturers" placeholder="请输入厂家"></el-input>
              </el-form-item>
              <el-form-item label="负责人" prop="principalName">
                <el-input v-model="addData.principalName" placeholder="请输入负责人名称"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="principalPhone">
                <el-input v-model="addData.principalPhone" placeholder="请输入负责人电话" type='number'></el-input>
              </el-form-item>
              <el-form-item label="使用年限" prop="serviceLife">
                <el-input placeholder="请输入使用年限" v-model="addData.serviceLife" type="Number" />
              </el-form-item>
              <el-form-item label="生产日期:" prop="producedDate">
                <el-date-picker v-model="addData.producedDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="安装日期" prop="installDate">
                <el-date-picker v-model="addData.installDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="投产日期" prop="serviceDate">
                <el-date-picker v-model="addData.serviceDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptions" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="设备状态" prop="status">
                <el-select v-model="addData.status">
                  <el-option v-for="item in vm.statusArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">设备扩展内容</h5>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <fm-generate-form style="width: 800px; margin: 0 auto;"
              :data="extension" :value='addData.extension.formData' ref="makingformcheck" v-if="extension">
            </fm-generate-form>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
