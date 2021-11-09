<template>
    <el-row :gutter="12" class="station">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
        <el-col :span="5" style="padding-top: 12px;">
          <div class="widget-box">
            <div class="widget-header">
              <h5 class="widget-title" style="color: #333333;">岗位角色</h5>
              <div class="widget-toolbar">
                <el-button  type="primary" size="mini" @click="addGroup(1)">
                  <i class="el-icon-plus"></i>
                  新建分组
                </el-button>
                <el-button  size="mini" @click="addTree">
                  <i class="el-icon-refresh"></i>
                  刷新
                </el-button>
              </div>
            </div>
            <div class="widget-body">
              <div class="widget-main" id="role-tree">
                <el-tree :data="treeArr"
                         v-loading="dataLoading"
                         :props="groupProps"
                         :default-expand-all="true"
                         @node-click="getTreeId"
                         highlight-current>
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span>{{ data.name }}</span>
                    <span v-if="('child' in data) || (data.uuId == 'default_group') || (data.pId=='0')" class="tree-extends-op">
                      <el-button type="text" title="添加角色"
                                 size="mini" @click.stop="() => addStation(1, data)">
                        <i class="el-icon-circle-plus"></i>
                        添加角色
                      </el-button>
                      <el-button type="text" title="编辑分组"
                             size="mini" @click.stop="() => addGroup(2,data)">
                        <i class="el-icon-edit"></i>
                        编辑
                      </el-button>
                      <el-button type="text" class="remove-btn" title="删除"
                                 size="mini" @click.stop="() => delGroup(data)">
                        <i class="el-icon-delete"></i>
                        删除
                      </el-button>
                    </span>
                    <span v-else class="tree-extends-op">
                      <el-button type="text" title="编辑角色"
                                 size="mini" @click.stop="() => addStation(2,data)">
                        <i class="el-icon-edit"></i>
                        编辑
                      </el-button>
                      <el-button type="text" class="remove-btn" title="删除角色"
                                 size="mini" @click.stop="() => delRole(data)">
                        <i class="el-icon-delete"></i>
                        删除
                      </el-button>
                    </span>
                  </span>

                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="19" style="padding-top: 12px;">
          <el-tabs v-if="showRight" type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="users">
              <span slot="label">角色成员</span>
              <div class="clearfix">
                <el-button class="fr" type="primary" size="small" @click="addPerson()">添加成员</el-button>
              </div>
              <el-table :data="tableData"
                        stripe
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.3)"
                        :default-sort = "{prop: '', order: 'descending'}">
                <el-table-column type="index" label="序号" width="85"></el-table-column>
                <el-table-column prop="realName" label="姓名"></el-table-column>
                <el-table-column prop="account" label="账号"></el-table-column>
                <el-table-column prop="userPhone" label="手机号">
                  <template slot-scope="scope">
                    <span v-if="scope.row.userPhone">{{scope.row.userPhone}}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="userEmail" label="邮箱">
                  <template slot-scope="scope">
                    <span v-if="scope.row.userEmail">{{scope.row.userEmail}}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-delete" size="small" @click="delStation(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="menus">
              <div class="clearfix">
                <el-button class="fr" type="primary" size="small" @click="saveMenu()">保存设置</el-button>
              </div>
              <el-tree
                ref="treeMenu"
                :data="menuTree"
                show-checkbox
                node-key="actId"
                :default-expand-all="true"
                :props="defaultProps"
                class="stationMenuTree"
                @check-change="getMenuTreeId">
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="数据范围" name="scope">
              <el-button class="fr" type="primary" size="small" @click="saveRange()">保存设置</el-button>
              <el-table :data="thirdData"
                        stripe
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.3)"
                        :default-sort = "{prop: '', order: 'descending'}">
                <el-table-column type="index" label="序号" width="85"></el-table-column>
                <el-table-column prop="actName" label="功能名"></el-table-column>
                <el-table-column prop="userName" label="查看数据范围">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.actScope" size="small" placeholder="请选择数据范围">
                      <el-option
                        v-for="(item,index)  in scopeList"
                        :key="index"
                        :label="item.name"
                        :value="item.radioNum">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <el-card v-if="!showRight" class="box-card" style="height: 500px;">
            <el-empty description="暂无数据" :image-size="200" style="width: 200px; margin: 0 auto; text-align: center;"></el-empty>
          </el-card>
        </el-col>

        <!--新增角色-->
        <el-dialog :title="stationTitle" :visible.sync="dialogStation" :show-close="false" width="480px" :before-close="fromClose" class="stationFroms">
            <el-form ref="stationFrom" :model="stationFrom" :rules="stationRule" size="small"  label-width="100px">
                <el-form-item prop="roleName" label="角色名">
                    <el-input v-model="stationFrom.roleName" placeholder="请输入角色名"></el-input>
                </el-form-item>
                <el-form-item prop="groupId" label="角色组">
                    <el-select v-model="stationFrom.groupId" placeholder="请选择角色组">
                        <el-option v-for="(item,index) in groupList" :label="item.name" :value="item.uuId" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="roleDescribe" label="角色描述">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 3 }"
                            placeholder="请输入角色描述"
                            v-model="stationFrom.roleDescribe">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="resetForm('stationFrom')" size="small">取消</el-button>
              <el-button type="primary" @click="submitForm('stationFrom')" size="small">{{stationBtn}}</el-button>
            </span>
        </el-dialog>

        <!--新增分组-->
        <el-dialog :title="addGroupTitle" :visible.sync="dialogGroup" :show-close="false" width="450px" :before-close="fromCloseGroup" class="stationFroms">
            <el-form ref="groupFrom" :model="groupFrom" :rules="groupRules" size="small" label-width="100px">
                <el-form-item prop="groupName" label="分组名称">
                    <el-input v-model="groupFrom.groupName" placeholder="请输入分组名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="resetGroupForm('groupFrom')" size="small">取消</el-button>
              <el-button type="primary" @click="submitGroupForm('groupFrom')" size="small">{{groupBtn}}</el-button>
            </span>
        </el-dialog>

      <!--人员信息表-->
      <DepToPerson v-bind:fatherData="tableData" v-bind:opens="drawerAddUser" v-on:dialogOpen="addPerson" v-on:personParams="saveUsers"></DepToPerson>
    </el-row>
</template>

<script type="javascript" src="./station.js"></script>
<style scoped lang="less" src="./station.less"></style>
