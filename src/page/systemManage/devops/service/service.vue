<template>
  <el-row :gutter="12" class="inspect" style="padding: 6px;">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="6" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">服务目录</h5>
          <div class="widget-toolbar">
            <el-button  type="primary" size="mini" @click="addFrom">
              <i class="el-icon-plus"></i>
              新建类型
            </el-button>
            <el-button  size="mini" @click="reset">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="catalog-tree">
            <el-tree ref="deviceTreeRef" :data="catalogTree"
                     v-loading="vm.serviceDataLoading"
                     :props="catalogProps"
                     :default-expand-all="true"
                     @node-click="getDeviceId"
                     node-key="id"
                     :expand-on-click-node="false"
                     highlight-current
                     class="leftTrees"
                     :current-node-key="id">
              <span slot-scope='{node,data}' style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
                 <span>
                    <span>{{node.label}}</span>
                  </span>
                <el-button type="text" @click.stop="addFromM(data)" v-if="data.catalogType==0">添加模版</el-button>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">服务目录详情</h5>
          <div class="widget-toolbar">
            <el-button v-if="!isEdit" type="primary" size="mini" @click="submitFrom('form')">
              <i class="el-icon-check"></i>
              确定保存
            </el-button>

            <el-button v-else type="primary" size="mini" @click="submitFrom('form')">
              <i class="el-icon-check"></i>
              保存更新
            </el-button>
            <el-button v-if="isEdit" type="danger" plain size="mini" @click="delFrom">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <el-row>
              <el-col :span="12" :offset="5">
                <el-form ref="form" :model="addData" :rules="rules" label-width="120px" size="small" v-loading="vm.dataLoading">
                  <el-form-item label="名称" prop="catalogName">
                    <el-input v-model="addData.catalogName"></el-input>
                  </el-form-item>
                  <el-form-item label="序号" prop="seq">
                    <el-input type="number" v-model="addData.seq"></el-input>
                  </el-form-item>

                  <el-form-item label="所属类型" prop="pId">
                    <el-select v-model="addData.pId" style="width: 100%">
                      <el-option
                        v-for="item in catalogTree"
                        :key="item.id"
                        :label="item.catalogName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否指定设备" prop="assignPoint">
                    <el-switch
                      v-model="addData.assignPoint"
                      active-value="1"
                      inactive-value="0">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="评价模式" prop="evaluateModel">
                    <el-select v-model="addData.evaluateModel" placeholder="请选择评价模式">
                      <el-option label="需要评价" value="1"></el-option>
                      <el-option label="无需评价" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="审批模式" prop="approvalModel">
                    <el-select v-model="addData.approvalModel" style="width: 100%">
                      <el-option
                        v-for="item in optionCircle"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>

                </el-form>
              </el-col>
            </el-row>

          </div>
        </div>
      </div>
      <el-row>
        <el-col :span="24">
          <fm-making-form v-loading="vm.dataLoading" id="makingform" ref="makingformcheck" preview style="height:800px;display: block;" :layout-fields='[]'
                          clearable>
          </fm-making-form>
        </el-col>
      </el-row>
    </el-col>

      <el-dialog
        title="新建服务目录"
        :visible.sync="isPid"
        :show-close="false"
        width="600px">
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form ref="serviceForm" :model="addPformData" :rules="rules" label-suffix="：" label-width="140px"  size="small">
              <el-form-item label="服务目录名称" prop="catalogName">
                <el-input v-model="addPformData.catalogName" placeholder="请输入服务目录名称"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="seq">
                <el-input-number v-model="addPformData.seq" :min="0" :max="999" label="排序"></el-input-number>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button  size="small" @click="cancel(),isPid = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm('serviceForm')">确 定</el-button>
        </span>
      </el-dialog>
  </el-row>
</template>

<script type="javascript" src="./service.js"></script>
<style scoped lang="less" src="./service.less"></style>
