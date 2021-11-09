<template>
  <el-form :model="addData" label-width="120px" v-loading="dataLoading" label-suffix="：">
    <el-form-item label="工单编号">
      <label>{{addData.uuId}}</label>
    </el-form-item>
    <el-form-item label="工单标题">
      <label>{{addData.title}}</label>
    </el-form-item>
    <el-form-item label="工单类型">
      <label>{{addData.catalogName}}</label>
    </el-form-item>
    <el-form-item label="空间区域">
      <label>{{addData.zoneName}}</label>
    </el-form-item>
    <el-form-item label="设备选择">
      <label>{{addData.pointName}}</label>
    </el-form-item>
    <el-form-item label="来源">
      <label>{{addData.source}}</label>
    </el-form-item>
    <el-form-item label="优先级">
      <label>{{addData.urgency}}</label>
    </el-form-item>
    <el-form-item label="联系人">
      <label>{{addData.contactName}}</label>
    </el-form-item>
    <el-form-item label="联系电话">
      <label>{{addData.contactMobile}}</label>
    </el-form-item>
    <el-form-item label="工单状态">
      <label>{{addData.status=='DELAY' ? '延期中' :addData.statusName}}</label>
    </el-form-item>
    <el-form-item label="情况说明">
      <label>{{addData.description}}</label>
    </el-form-item>
    <el-form-item label="附件">
      <div style="padding-top: 15px;">
        <el-image
          style="width: 100px; height: 100px"
          v-for="(img,i) in addData.atts" :key="i"
          :src="'https://picture.ceiov.com/'+img.src"
          :preview-src-list="['https://picture.ceiov.com/'+img.src]">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
    </el-form-item>
    <el-form-item label="创建时间">
      <label>{{addData.createTime}}</label>
    </el-form-item>
    <el-form-item label="更新时间">
      <label>{{addData.modifyTime}}</label>
    </el-form-item>
    <el-form-item label="更新用户">
      <label>{{addData.modifyUserName}}</label>
    </el-form-item>
    <el-divider v-if="addData.extension&&addData.extension.formFields" >工单扩展信息</el-divider>
    <el-form-item v-if="addData.extension&&addData.extension.formFields"
                  :label="item.name"
                  v-for="(item,i) in addData.extension.formFields.list" :key="i">
      <label>{{item.form_Value}}</label>
    </el-form-item>
  </el-form>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
