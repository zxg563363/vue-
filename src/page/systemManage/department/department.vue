<template>
    <el-row :gutter="12" class="department">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
      <el-col :span="6" style="padding-top: 12px;">
        <div class="widget-box">
          <div class="widget-header">
            <h5 class="widget-title" style="color: #333333;">组织机构</h5>
            <div class="widget-toolbar">
              <el-button  type="primary" size="mini" @click="depSubmit(3)">
                <i class="el-icon-plus"></i>
                新建部门
              </el-button>
              <el-button  size="mini" @click="depTreeList">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </div>
          <div class="widget-body">
            <div class="widget-main" id="dept-tree">
              <el-tree ref="depTreeRef"
                       v-loading="treeDataLoading"
                       :data="depTrees"
                       :props="depProps"
                       :default-expand-all="true"
                       @node-click="getDepId"
                       node-key="departId"
                       :expand-on-click-node="false"
                       highlight-current>
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span>{{ data.departName }}</span>
                    <span class="tree-extends-op">
                      <el-button type="text" title="编辑"
                                 size="mini" @click.stop="() => depSubmit(1,data)">
                        <i class="el-icon-folder-add"></i>
                        添加子部门
                      </el-button>
                      <el-button type="text" title="编辑"
                                 size="mini" @click.stop="() => depSubmit(2,data)">
                        <i class="el-icon-edit"></i>
                        编辑
                      </el-button>
                      <el-button type="text" class="remove-btn" title="删除"
                                 size="mini" @click.stop="() => depRemove(data)">
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
      <el-col :span="18" style="padding-top: 12px;">
        <div class="widget-box">
          <div class="widget-header">
            <h5 class="widget-title" style="color: #333333;">【{{depHeaderTit ? depHeaderTit : '加载中...'}}】</h5>
            <div class="widget-toolbar">
              <el-button type="primary" size="mini" @click="addPerson(1)">
                <i class="el-icon-plus"></i>
                添加成员
              </el-button>
              <el-button size="mini" @click="getUserList">
                <i class="el-icon-refresh"></i>
                刷新
              </el-button>
            </div>
          </div>
        </div>
        <el-table :data="userTableData"
                  v-loading="userTableLoading"
                  :default-sort = "{prop: '', order: 'descending'}">
          <el-table-column fixed prop="realName" label="员工姓名" min-width="140"></el-table-column>
          <el-table-column fixed prop="account" label="账号" min-width="160"></el-table-column>
          <!--<el-table-column prop="departName" label="所属部门"></el-table-column>-->
          <el-table-column prop="userPhone" label="手机号" min-width="160"></el-table-column>
          <el-table-column prop="userEmail" label="邮箱" min-width="180"></el-table-column>
          <el-table-column prop="validity" label="账号状态" min-width="120">
            <template slot-scope="scope">
              <el-button style="color: #13ce66;cursor: default;" icon="el-icon-circle-check"
                         type="text" size="small" v-if="scope.row.validity == 1">已启用</el-button>
              <el-button style="color: #ff4949;cursor: default;" icon="el-icon-circle-close"
                         type="text" size="small" v-if="scope.row.validity == 0">已禁用</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="text" size="small" @click="addPerson(2,scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
          align="right"
          background>
        </el-pagination>
      </el-col>
        <!--添加部门-->
        <el-dialog :title="depTitle" :visible.sync="dialogDep" :show-close="false" :before-close="depFromClose" width="400px" class="stationFroms">
            <el-form ref="depFrom" :model="depFrom" :rules="depRule" size="small" label-width="110px">
                <el-form-item prop="departName" label="部门名称">
                    <el-input v-model="depFrom.departName" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" v-if="depTitle != '添加一级部门'">
                    <el-input v-model="dep.departName" :disabled="true" v-if="depTitle == '添加部门'"></el-input>
                    <el-input v-model="dep.departNameEdit" :disabled="true" v-if="depTitle == '编辑部门'"></el-input>
                </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetDepForm('depFrom')" size="small">取消</el-button>
            <el-button type="primary" @click="submitDepForm('depFrom')" size="small">{{depFromBtn}}</el-button>
          </span>
        </el-dialog>

        <!--添加成员-->
        <el-dialog :title="userTitle" :visible.sync="dialogUsers" :show-close="false" width="600px" :before-close="usersFromClose">
            <el-form ref="userFrom" :model="userFrom" :rules="userRule" label-width="150px" size="small" class="usersFrom">
                <el-form-item prop="realName" label="姓名（昵称）">
                    <el-input v-model="userFrom.realName" placeholder="请输入姓名（昵称）"></el-input>
                </el-form-item>
                <el-form-item prop="account" label="登陆名" v-if="isAddUser == true">
                    <el-input v-model="userFrom.account" placeholder="请输入登陆名"></el-input>
                </el-form-item>
                <el-form-item prop="userPass" label="登陆默认密码" v-if="isAddUser == true">
                    <el-input v-model="userFrom.userPass" placeholder="请输入登陆默认密码"></el-input>
                </el-form-item>
                <el-form-item prop="userPhone" label="手机号">
                    <el-input v-model="userFrom.userPhone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="userEmail" label="邮箱">
                    <el-input v-model="userFrom.userEmail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="departId" label="所属部门">
                    <el-select v-model="userFrom.departId" placeholder="请选择所属部门" :disabled="depDisabled">
                        <el-option v-for="(item,index) in depList" :label="item.departName"
                                   :value="item.departId" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="validity" label="账号状态" v-if="isAddUser == false">
                    <el-select v-model="userFrom.validity" placeholder="请选择账号状态">
                        <el-option label="关闭" :value="0"></el-option>
                        <el-option label="开启" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetUserForm('userFrom')" size="small">取消</el-button>
            <el-button type="primary" @click="submitUserForm('userFrom')" size="small">{{userTitleBtn}}</el-button>
          </span>
        </el-dialog>
    </el-row>
</template>

<script type="javascript" src="./department.js"></script>
<style scoped lang="less" src="./department.less"></style>
