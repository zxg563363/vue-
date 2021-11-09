<template>
  <div>
    <!-- <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb> -->
    <el-page-header @back="backPage"></el-page-header>
    <div class="widget-header">
      <h5 class="widget-title" style="color: #333333">基本信息</h5>
    </div>

    <br />
    <br />
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      style="width: 800px; margin: 0 auto"
    >
      <el-form-item label="缺陷标题">
        <el-input required   v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="缺陷设备" prop="equipId">
        <el-select
        @change="AddSelectDept"
         v-model="equipId"
          filterable
          clearable
          placeholder="请选择设备"
        >
          <el-option
            v-for="item in equipments"
            :key="item.id"
            :label="item.equipName + '（' + item.equipCode + '）'"
            :value="item.id"
          >
            <span style="float: left">{{ item.equipName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.equipCode
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="缺陷状态">
        <el-radio-group v-model="form.status">
          <el-radio label="0">未解决</el-radio>
          <el-radio label="1">已解决</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="缺陷类型">
        <el-radio-group v-model="form.type">
          <el-radio label="0">生产</el-radio>
          <el-radio label="1">机修</el-radio>
          <el-radio label="2">电气</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="解决备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-upload
          class="upload-demo"
          action=""
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="files"
          :on-change="handlechange"
          list-type="picture"
        >
          <el-button size="small" type="primary"
            >点击上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
          type="primary"
          @click="postDefect"
          ><i class="el-icon-check"></i>立即创建</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
