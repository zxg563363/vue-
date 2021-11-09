<template>
  <el-row class="deviceList">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" style="padding-top: 12px;">
      <div class="box box-solid">
        <div class="box-body" id="query-area">
          <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item label="条件筛选：">
              <el-select style="width:210px" clearable v-model="searchData.searchId">
                <el-option v-for="item in optionEquip" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input clearable placeholder="请输入搜索内容" type="text" v-model="searchData.equipName" />
            </el-form-item>
            <el-form-item label="">
              <el-cascader
                v-model="searchData.typeId"
                placeholder="请选择类型"
                :options="typeData"
                :props="{
                  value: 'id',
                  label: 'typeName',
                  checkStrictly: true
                }"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search">
                查询
              </el-button>
              <el-button size="small" @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="box box-solid">
        <div class="box-body">
          <el-button @click="$router.push({name: 'device_add'})" type="primary" size="small">
            <i class="el-icon-plus"></i>
            添加设备
          </el-button>
          <el-tooltip class="item" effect="dark" content="注：以当前查询为导出条件" placement="right">
            <el-button @click="exportEr" size="small">
              <i class="el-icon-download"></i>
              数据导出
            </el-button>
          </el-tooltip>
          <div v-if="vm.printList.length > 0" style="float: right; margin-right: 12px;">
            <el-badge :value="vm.printList.length" :max="99" class="item">
              <el-button @click="vm.qrCodeDialogVisible=true" type="primary" plain size="small">
                <i class="el-icon-printer"></i>
                二维码打印信息
              </el-button>
            </el-badge>
          </div>
        </div>
      </div>
      <div class="content" style="display: flex; flex-direction: row; margin: unset; width: unset;">
        <el-table stripe ref="multipleTable"
                  v-loading="vm.tableDataLoading"
                  :data="listData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column fixed label="设备编码" width="140">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                title="设备二维码"
                trigger="hover">
                <el-image
                  style="width: 150px; height: 150px"
                  :src="'/api-capital/equipments/qr_code/'+scope.row.id"
                  fit="fill"></el-image>
                <el-link :underline="false" title="二维码" type="primary" @click="view(scope.row)" slot="reference">
                  {{scope.row.equipCode}}
                </el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column fixed label="设备名称" align="right" width="260" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipName}}
            </template>
          </el-table-column>
          <el-table-column prop="model" label="型号">
          </el-table-column>
          <el-table-column prop="spaceName" width="140" label="空间">
          </el-table-column>
          <el-table-column prop="typeName" label="设备类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.status}}
            </template>
          </el-table-column>
          <el-table-column prop="producedDate" label="投产日期" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="240">
            <template slot-scope="scope">

              <el-button  @click="$router.push({name: 'device_update', params:{uuId: scope.row.id}})" type="text" size="small">
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button @click="delet(scope.row)" type="text" size="small">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
              <el-button @click="addToPrint(scope.row)" type="text" size="small">
                <i class="el-icon-plus"></i>
                添加二维码下载
              </el-button>
              <!-- <el-button @click="erweima(scope.row)" type="text" size="small">生成二维码</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <el-pagination @current-change="handleCurrentChange" background layout="total, prev, pager, next, sizes" :total="totalData"
          :page-size="10" :current-page.sync="pageSize">
        </el-pagination>
      </div>

      <el-dialog
        title="二维码下载列表"
        :visible.sync="vm.qrCodeDialogVisible"
        :close-on-click-modal="false"
        :show-close="false"
        width="700px">
        <el-table stripe :data="vm.printList"
                  v-loading="vm.exportDataLoading"
                  tooltip-effect="dark" max-height="400px" style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column prop="equipCode" label="设备编码" min-width="160"></el-table-column>
          <el-table-column label="设备名称" min-width="170" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.equipName}}
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="设备类型" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="vm.printList.splice(scope.$index,1)" type="text" size="small">
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="vm.qrCodeDialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" size="small" :loading="vm.exportDataLoading" @click="downloadQRCodeTag">确定下载({{vm.printList.length}})</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./deviceList.js"></script>
<style scoped lang="less" src="./deviceList.less"></style>
