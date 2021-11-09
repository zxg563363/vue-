<template>
  <el-row :gutter="12" id="spare-list">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

    <el-col :span="6" style="padding-top: 12px;">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">备件类型</h5>
          <div class="widget-toolbar">
            <el-button  type="primary" size="mini" @click="vm.spareDialogFormVisible = true, vm.form={}">
              <i class="el-icon-plus"></i>
              添加类型
            </el-button>
            <el-button  size="mini" @click="getSpareTreeData(),vm.currentNode={},getTableData(1,pageData['pageSize'])">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="spare-tree">
            <el-input v-if="false"
              size="small"
              placeholder="输入关键字进行过滤"
              v-model="vm.filterText">
            </el-input>
            <el-tree
              v-loading="vm.dataLoading[0]"
              ref="tree"
              :filter-node-method="filterNode"
              :data="vm.treeData"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{node, data}">
                <span>{{ data.typeName }}</span>
                <span class="tree-extends-op">
                  <el-button title="编辑类型"
                    type="text"
                    size="small"
                    @click.stop="() => editTreeItem(data)">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button title="添加子类"
                    type="text"
                    size="small"
                    @click.stop="() => appendTreeItem(data)">
                    <i class="el-icon-folder-add"></i>
                  </el-button>
                  <el-button title="添加备件"
                    type="text"
                    size="small"
                    @click.stop="() => addSpareByType(data)">
                    <i class="el-icon-document-add"></i>
                  </el-button>
                  <el-button type="text" class="remove-btn" title="删除类型"
                             size="small" @click.stop="() => removeTreeItem(node, data)">
                    <i class="el-icon-delete"></i>
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
          <h5 class="widget-title" style="color: #333333;" v-if="vm.currentNode.typeName">【{{vm.currentNode.typeName}}】</h5>
          <h5 class="widget-title" style="color: #333333;" v-if="!vm.currentNode.typeName">全部备件</h5>
          <div class="widget-toolbar">
            <el-button v-if="vm.currentNode.typeName" type="primary" size="mini" @click="addSpareByType(vm.currentNode)">
              <i class="el-icon-plus"></i>
              添加备件
            </el-button>
            <el-button size="mini" @click="refreshSpareData()">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <el-table
          v-loading="vm.dataLoading[1]"
          stripe
          max-height="757"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            fixed
            label="备件编号"
            width="160">
            <template slot-scope="scope">
              <!--<el-link title="点击查看" type="primary" @click="viewForm(scope.row.id)">{{scope.row.spareCode}}</el-link>-->
              {{scope.row.spareCode}}
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="spareName"
            label="备件名称"
            min-width="180">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="spareTypeName"
            label="备件类型">
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="spareModel"
            label="备件型号">
          </el-table-column>
          <el-table-column
            width="100"
            prop="spareUnitName"
            label="备件单位">
          </el-table-column>
          <el-table-column
            width="100"
            prop="validity"
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.validity"
                @change="changeStatus(scope.row,scope.row.validity)"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            prop="remark"
            align="center"
            label="备注">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="100px">
            <template slot-scope="scope">
              <el-button @click="editSpare(scope.row)" type="text" size="small" class="red"
                         icon="el-icon-edit">
                编辑
              </el-button>
              <!--<el-popconfirm-->
                <!--title="确定要删除吗？" @confirm="removeSpare(scope.row)">-->
                <!--<el-button type="text" size="small" class="red" icon="el-icon-delete" slot="reference">删除</el-button>-->
              <!--</el-popconfirm>-->
            </template>
          </el-table-column>
        </el-table>

      </div>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-pagination
            background
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
        </el-col>
      </el-row>

      <!--备件类型-->
      <el-dialog title="备件类型" :visible.sync="vm.spareDialogFormVisible" width="30%" :show-close="false">
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form :model="vm.form"  :rules="vm.rules" ref="spareForm" label-width="120px"  size="small">
              <el-form-item label="父级类型" prop="parentTypeName" v-if="vm.form.pId && !vm.form.id">
                <el-input v-model="vm.form.parentTypeName" :readonly="true" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型编码" prop="typeCode">
                <el-input v-model="vm.form.typeCode" autocomplete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="类型名称" prop="typeName">
                <el-input v-model="vm.form.typeName" autocomplete="off" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('spareForm')" size="small">取消</el-button>
          <el-button v-if="!vm.form.id" type="primary" @click="addSpare('spareForm')" size="small">确定</el-button>
          <el-button v-if="vm.form.id" type="primary" @click="updateSpare('spareForm')" size="small">更新</el-button>
        </div>
      </el-dialog>

      <!--添加备件-->
      <el-dialog title="备件信息" :visible.sync="vm.addSpareDialogFormVisible" :close-on-click-modal="false"
                 width="750px" :show-close="false" @opened="spareDialogOpened">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form :model="vm.spareForm"  v-loading="vm.typeTreeDataLoading[0]" :rules="vm.spareRules" ref="addSpareForm" label-width="120px"  size="small">
              <el-form-item label="所属类型" prop="spareTypeName">
                <label style="font-weight: 600;color: #333333;">{{vm.spareForm.spareTypeName}}</label>
              </el-form-item>
              <el-form-item label="备件编码" prop="spareCode">
                <el-input v-model="vm.spareForm.spareCode" autocomplete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="备件名称" prop="spareName">
                <el-input v-model="vm.spareForm.spareName" autocomplete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="备件型号" prop="spareModel">
                <el-input v-model="vm.spareForm.spareModel" autocomplete="off" clearable></el-input>
              </el-form-item>
              <el-form-item label="备件单位" prop="spareUnitCode">
                <el-select v-model="vm.spareForm.spareUnitCode" @change="chooseSpareUnit" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in vm.spareUnits"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea"
                          :rows="2"
                          placeholder="请输入备注"
                          v-model="vm.spareForm.remark"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-position="top" label-width="140px">
              <el-form-item label="备件可用设备类型">
                <div style="max-height: 249px; overflow-y: auto">
                  <el-tree
                    v-loading="vm.typeTreeDataLoading[0]"
                    show-checkbox
                    ref="equipmentTree"
                    :data="vm.equipmentTreeData"
                    node-key="id"
                    :props="vm.props"
                    default-expand-all
                    :expand-on-click-node="true"></el-tree>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addSpareForm')" size="small">取消</el-button>
          <el-button v-if="!vm.spareForm.id" type="primary" @click="saveSpare('addSpareForm')" size="small">确定</el-button>
          <el-button v-if="vm.spareForm.id" type="primary" @click="modifySpare('addSpareForm')" size="small">更新</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
