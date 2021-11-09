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
      :model="form"
      ref="Form"
      :rules="rules"
      label-width="auto"
      style="width: 800px; margin: 0 auto"
    >
      <el-form-item label="供货商名称：" prop="supplierName">
        <el-input required v-model="form.supplierName"></el-input>
      </el-form-item>

      <el-form-item label="简称：">
        <el-input required v-model="form.supplierNickName"></el-input>
      </el-form-item>

      <el-form-item label="企业信用统一编号：">
        <el-input required v-model="form.supplierNumber"></el-input>
      </el-form-item>

      <el-form-item label="采买内容：">
        <el-input required v-model="form.purchasingContent"></el-input>
      </el-form-item>

      <el-form-item label="供应商等级：">
        <el-input required v-model="form.supplierGrade"></el-input>
      </el-form-item>

      <el-form-item label="供应商登录账号id：">
        <el-input required v-model="form.supplierAccountId"></el-input>
      </el-form-item>

      <el-form-item label="供应商登录账号名称：">
        <el-input required v-model="form.supplierAccountName"></el-input>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input required v-model="form.supplierLinkUser"></el-input>
      </el-form-item>

      <el-form-item label="联系电话：">
        <el-input required v-model="form.supplierLinkPhone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
          type="primary"
          v-if="establish"
          @click="postSupplier"
          ><i class="el-icon-check"></i>立即创建
        </el-button>
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="putSupplier"
          type="primary"
          v-if="modify"
          ><i class="el-icon-refresh-right"></i> 修改
        </el-button>
      </el-form-item>
    </el-form>

    <br />
    <p>
      <el-button type="primary" @click="openParts">
        <i class="el-icon-plus"></i>
        增加备件
      </el-button>
    </p>

    <br />
    <el-table :data="tableData" ref="form" stripe style="width: 100%">
      <el-table-column prop="spareName" label="备件名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="spareCode" label="备件编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价" show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="spareUnitName"
        label="备件单位"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.supplierName"
      :visible.sync="viewClickVisible"
      width="660px"
      center
    >
      <el-form label-width="auto">
        <div class="viewClickVisible">
          <el-form-item label="备件：" prop="data.spareId">
            <el-select
              v-model="data.id"
              filterable
              clearable
              placeholder="请选择"
              style="min-width:400px"
            >
              <el-option
                v-for="item in PartsList"
                :key="item.id"
                :label="item.spareName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格：">
            <el-input required v-model="data.unitPrice"></el-input>
          </el-form-item>

          <br />
          <el-button type="primary" v-if="edit" @click="putParts()"
            >更新</el-button
          >
          <el-button type="primary" v-if="!edit" @click="postParts()"
            >确定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
