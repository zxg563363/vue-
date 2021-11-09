<template>
  <div id="equipment">
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f-s-14" style="font-weight: bold;"><i class="el-icon-info"></i> 设备基本信息</span>
            <div style="float: right;">
              <el-button @click="getEquipment" size="mini">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </div>
          <div style="position: relative;">
            <el-image :src="'/api-capital/equipments/qr_code/'+equipment['id']"
                      style="position: absolute;z-index: 3; right: 0px; top:0px; width: 128px; height: 128px;">
              <div slot="placeholder" class="image-slot">
                图片加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
          <el-form ref="equipmentForm" :model="equipment" size="small" v-loading="dataLoading" label-suffix="：" label-width="120px">
            <el-form-item label="设备编码">
              <label class="f-s-18" style="font-weight: bold;">{{equipment.equipCode}}</label>
            </el-form-item>
            <el-form-item label="设备名称">
              <label>{{equipment.equipName}}</label>
            </el-form-item>
            <el-form-item label="设备类型">
              <label>{{equipment.typeName}}</label>
            </el-form-item>
            <el-form-item label="设备型号">
              <label>{{equipment.model}}</label>
            </el-form-item>
            <el-form-item label="设备地点">
              <label>{{equipment.spaceName}}</label>
            </el-form-item>
            <el-form-item label="使用年限">
              <label>{{equipment.serviceLife}}</label>
            </el-form-item>
            <el-form-item label="安装日期">
              <label>{{equipment.installDate}}</label>
            </el-form-item>
            <el-form-item label="生产日期">
              <label>{{equipment.producedDate}}</label>
            </el-form-item>
            <el-form-item label="投产日期">
              <label>{{equipment.serviceDate}}</label>
            </el-form-item>
            <el-form-item label="状态">
              <label>{{equipmentStatusMapping[equipment.status] ? equipmentStatusMapping[equipment.status].label : equipment.status}}</label>
            </el-form-item>
            <el-form-item label="负责人">
              <label>{{equipment.principalName}}</label>
            </el-form-item>
            <el-form-item label="联系电话">
              <label>{{equipment.principalPhone}}</label>
            </el-form-item>
            <el-form-item label="生产厂家">
              <label>{{equipment.manufacturers}}</label>
            </el-form-item>
            <el-divider v-if="equipment.extension && equipment.extension.formFields" >工单扩展信息</el-divider>
            <el-form-item v-if="equipment.extension && equipment.extension.formFields"
                          :label="item.name"
                          v-for="(item,i) in equipment.extension.formFields.list" :key="i">
              <label>{{item.form_Value}}</label>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f-s-14" style="font-weight: bold;"><i class="el-icon-box"></i> 关联备件信息（{{spareTableData.length}}）</span>
            <div style="float: right;">
              <el-button @click="getEquipment" size="mini" type="text">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </div>
          <el-table
            stripe
            max-height="357"
            :data="spareTableData"
            style="width: 100%">
            <el-table-column
              fixed
              label="备件编号"
              width="160">
              <template slot-scope="scope">
                {{scope.row.spareCode}}
              </template>
            </el-table-column>
            <el-table-column
              fixed
              prop="spareName"
              label="备件名称"
              width="180">
            </el-table-column>
            <el-table-column
              width="140"
              prop="spareTypeName"
              label="备件类型">
            </el-table-column>
            <el-table-column
              width="140"
              prop="createUserName"
              label="创建用户">
            </el-table-column>
            <el-table-column
              width="140"
              prop="createTime"
              label="创建日期">
            </el-table-column>
            <el-table-column
              width="140"
              prop="modifyTime"
              label="修改日期">
            </el-table-column>
          </el-table>
        </el-card>

        <el-tabs type="border-card">
          <el-tab-pane>
            <span class="f-s-14" style="font-weight: 600;" slot="label">
              <i class="el-icon-s-order"></i>
              巡检记录
            </span>
            <el-row>
              <el-col :span="24">
                <TaskRecord :equipment="equipment" plan-type="inspection"></TaskRecord>
              </el-col>
            </el-row>

          </el-tab-pane>
          <el-tab-pane>
            <span class="f-s-14" style="font-weight: 600;" slot="label">
              <i class="el-icon-s-order"></i>
              保养记录
            </span>
            <TaskRecord :equipment="equipment" plan-type="maintain"></TaskRecord>
          </el-tab-pane>
          <el-tab-pane>
            <span class="f-s-14" style="font-weight: 600;" slot="label">
              <i class="el-icon-s-order"></i>
              点检记录
            </span>
            <TaskRecord :equipment="equipment" plan-type="spotcheck"></TaskRecord>
          </el-tab-pane>
          <el-tab-pane>
            <span class="f-s-14" style="font-weight: 600;" slot="label">
              <i class="el-icon-tickets"></i>
              工单记录
            </span>
            <el-row>
              <el-col :span="24">
                <el-table
                  stripe
                  v-loading="workDataLoading"
                  :data="workData"
                  style="width: 100%">
                  <el-table-column
                    fixed
                    prop="uuId"
                    label="工单编号"
                    width="200">
                    <template slot-scope="scope">
                      {{scope.row.uuId}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    prop="title"
                    label="工单名称"
                    show-overflow-tooltip
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    width="300"
                    show-overflow-tooltip
                    label="情况说明">
                  </el-table-column>
                  <el-table-column
                    prop="catalogName"
                    min-width="160"
                    show-overflow-tooltip
                    label="工单类型">
                  </el-table-column>
                  <el-table-column
                    prop="statusName"
                    label="状态">
                  </el-table-column>
                  <el-table-column
                    prop="urgency"
                    label="优先级">
                  </el-table-column>
                  <el-table-column
                    prop="source"
                    label="来源">
                  </el-table-column>
                  <el-table-column
                    prop="zoneName"
                    min-width="140"
                    show-overflow-tooltip
                    label="空间名称">
                  </el-table-column>
                  <el-table-column
                    prop="contactName"
                    label="联系人">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    align="center"
                    label="创建时间"
                    width="140">
                  </el-table-column>
                </el-table>
                <div class="paging" style="text-align: right;">
                  <el-pagination background
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
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane>
            <span class="f-s-14" style="font-weight: 600;" slot="label">
              <i class="el-icon-first-aid-kit"></i>
              备件消耗
            </span>
            <el-row>
              <el-col :span="24">
                <el-table
                  stripe
                  show-summary
                  v-loading="workDataLoading"
                  :data="spareUsageData"
                  style="width: 100%">
                  <el-table-column
                    fixed="left"
                    type="index"
                    label="序号"
                    width="60">
                  </el-table-column>
                  <el-table-column
                    fixed
                    prop="spareName"
                    label="部件名称"
                    show-overflow-tooltip
                    min-width="200">
                  </el-table-column>
                  <el-table-column
                    prop="spareTypeName"
                    min-width="160"
                    show-overflow-tooltip
                    label="部件类型">
                  </el-table-column>
                  <el-table-column
                    prop="spareUnitName"
                    min-width="120"
                    show-overflow-tooltip
                    label="部件单位">
                  </el-table-column>
                  <el-table-column
                    prop="spareModel"
                    min-width="160"
                    show-overflow-tooltip
                    label="部件型号">
                  </el-table-column>
                  <el-table-column
                    prop="total"
                    min-width="160"
                    label="总数量">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
