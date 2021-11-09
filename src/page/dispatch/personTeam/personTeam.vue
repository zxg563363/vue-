<template>
  <el-row :gutter="12" class="personTeam">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="6" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">班组信息</h5>
          <div class="widget-toolbar">
            <el-button  type="primary" size="mini" @click="dialogWorkTeam=true,workTeamFrom = {name:''}">
              <i class="el-icon-plus"></i>
              添加班组
            </el-button>
            <el-button  size="mini" @click="getWorkTeamList">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="workTeam-tree">
            <el-tree v-if="workTeamTrees.length>0" ref="workTeamRef"
                     v-loading="vm.dataLoading"
                     :data="workTeamTrees"
                     :props="workTeamProps"
                     :default-expand-all="true"
                     @node-click="getWorkTeamId"
                     node-key="id"
                     :expand-on-click-node="false"
                     highlight-current>
              <span class="custom-tree-node" slot-scope="{node, data}">
                <span>{{ data.name }}</span>
                <span class="tree-extends-op">
                  <el-button type="text" title="编辑"
                             size="mini" @click.stop="modifyWorkTeam(data)">
                    <i class="el-icon-edit"></i>
                    编辑
                  </el-button>
                  <el-button type="text" class="remove-btn" title="删除"
                             size="mini" @click.stop="() => WorkTeamRemove(data)">
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
          <h5 class="widget-title" style="color: #333333;">【{{teamData ? teamData.name : '加载中...'}}】</h5>
          <div class="widget-toolbar">
            <el-button type="primary" size="mini" @click="addPerson">
              <i class="el-icon-plus"></i>
              添加成员
            </el-button>
            <el-button size="mini" @click="getUserList(teamData['id'])">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" stripe
        v-loading="loading">
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="140"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" min-width="140"></el-table-column>
        <el-table-column prop="userEmail" label="邮箱" min-width="140"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          min-width="140px">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定要移除此成员吗？" @confirm="removeUserForWorkTeam(scope.row)">
              <el-button type="text" size="small" class="red" icon="el-icon-delete" slot="reference">移除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

        <!--添加班组-->
        <el-dialog :title="workTeamFrom['id'] ? '编辑班组' : '创建班组'" :visible.sync="dialogWorkTeam" :show-close="false" width="380px">
            <el-form ref="workTeamFrom" :model="workTeamFrom" :rules="workTeamRule" size="small" label-width="100px">
                <el-form-item prop="name" label="班组名称">
                    <el-input v-model="workTeamFrom.name" placeholder="请输入班组名称"></el-input>
                </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="$refs['workTeamFrom'].resetFields(),dialogWorkTeam = false" size="small">取消</el-button>
            <el-button type="primary" @click="submitWorkTeamFrom('workTeamFrom')" :loading="vm.dataLoading" size="small">
              {{workTeamFrom['id'] ? '提交更新': '立即创建'}}
            </el-button>
          </span>
        </el-dialog>

        <!--添加成员弹窗-->
        <el-dialog width="940px" :title="'选择成员'" :visible.sync="drawerAddUser" :before-close="resetSaveUsers">
          <el-row :gutter="6">
            <el-col :span="5">
              <el-tree ref="depTreeRef"
                       style="height: 390px; overflow-y: auto;"
                 :data="depTreeDatas"
                 :props="depProps"
                 :default-expand-all="true"
                 @node-click="getDepId"
                 node-key="departId"
                 :expand-on-click-node="false"
                 highlight-current
                 class="addUserTree">
              </el-tree>
            </el-col>
            <el-col :span="14">
              <el-table :data="userTableData" stripe
                        max-height="390px"
                v-loading="userTableLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0,0)"
                :default-sort = "{prop: '', order: 'descending'}">
                <el-table-column prop="realName" label="员工姓名"></el-table-column>
                <el-table-column prop="account" label="账号"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-folder-add" @click="addUserToTable(scope.row)">添加成员</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24" style="text-align: right;">
                  <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currentPage1"
                    :page-size="6"
                    layout="total, prev, pager, next"
                    :total="total1"
                    align="right"
                    background>
                  </el-pagination>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="5">
              <div class="widget-box">
                <div class="widget-header">
                  <h5 class="widget-title" style="color: #333333;">已选成员({{tableData.length}})</h5>
                </div>
                <div class="widget-body">
                  <div class="widget-main" id="choose-user-list">
                    <el-tag v-for="(item,index) in tableData" :key="index" size="small" :title="item.realName"
                            @close="delUserToTable(item)"
                            closable>
                      {{item.realName | ellipsis(6)}}
                    </el-tag>
                  </div>
                </div>
              </div>

            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetSaveUsers()" size="small">取消</el-button>
            <el-button type="primary" @click="saveUsers()" size="small">保存</el-button>
          </span>
        </el-dialog>

  </el-row>
</template>

<script type="javascript" src="./personTeam.js"></script>
<style scoped lang="less" src="./personTeam.less"></style>
