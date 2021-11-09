<template>
  <el-row id="security">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="ime">
            <el-button type="primary" size="small" @click="NewlyAdded">
              <i class="el-icon-plus"></i>
              新建备品安全库存
            </el-button>
            <span style="float: right">
              <el-select
                v-model="spareData.branchId"
                filterable
                placeholder="选择二级公司"
                @change="branchId"
              >
                <el-option
                  v-for="item in SecondaryDepartments"
                  :key="item.departId"
                  :label="item.departName"
                  :value="item.departId"
                >
                </el-option>
              </el-select>

              <el-select
                v-model="spareData.spareId"
                filterable
                remote
                placeholder="请输入备件名称"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in spares"
                  :key="item.id"
                  :label="item.spareName + '（' + item.spareCode + '）'"
                  :value="item.id"
                >
                </el-option>
              </el-select>

              <el-button @click="searchBranch" type="primary" size="small"
                >搜索</el-button
              >
              <el-button @click="defectReset" size="small">重置</el-button>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table
            :data="StockSecuritys"
            v-loading.fullscreen.lock="fullscreenLoading"
            ref="form"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="spareCode"
              label="备件编号"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="spareName"
              label="备件名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="spareModel"
              label="备件型号"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="minimum" label="下限" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="maximum" label="上限" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editSecurity(scope.row)"
                  title="编辑"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button
                  type="text"
                  @click="deleteSecurity(scope.row)"
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
              :current-page.sync="spareData.pageNumber"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--新建/编辑备品安全库存-->
    <el-dialog
      :title="(update ? '更新' : '新增') + '备品安全库存'"
      width="700px"
      center
      @open="getEquipmentData"
      :visible.sync="dialogVisible"
    >
      <el-form
        ref="securityForm"
        :rules="rules"
        :model="form"
        label-width="120px"
        style="width: 500px; margin: 0 auto"
      >
        <el-form-item prop="branchId" label="请选择分公司">
          <el-select
            v-model="spareData.branchId"
            @change="branchId"
            filterable
            width="100%"
            :disabled="update"
            placeholder="请选择分公司"
          >
            <el-option
              v-for="item in SecondaryDepartments"
              :key="item.departId"
              :label="item.departName"
              :value="item.departId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="spareId" label="选择备品">
          <el-select
            v-model="form.spareId"
            filterable
            clearable
            :disabled="update"
            placeholder="请选择设备"
          >
            <el-option
              v-for="item in Equipments"
              :key="item.id"
              :label="item.spareName + '（' + item.spareTypeName + '）'"
              :value="item.id"
            >
              <span style="float: left">{{ item.spareName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.spareCode }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上限">
          <el-input required v-model="form.minimum"></el-input>
        </el-form-item>

        <el-form-item label="下限">
          <el-input required v-model="form.maximum"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment" v-if="!update"
          >确 定</el-button
        >
        <el-button type="primary" @click="updatePut" v-if="update"
          >更 新</el-button
        >
      </div>
    </el-dialog>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
