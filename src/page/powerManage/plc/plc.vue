<template>
  <el-row>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-row>
            <el-col :span="12">
              <el-button @click="dialogVisible=true, vm.plc = {plcId: '', plcName: ''}" type="primary" size="small">
                <i class="el-icon-plus"></i>
                绑定PLC设备
              </el-button>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-form :inline="true" :model="params" ref="queryForm" size="small">
                <el-form-item label="">
                  <el-input v-model="params.keyword" placeholder="编号、名称等"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search">
                    <i class="el-icon-search"></i>
                    查询
                  </el-button>
                  <el-button @click="reset">重置</el-button>
                  <!--<el-button type="text">展开 <i class="el-icon-arrow-down"></i></el-button>-->
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

        </div>
      </div>
    </el-col>
    <el-col :span="24" class="expand-table">
      <el-table
        v-loading="tableDataLoading"
        @expand-change="getDeviceByPlcId"
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row class="expand-content" v-loading="props.row.loading">
              <el-col v-for="(item,index) in vm.plcEquipments[props.row.id]" :key="index" :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                <el-card shadow="hover">
                  <el-row>
                    <el-col :span="24">
                      <h3>{{item.equipCode}}</h3>
                      <div class="op-remove">
                        <el-link @click="removeEquipment(index,item.id)" type="danger" title="删除" :underline="false" icon="el-icon-delete"></el-link>
                      </div>
                      <el-divider></el-divider>
                      <el-form label-suffix=":" size="mini" :model="item" label-width="90px">
                        <el-form-item label="名称">
                          <span class="eq-value">{{item.equipName}}</span>
                        </el-form-item>
                        <el-form-item label="PLC-Id">
                          <el-input placeholder="Plc-Id" clearable v-model="item.plcDeviceId"></el-input>
                        </el-form-item>
                        <el-form-item label="PLC地址">
                          <el-input placeholder="Plc地址" clearable v-model="item.plcAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="命令">
                          <el-button @click="addCommand(item,index,props.row.id)" type="text" icon="el-icon-circle-plus-outline">添加</el-button>
                          <div>
                            <el-tag v-for="(command,i) in item.commandMap" :key="i" @close="closeTag(command,index,props.row.id)" size="mini" closable>{{command.id}}</el-tag>
                          </div>

                        </el-form-item>
                        <el-form-item style="text-align: right; margin-bottom: 0;">
                          <el-button @click="updateEquipment(item)" size="mini" type="primary">保存</el-button>
                        </el-form-item>
                      </el-form>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                <div @click="addEquipmentToPlc(props)" class="add-equipment">
                  <div>+</div>
                  <div>添加设备</div>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="PLC编码"
          prop="id">
        </el-table-column>
        <el-table-column
          label="PLC名称"
          prop="plcName">
        </el-table-column>
        <el-table-column
          label="PLC型号"
          prop="plcModel">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160"
          align="center">
          <template slot-scope="scope">
            <el-button @click="vm.plc= scope.row,vm.plc.plcId=scope.row.id,dialogVisible=true" type="text" size="small"
                       icon="el-icon-edit">
              编辑
            </el-button>
            <el-popconfirm @confirm="unbindPlc(scope.row.id)" title="确定解绑吗？">
              <el-button slot="reference" type="text" size="small" class="red"
                         icon="el-icon-link">
                解绑
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!--绑定plc-->
      <el-dialog :title="(!vm.plc.id ? '绑定': '编辑') +'PLC'" :visible.sync="dialogVisible"
                 :close-on-click-modal="false"
                 width="400px" :show-close="false">
        <el-form :model="vm.plc"  :rules="vm.plcRules" ref="plcForm"
                 v-loading="dataLoading"
                 label-suffix="：" style="width: 350px;"
                 label-width="120px"  size="small">
          <el-form-item label="PLC编码" prop="plcId">
            <el-input v-model="vm.plc.plcId" v-if="!vm.plc.id" autocomplete="off"></el-input>
            <label v-else>{{vm.plc.id}}</label>
          </el-form-item>
          <el-form-item v-if="vm.plc.id" label="PLC名称" prop="plcName">
            <el-input v-model="vm.plc.plcName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="vm.plc.id" label="PLC型号" prop="plcModel">
            <el-input v-model="vm.plc.plcModel" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('plcForm')" size="small">取消</el-button>
          <el-button v-if="!vm.plc.id" type="primary"
                     :loading="dataLoading"
                     @click="bindPlc('plcForm')" size="small"><i class="el-icon-connection"></i> 立即绑定</el-button>
          <el-button v-if="vm.plc.id" type="primary" @click="updatePlc('plcForm')" size="small">更新</el-button>
        </div>
      </el-dialog>
      <DeviceListDialog :open="vm.dialogVisible" :confirm="confirmAddEquipment" :cancel="()=>{vm.dialogVisible=false}"></DeviceListDialog>
      <plc-command :open="vm.plcCommandDialogVisible" :confirm="confirmAddCommand" :cancel="()=>{vm.plcCommandDialogVisible=false}"></plc-command>
    </el-col>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
