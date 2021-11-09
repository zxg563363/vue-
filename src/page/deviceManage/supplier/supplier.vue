<template>
  <div>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <br />
    <div class="ime">

      <span style="float: right;">
        <el-input
          type="text"
          v-model="searchData"
          size="small"
          placeholder="请输入"
        ></el-input>
        <el-button   @click="supplierSearch" type="primary" size="small"
          >搜索</el-button
        >
        <el-button @click="supplierReset" size="small">重置</el-button>
      </span>
    </div>
    <br />
    <p>
      <el-button type="primary" @click="openClick">
        <i class="el-icon-plus"></i>
        新建供应商
      </el-button>
    </p>

    <br />
    <el-table :data="tableData" ref="form" stripe style="width: 100%">
      <el-table-column
        fixed
        prop="supplierName"
        label="供货商名称"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-link
            title="点击查看"
            :underline="false"
            type="primary"
            @click="checkClick(scope.row)"
            >{{ scope.row.supplierName }}</el-link
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="supplierNickName"
        label="简称"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="supplierNumber"
        label="企业信用统一编号"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="purchasingContent"
        label="采买内容"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="supplierGrade"
        label="供应商等级"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="supplierAccountId"
        label="供应商登录账号id"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="supplierAccountName"
        label="供应商登录账号名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="supplierLinkUser"
        label="联系人"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="supplierLinkPhone"
        label="联系电话"
        show-overflow-tooltip
      >
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

    <div class="paging">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :total="totaldata"
        @current-change="handleCurrent"
        @size-change="handleSizeChange"
        :current-page.sync="page"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
