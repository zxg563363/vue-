<template>
  <el-dialog
    title="添加设备"
    :visible.sync="open"
    width="1160px"
    :fullscreen="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="opened">

      <el-row>
        <el-col :span="24">
          <div class="box box-solid">
            <div class="box-body" id="query-area">
              <el-form :inline="true" :model="queryObj" size="small" class="demo-form-inline">
                <el-form-item label="">
                  <el-input v-model="queryObj.equipCode"  placeholder="请输入编码"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-input v-model="queryObj.equipName"  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-input v-model="queryObj.model"  placeholder="请输入型号"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-cascader
                    placeholder="请选择类型"
                    v-model="queryObj.typeId"
                    :options="vm.deviceTypeTreeData"
                    :show-all-levels="false"
                    :props="{
                      value: 'id',
                      label: 'typeName',
                      checkStrictly: true
                    }"></el-cascader>
                </el-form-item>
                <el-form-item label="">
                  <el-cascader
                    placeholder="请选择空间"
                    v-model="queryObj.spaceId"
                    :options="vm.deviceSpaceTreeData"
                    :show-all-levels="false"
                    :props="{
                      value: 'id',
                      label: 'spaceName',
                      checkStrictly: true
                    }"></el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="onSubmit">
                    查询
                  </el-button>
                  <el-button size="mini" @click="onReset">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="content">
            <el-table
              :row-key="getRowKey"
              ref="deviceListTable"
              stripe
              height="333"
              :data="tableData"
              @selection-change="handleChange"
              style="width: 100%">
              <el-table-column
                type="selection"
                :reserve-selection="true"
                width="55">
              </el-table-column>
              <el-table-column
                prop="equipCode"
                label="编码"
                width="180">
              </el-table-column>
              <el-table-column
                prop="equipName"
                label="名称"
                width="280">
              </el-table-column>
              <el-table-column
                label="类型"
                prop="typeName"
                width="200">
              </el-table-column>
              <el-table-column
                label="型号"
                prop="model"
                width="160">
              </el-table-column>
              <el-table-column
                label="空间"
                prop="spaceName"
                width="160">
              </el-table-column>
              <el-table-column
                width="100"
                label="状态">
                <template slot-scope="scope" >
                  <el-tag v-if="scope.row.validity == 0" type="danger">无效</el-tag>
                  <el-tag v-if="scope.row.validity == 1" type="success">有效</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-row>
            <el-col :span="24" style="text-align: right;padding-top: 12px;">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @prev-click="handleCurrentChange"
                @next-click="handleCurrentChange"
                :current-page.sync="pageData.pageNumber"
                :page-sizes="pageSizes"
                :page-size="pageData.pageSize"
                layout="total, prev, pager, next"
                :total="pageData.recordCount">
              </el-pagination>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelAddEquipment">取消</el-button>
          <el-button type="primary" size="small" @click="confirmAddEquipment()">确定({{vm.selectionData.length}})</el-button>
        </span>
  </el-dialog>
</template>

<script src="./index.js"></script>

<style scoped lang="less" src="./index.less"></style>
