<template>
  <el-row id="agreement">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="ime">
            <el-button type="primary" size="small" @click="NewlyAdded">
              <i class="el-icon-plus"></i>
              新建供应商备件
            </el-button>
            <span style="float: right">
              <el-select
                v-model="form.supplierId"
                filterable
                remote
                placeholder="请输入供应商"
                :remote-method="SupplierCondition"
                :loading="loading"
                @change="spareData"
              >
                <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="
                    item.supplierNickName + '（' + item.supplierName + '）'
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="form.spareId"
                filterable
                remote
                placeholder="请输入供应商备件"
                :remote-method="SpareCondition"
                :loading="loading"
                @change="detailsData(form.spareId)"
              >
                <el-option
                  v-for="item in spares"
                  :key="item.id"
                  :label="item.spareName + '（' + item.spareCode + '）'"
                  :value="item.id"
                >
                </el-option>
              </el-select>

              <el-button size="small" @click="defectReset">重置</el-button>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column
              prop="spareName"
              label="备件名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="spareCode"
              label="备件编号"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="unitPrice"
              label="单价"
              show-overflow-tooltip
            >
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
                <el-button
                  type="text"
                  @click="editAgreement(scope.row)"
                  title="编辑"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                  type="text"
                  @click="deleteAgreement(scope.row)"
                  class="text-danger"
                  title="移除"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
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
              :current-page.sync="page.pageNumber"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--新建/编辑供应商备件-->
    <el-dialog
      :title="(update ? '更新' : '新增') + '供应商备件'"
      width="700px"
      center
      :visible.sync="dialogVisible"
    >
      <el-form
        ref="securityForm"
        :rules="rules"
        :model="form"
        label-width="120px"
        style="width: 500px; margin: 0 auto"
      >
        <el-form-item prop="supplierId" label="请选择供应商">
          <el-select
            v-model="form.supplierId"
            filterable
            remote
            placeholder="请输入供应商"
            :remote-method="SupplierCondition"
            :loading="loading"
            :disabled="update"
          >
            <el-option
              v-for="item in suppliers"
              :key="item.id"
              :label="item.supplierNickName + '（' + item.supplierName + '）'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="spareId" label="请选择备件">
          <el-select
            v-model="form.spareId"
            filterable
            remote
            placeholder="请输入供应商备件"
            :remote-method="SpareCondition"
            :loading="loading"
            :disabled="update"
          >
            <el-option
              v-for="item in spares"
              :key="item.id"
              :label="item.spareName + '（' + item.spareCode + '）'"
              :value="item.id"
            >
              <span style="float: left">{{ item.spareName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.spareCode }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格">
          <el-input required v-model="form.unitPrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="!update" @click="addSpare"
          >确 定</el-button
        >
        <el-button type="primary" v-if="update" @click="updateSpare"
          >更 新</el-button
        >
      </div>
    </el-dialog>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
