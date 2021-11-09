<template>
  <el-row :gutter="12" id="power-gateway">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="6" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">网关信息</h5>
          <div class="widget-toolbar">
            <el-button  type="primary" size="mini" @click="vm.addTransmitsDialogVisible = true,vm.transmitForm={}">
              <i class="el-icon-plus"></i>
              添加网关
            </el-button>
            <el-button  size="mini" @click="getTreeData">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="spare-tree">
            <el-tree
              v-loading="vm.treeLoading"
              ref="tree"
              :filter-node-method="filterNode"
              :data="vm.treeData"
              node-key="id"
              style="min-height: 200px;"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{node, data}">
                <span>{{ data.transmitName }}</span>
                <span class="tree-extends-op">
                    <el-button type="text" title="编辑"
                               size="mini" @click.stop="() => {vm.addTransmitsDialogVisible=true;vm.transmitForm=JSON.parse(JSON.stringify(data));}">
                      <i class="el-icon-edit"></i>
                      编辑
                    </el-button>
                    <el-popconfirm
                      title="确定删除吗？" @confirm="removeTransmit(data)">
                      <el-button slot="reference" type="text" class="remove-btn" title="删除"
                                 size="mini">
                        <i class="el-icon-delete"></i>
                        删除
                      </el-button>
                    </el-popconfirm>
                  </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">{{vm.currentNode.transmitName}}【{{vm.currentNode.id}}】</h5>
          <div class="widget-toolbar">
            <el-button type="primary" size="mini" @click="vm.addCollectorDialogVisible = true,vm.collectorForm = {}">
              <i class="el-icon-plus"></i>
              添加终端
            </el-button>
            <el-button size="mini" @click="handleNodeClick(vm.currentNode)">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <el-table
          v-loading="vm.realDataLoading"
          stripe
          max-height="757"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="终端编号"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="scope">
              <el-link title="点击查看" type="primary">{{scope.row.collectorCode}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="collectorName"
            :show-overflow-tooltip="true"
            label="终端名称"
            min-width="200">
          </el-table-column>
          <el-table-column
            width="140"
            :show-overflow-tooltip="true"
            prop="spaceName"
            label="空间名称">
          </el-table-column>
          <el-table-column
            width="140"
            :show-overflow-tooltip="true"
            prop="equipmentName"
            label="关联设备">
          </el-table-column>
          <el-table-column
            width="80"
            prop="address"
            label="总线地址">
          </el-table-column>
          <el-table-column
            width="140"
            prop="externalTypeName"
            label="数据模型">
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
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200px">
            <template slot-scope="scope">
              <el-button @click="ruleSetting(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-setting">
                规则设置
              </el-button>
              <el-button @click="editGateway(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-edit">
                编辑
              </el-button>
              <el-popconfirm
                title="确定要删除吗？" @confirm="removeGateway(scope.row)">
                <el-button type="text" size="small" class="red" icon="el-icon-delete" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--规则设置-->
      <el-card v-if="vm.gatewayRuleDialogVisible" class="box-card" style="margin-top: 12px;">
        <div slot="header" class="clearfix">
          <span style="font-size: 14px; font-weight: bold;">规则信息【{{vm.currentGateway.collectorName}}】</span>
          <div style="float: right;">
            <el-button @click="addRuleModal" size="mini" type="primary"><i class="el-icon-plus"></i> 创建规则</el-button>
            <el-button @click="reloadRule(vm.currentGateway)" size="mini" icon="el-icon-attract">
              重载规则
            </el-button>
            <el-button @click="ruleSetting(vm.currentGateway)" size="mini" plain><i class="el-icon-refresh"></i> 刷新</el-button>
          </div>
        </div>
        <el-table
          v-loading="vm.gatewayRuleDataLoading"
          stripe
          :data="vm.gatewayRuleTableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="规则名称"
            :show-overflow-tooltip="true"
            prop="ruleName"
            min-width="180">
          </el-table-column>
          <el-table-column
            width="120"
            prop="ruleType"
            label="规则类型">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.ruleType==0">每次</el-tag>
              <el-tag size="mini" v-if="scope.row.ruleType==1">频次</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="90"
            prop="period"
            label="周期(秒)">
          </el-table-column>
          <el-table-column
            width="80"
            prop="times"
            label="次数">
          </el-table-column>
          <el-table-column
            min-width="160"
            prop="description"
            :show-overflow-tooltip="true"
            label="规则描述">
          </el-table-column>
          <el-table-column
            width="120"
            prop="createUserName"
            label="创建人">
          </el-table-column>
          <el-table-column
            width="140"
            prop="createTime"
            label="创建日期">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            min-width="160px">
            <template slot-scope="scope">
              <el-button @click="updateRuleModal(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-edit">
                编辑
              </el-button>
              <el-popconfirm
                title="确定要删除吗？" @confirm="removeRule(scope.row)">
                <el-button type="text" size="small" class="red" icon="el-icon-delete" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--添加网关-->
      <el-dialog title="添加网关信息" :visible.sync="vm.addTransmitsDialogVisible"
                 :close-on-click-modal="false"
                 width="400px" :show-close="false">
        <el-form :model="vm.transmitForm"  :rules="vm.transmitRules" ref="transmitForm"
                 v-loading="vm.spaceDataLoading"
                 label-suffix="：" style="width: 350px;"
                 label-width="120px"  size="small">
          <el-form-item label="网关名称" prop="transmitName">
            <el-input v-model="vm.transmitForm.transmitName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网关编码" prop="transmitCode">
            <el-input v-model="vm.transmitForm.transmitCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('transmitForm')" size="small">取消</el-button>
          <el-button v-if="!vm.transmitForm.id" type="primary"
                     :loading="vm.spaceDataLoading"
                     @click="addTransmit('transmitForm')" size="small">确定</el-button>
          <el-button v-if="vm.transmitForm.id" type="primary" @click="addTransmit('transmitForm')" size="small">更新</el-button>
        </div>
      </el-dialog>
      <!--添加终端设备-->
      <el-dialog title="添加终端信息" :visible.sync="vm.addCollectorDialogVisible"
                 :close-on-click-modal="false"
                 width="550px" :show-close="false" @opened="collectorDialogOpened">
        <el-form :model="vm.collectorForm"  :rules="vm.collectorRules" ref="collectorForm"
                 v-loading="vm.spaceDataLoading"
                 label-suffix="：" style="width: 500px;"
                 label-width="120px"  size="small">
          <el-form-item label="终端编码" prop="collectorCode">
            <el-input v-model="vm.collectorForm.collectorCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="终端名称" prop="collectorName">
            <el-input v-model="vm.collectorForm.collectorName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总线地址" prop="address">
            <el-input v-model="vm.collectorForm.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属空间" prop="spaceId">
            <el-cascader v-model="vm.collectorForm.spaceId" style="width: 380px;"
              :options="vm.spaceData" @change="getDeviceBySpaceId" ref="cascader"
              :props="{checkStrictly: true,label: 'spaceName',value: 'id'}"
              clearable></el-cascader>
          </el-form-item>
          <el-form-item label="关联设备" prop="equipmentId">
            <el-select clearable  v-model="vm.collectorForm.equipmentId" placeholder="请先选空间，再选择设备" style="width: 380px;">
              <el-option
                v-for="item in vm.deviceData"
                :key="item.id"
                :label="item.equipName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据模型" prop="externalTypeId">
            <el-select v-model="vm.collectorForm.externalTypeId" placeholder="请选择数据模型" style="width: 380px;">
              <el-option
                v-for="item in vm.modelsData"
                :key="item.id"
                :label="item.externalTypeName"
                :value="item.id">
                <span style="float: left;font-size: 13px;">{{ item.externalTypeName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.groupName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('collectorForm')" size="small">取消</el-button>
          <el-button v-if="!vm.collectorForm.id" type="primary"
                     :loading="vm.spaceDataLoading"
                     @click="addCollector('collectorForm')" size="small">确定</el-button>
          <el-button v-if="vm.collectorForm.id" type="primary" @click="addCollector('collectorForm')" size="small">更新</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
