<template>
    <el-row class="company">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

        <el-col :span="24" class="content">
          <el-alert
            title="请完善以下信息，方便我们更好的为您服务！"
            type="info"
            show-icon>
          </el-alert>
          <el-form ref="companyFrom" :model="companyFrom" :rules="companyRule" label-suffix="：" size="small"
                   v-loading="vm.dataLoading" class="company-from"
                   label-width="140px" style="width: 800px; padding-top: 20px;">
            <el-form-item label="">
              <div style="width: 220px; margin: 0 auto;position: relative;">
                <el-upload
                  class="avatar-uploader"
                  action="/api-global/common/company/logo"
                  accept="image/*"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-avatar :size="128" fit="fill" v-if="vm.logo" :src="vm.logo">
                  </el-avatar>
                  <el-avatar :size="128" v-else :src="require('../../../../static/img/business-logo.png')">
                  </el-avatar>
                  <span class="profile-gravatar__edit-label-wrap">
                    <span class="profile-gravatar__edit-label">
                        <i class="fa fa-cloud-upload"></i>
                        上传Logo
                    </span>
                </span>
                </el-upload>
              </div>
            </el-form-item>
            <div class="companyTitle" style="margin-top: 20px;">基本信息</div>
            <el-form-item label="企业全称" prop="companyName">
              <el-input v-model="companyFrom.companyName" placeholder="请输入企业全称"></el-input>
            </el-form-item>
            <el-form-item label="企业简称" prop="shortName">
              <el-input v-model="companyFrom.shortName" placeholder="请输入企业简称"></el-input>
            </el-form-item>
            <el-form-item prop="scale" label="企业规模">
              <el-select v-model="companyFrom.scale" placeholder="请选择">
                <el-option label="少于15人" value="1"></el-option>
                <el-option label="15-50人" value="2"></el-option>
                <el-option label="50-150人" value="3"></el-option>
                <el-option label="150-500人" value="4"></el-option>
                <el-option label="500-2000人" value="5"></el-option>
                <el-option label="2000人以上" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="description" label="企业简介">
              <el-input type="textarea" v-model="companyFrom.description" :autosize="{ minRows: 4, maxRows: 22}" show-word-limit maxlength="2000" placeholder="企业简介信息"></el-input>
            </el-form-item>
            <div class="companyTitle">联系信息</div>
            <el-form-item prop="areaCode" label="所在地区">
              <el-cascader
                ref="district"
                placeholder="请选择所在地区"
                v-model="vm.areaCode"
                :options="vm.districtData"
                :props="{expandTrigger: 'hover',label: 'name',value: 'code'}" clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item prop="address" label="街道地址">
              <el-input v-model="companyFrom.address" placeholder="请输入街道地址"></el-input>
            </el-form-item>
            <el-form-item prop="contactPhone" label="联系电话">
              <el-input v-model="companyFrom.contactPhone" placeholder="例如：010-88888888"></el-input>
            </el-form-item>
            <el-form-item prop="contactName" label="联系人">
              <el-input v-model="companyFrom.contactName" placeholder="例如：张三"></el-input>
            </el-form-item>
            <el-form-item prop="mail" label="电子邮箱">
              <el-input v-model="companyFrom.mail" placeholder="例如：xxxx@xx.com"></el-input>
            </el-form-item>

            <el-form-item align="left">
              <el-button type="primary" :loading="vm.dataLoading" @click="submitForm('companyFrom')" style="margin-right: 20px">确认保存</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="vm.isAdmin" ref="transferForm" :model="vm.transfer" :rules="transferRule" label-suffix="：" size="small"
                   v-loading="vm.dataLoading" class="company-from"
                   label-width="140px" style="width: 800px; padding-top: 20px;">
            <div class="companyTitle">转让企业管理员</div>
            <label class="f-s-13" style="color: #606266; line-height: 36px;">
              如果你不想再管理当前企业，你可以选择转让给其他企业成员，转让之后你将无法再管理当前企业，并且该操作无法撤销
            </label>
            <el-form-item prop="userId" label="选择转让成员">
              <el-select v-model="vm.transfer.userId" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in vm.members"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id">
                  <span style="float: left">{{ item.realName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item align="left">
              <el-button type="primary" :loading="vm.dataLoading" @click="submitTransfer('transferForm')" style="margin-right: 20px">确认转让</el-button>
            </el-form-item>
          </el-form>
        </el-col>
    </el-row>
</template>

<script type="javascript" src="./company.js"></script>
<style scoped lang="less" src="./company.less"></style>
