<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-form :inline="true" :model="queryObj" size="small" class="demo-form-inline">
            <el-form-item label="条件筛选：">
              <el-input v-model="queryObj.name" style="width: 380px;"  placeholder="请输入表单名称"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-select size="small" v-model="queryObj.formType" placeholder="表单类型">
                <el-option label="--请选择表单类型--" value=""></el-option>
                <el-option label="巡检" value="inspection"></el-option>
                <el-option label="保养" value="maintain"></el-option>
                <el-option label="点检" value="spotcheck"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="onSubmit">
                查询
              </el-button>
              <el-button size="small" @click="onReset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="box box-solid">
        <div class="box-body">
          <el-button @click="$router.push({name: 'form_add'})" type="primary" size="small">
            <i class="el-icon-plus"></i>
            新建表单
          </el-button>
        </div>
      </div>

      <div class="content">
        <keep-alive>
        <el-table
          stripe
          height="475"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="表单名称"
            :show-overflow-tooltip="true"
            width="280">
            <template slot-scope="scope">
              <el-link title="点击查看" type="primary" @click="viewForm(scope.row.id)">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="表单类型"
            min-width="140">
            <template slot-scope="scope">
              {{scope.row.formType | formTypeFormatter}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="表单状态">
            <template slot-scope="scope" >
              <el-tag v-if="scope.row.validity == 0" size="mini" type="danger">无效</el-tag>
              <el-tag v-if="scope.row.validity == 1" size="mini" type="primary">有效</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="createUserName"
            label="创建用户">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="createTime"
            label="创建日期">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="modifyTime"
            label="修改日期">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            min-width="160">
            <template slot-scope="scope">
              <el-button @click="previewForm(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-view">
                预览
              </el-button>

              <el-button @click="removeForm(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-delete">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </keep-alive>
      </div>

      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handleCurrentChange"
            @next-click="handleCurrentChange"
            :current-page.sync="pageData.pageNumber"
            :page-sizes="pageSizes"
            :page-size="pageData.pageSize"
            layout="total, prev, pager, next, sizes"
            :total="pageData.recordCount">
          </el-pagination>
        </el-col>
      </el-row>
      <!--预览表单-->
      <el-dialog
        :title="'【'+vm.form.name+'】'"
        :visible.sync="vm.dialogVisible"
        :show-close="false"
        width="30%">
        <el-row>
          <el-col :span="16" :offset="4">
            <div v-loading="vm.loading" style="max-height: 350px; overflow-y: auto;">
              <fm-generate-form
                :data="vm.jsonData"
                ref="generateForm"
              >
              </fm-generate-form>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="vm.dialogVisible = false,vm.loading = true">确 定</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
