<template>
    <div class="depToPerson">
        <el-dialog width="940px" :title="'选择成员添加'" :show-close="false" :visible.sync="opens"
                   @opened="getTree"
                   :before-close="closeDialog">
          <el-row>
            <el-col :span="24">
              <el-form :inline="true" label-width="90px" class="demo-form-inline">
                <el-form-item label="组织机构">
                  <el-cascader
                    size="mini"
                    v-model="departId"
                    :options="depTreeDatas"
                    :props="depProps"
                    clearable></el-cascader>
                </el-form-item>
                <el-form-item label="关键字">
                  <el-input
                    size="mini"
                    placeholder="人员姓名、手机号、账号"
                    v-model="key"
                    clearable>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="getUsers(departId)" type="primary" size="mini">搜索</el-button>
                  <el-button @click="()=>{departId='', key='',getUsers(departId)}" size="mini">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="19">
              <el-table :data="userTableData"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0,0)"
                        :default-sort = "{prop: '', order: 'descending'}"
                        :row-class-name="tableRowClassName">
                <el-table-column type="index" label="序号" width="65" align="center"></el-table-column>
                <el-table-column prop="realName" label="人员姓名"></el-table-column>
                <el-table-column prop="userPhone" label="手机号"></el-table-column>
                <el-table-column prop="account" label="账号"></el-table-column>
                <el-table-column prop="organizationName" label="所属机构"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-folder-add" @click="addUserToTable(scope.row)">添加成员</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="rows"
                layout="total, prev, pager, next"
                :total="total"
                align="center"
                background>
              </el-pagination>
            </el-col>
            <el-col :span="5">
              <div class="widget-box">
                <div class="widget-header">
                  <h5 class="widget-title" style="color: #333333;">已选成员({{tableData.length}})</h5>
                </div>
                <div class="widget-body">
                  <div class="widget-main" id="choose-user-list">
                    <el-tag v-for="(item,index) in tableData" :key="index" size="small" :title="item.realName"
                            @close="delUserToTable(item,index)"
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
    </div>
</template>

<script src="./index.js"></script>
<style scoped lang="less">
    .depToPerson{
        /deep/ .el-form-item__label{
          font-size: 13px;
          font-weight: bold;
        }
        /deep/ .el-form--inline .el-form-item{
          margin-bottom: 6px;
        }
        .addUserTree{
            max-height: 360px;
            overflow-y: auto;
        }
        .addUserTree::-webkit-scrollbar-track-piece {
            background: #eee !important;
        }
        .addUserTree::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
        .addUserTree::-webkit-scrollbar-thumb {
            background: #ddd !important;
            border-radius: 20px !important;
        }
        .usersDiv{
            height: 510px;
            width: 119px;
            margin-bottom: 20px;
            overflow-y: scroll;
        }
        .usersDiv::-webkit-scrollbar-track-piece {
            background: #eee !important;
        }
        .usersDiv::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
        .usersDiv::-webkit-scrollbar-thumb {
            background: #ddd !important;
            border-radius: 20px !important;
        }
        .nameItem{
            width: 100px;
            font-size: 14px;
            text-align: center;
            line-height: 39px;
            height: 40px;
            background: #1C89E8;
            color: #fff;
            border-radius: 8px;
            margin-top: 10px;
            span{
                margin-right: 10px;
                font-size: 20px;
                cursor: pointer;
                float: right;
            }
        }
      #choose-user-list {
        padding: 0 0 12px 0;
        max-height: 355px;
        overflow-y: auto;
        .el-tag--small {
          margin-top: 10px;
          margin-right: 10px;
        }
      }
    }
</style>
