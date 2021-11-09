<template>
    <el-row :gutter="12" class="process">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

      <el-col :span="6" style="padding-top: 12px;">
        <div class="widget-box">
          <div class="widget-header">
            <h5 class="widget-title" style="color: #333333;">流程列表</h5>
            <div class="widget-toolbar">
              <el-button  type="primary" size="mini" @click="creatNew">
                <i class="el-icon-plus"></i>
                新建流程
              </el-button>
              <el-button  size="mini" @click="getProcessList()">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </div>
          <div class="widget-body">
            <div v-loading="vm.dataLoading" class="widget-main" id="workflow-tree">
              <div class="processList" v-for="(item,index) in processDivs" :key="index"
                   :class="{'processListActive' : activeNum == index}" @click.stop="clickProcess(item,index)">
                {{index + 1}}、{{item.workflowName}}
                <el-button type="text" icon="el-icon-delete" class="remove-btn" size="small" @click.stop="del(item)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" style="padding-top: 12px;">
        <div class="widget-box">
          <div class="widget-header">
            <h5 class="widget-title" style="color: #333333;">流程信息</h5>
            <div class="widget-toolbar">
              <el-button type="primary" size="small" @click="submitForm('basicForm')">
                <i class="el-icon-check"></i>
                确定保存
              </el-button>
            </div>
          </div>
          <div class="widget-body">
            <div class="widget-main">
              <el-form v-loading="vm.dataLoading" :model="basicForm" :rules="basicRules" ref="basicForm" size="small" label-width="120px">
                <div class="title">基本信息</div>
                <div class="workflow-form">
                <el-form-item label="流程审批名称" prop="workflowName">
                  <el-input v-model="basicForm.workflowName"></el-input>
                </el-form-item>
                <el-form-item label="所属服务目录" prop="filterId">
                  <el-cascader ref="serviceCascader" :options="catalogOption" placeholder="请选择所属服务目录" style="width: 100%;"
                               v-model="basicForm.filterId" :props="catalogProps" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="发布状态" prop="publicStatus">
                  <el-select v-model="basicForm.publicStatus" placeholder="请选择发布状态" style="width: 100%;">
                    <el-option label="未发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否公开" prop="locking">
                  <el-select v-model="basicForm.locking" placeholder="请选择是否公开" style="width: 100%;">
                    <el-option label="未公开" value="0"></el-option>
                    <el-option label="已公开" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                  <el-input type="textarea" v-model="basicForm.description"></el-input>
                </el-form-item>
                </div>
                <div class="title">审批设置</div>
                <div class="workflow-form">
                <el-timeline>
                  <el-timeline-item placement="top" v-for="(item,index) in basicForm.workflowDefine.nodes" :key="index" :timestamp="'节点名称：【' + item.nodeName+'】'">
                    <el-card style="padding: 20px;">
                      <div class="handle-delete">
                        <el-tooltip class="item" effect="dark" content="移除节点" placement="top">
                          <el-button @click="basicForm.workflowDefine.nodes.splice(index,1)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                      </div>
                      <el-form-item label="流程节点名称" :prop="'workflowDefine.nodes[' + index + '].nodeName'"
                                    :rules="{
                                    required: true, message: '节点名称不能为空', trigger: 'blur'
                                  }">
                        <el-input v-model="item.nodeName"
                                  placeholder="请输入流程节点名称"></el-input>
                      </el-form-item>
                      <el-form-item label="是否会签">
                        <el-select v-model="item.countersignMode" placeholder="请选择是否会签" style="width: 100%;">
                          <el-option label="是" value="1"></el-option>
                          <el-option label="否" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="指定审核类型" :prop="'workflowDefine.nodes[' + index + '].routeRule.type'"
                                    :rules="{
                                    required: true, message: '审核类型不能为空', trigger: 'change'
                                  }">
                        <el-select v-model="item.routeRule.type" placeholder="请选择指定审核类型" style="width: 100%;">
                          <el-option label="指定审核人员" value="people"></el-option>
                          <el-option label="指定角色" value="role"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="审核人员" v-if="item.routeRule.type.indexOf('people') > -1">
                        <el-button type="primary" circle icon="el-icon-plus" size="small" @click="openPerson(index)" title="添加审批人"></el-button>
                        <div class="approval-user-list">
                          <el-tag v-for="(name,i) in item.routeRule.people" @close="removeUser(item,i)" :key="i" size="medium" closable>
                            {{name.realName}}
                          </el-tag>
                        </div>

                      </el-form-item>
                      <el-form-item label="角色选择"
                                    :prop="'workflowDefine.nodes[' + index + '].routeRule.role'"
                                    :rules="{
                                      required: true, message: '角色不能为空', trigger: 'change'
                                    }"
                                    v-if="item.routeRule.type.indexOf('role') > -1">
                        <el-cascader
                          ref="cascader"
                          :options="roleOption"
                          :props="roleProps"
                          v-model="item.routeRule.roleIds"
                          clearable
                          style="width: 100%;">
                        </el-cascader>
                      </el-form-item>
                      <el-form-item label="部门类型选择"
                                    :prop="'workflowDefine.nodes[' + index + '].routeRule.dep.type'"
                                    :rules="{
                                      required: true, message: '部门类型不能为空', trigger: 'change'
                                    }"
                                    v-if="item.routeRule.type.indexOf('role') > -1">
                        <el-select v-model="item.routeRule.dept.type" placeholder="请选择部门类型" style="width: 100%;">
                          <el-option label="申请人本级部门" value="1"></el-option>
                          <el-option label="申请人上级部门" value="2"></el-option>
                          <el-option label="申请人下级部门" value="3"></el-option>
                          <el-option label="操作人本级部门" value="4"></el-option>
                          <el-option label="操作人上级部门" value="5"></el-option>
                          <el-option label="操作人下级部门" value="6"></el-option>
                          <el-option label="指定操作部门" value="7"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="添加部门"
                                    :prop="'workflowDefine.nodes[' + index + '].routeRule.dept.data'"
                                    :rules="{
                                      required: true, message: '部门不能为空', trigger: 'change'
                                    }"
                                    v-if="item.routeRule.dept.type == 7 && item.routeRule.type.indexOf('role') > -1">
                        <el-cascader
                          :options="depOption"
                          :props="depProps"
                          v-model="item.routeRule.dept.data"
                          clearable
                          style="width: 100%;">
                        </el-cascader>
                      </el-form-item>
                    </el-card>
                  </el-timeline-item>
                  <el-timeline-item timestamp="添加流程节点" placement="top">
                    <el-card style="padding: 20px">
                      <el-button type="primary" size="small" @click="addNode()">
                        <i class="el-icon-plus"></i>
                        添加流程节点
                      </el-button>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
                </div>
                <el-form-item align="right">
                  <el-button type="primary" @click="submitForm('basicForm')">
                    <i class="el-icon-check"></i>
                    确定保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-col>
        <!--人员信息表-->
        <DepToPerson v-bind:fatherData="tableData" v-bind:opens="opens" v-on:dialogOpen="getOpens" v-on:personParams="getPersonParams"></DepToPerson>
    </el-row>
</template>

<script type="javascript" src="./process.js"></script>
<style scoped lang="less" src="./process.less"></style>
