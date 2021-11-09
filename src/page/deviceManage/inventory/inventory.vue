<template>
  <div class="inventory">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content" v-if="isShow">
      <div class="header">
        <el-button @click="putin">入库</el-button>
        <el-button @click="outin">出库</el-button>
      <!--  <el-button @click="okPart" style="width: 150px;">设备类型可用备件</el-button> -->
        <el-button class="f" @click='init'>重置</el-button>
        <el-button class="f" @click='search'>查询</el-button>
        <el-input placeholder="请输入查询内容" class="f" v-model="searchValue"/>
      </div>
      <div v-if="isShow">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="spareName" label="备件名称">
          </el-table-column>
          <el-table-column prop="spareCode" label="备件编号">
          </el-table-column>
          <el-table-column prop="spareTypeName" label="备件类型">
          </el-table-column>
            <el-table-column prop="spareModel" label="备件规格">
          </el-table-column>
          <el-table-column prop="spareUnitName" label="备件单位">
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称">
          </el-table-column>
          <el-table-column prop="spareNum" label="库存数量">
          </el-table-column>
          <el-table-column prop="safeNum" label="安全库存">
          </el-table-column>
          <el-table-column prop="aaa" label="警告">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="setSafe(scope.row)" type="text" size="small" style="margin-right: 30px;">设置安全库存</el-button>
             <!-- <el-button @click="okPart(scope.row)" type="text" size="small" style="margin-right: 30px;">可用设备类型</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="paging">
          <el-pagination @current-change="handleCurrentChange" background layout="total,prev, pager, next" :total="totalData" :page-size="8" :current-page.sync="pageSize">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="isShowIn" class="modal">
      <div class="modal-header">
        <div></div>
        <div>备件入库</div>
        <div>
          <el-button @click="hide">返回</el-button>
          <el-button @click="inStoreD">保存</el-button>
        </div>
      </div>
      <div>
        <el-table :data="addTr" style="width: 100%" border v-if="isShowIn">
          <el-table-column prop="spearName" label="名称" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.spareName" placeholder="请输入关键词" @change="changeInput(scope.$index,$event)" filterable :loading="loading" :remote-method="remoteMethod" remote value-key='id'>
                <el-option v-for="(item,index) in options" :label="item.spareName" :value="item" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="spareCode" label="编号" >
          </el-table-column>
          <el-table-column prop="spareTypeName" label="类别">
            <template slot-scope="scope">
              <el-input type="text" :value="scope.row.spareTypeName" disabled/>
            </template>
          </el-table-column>
          <el-table-column prop="spareModel" label="备件规格">
          </el-table-column>
          <el-table-column prop="spareUnitName" label="单位">
            <template slot-scope="scope">
              <el-select type="text" :value="scope.row.spareUnitName" disabled></el-select>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库">
            <template slot-scope="scope">
               <el-select type="text" v-model="scope.row.warehouseName" @change="aaa(scope.$index,$event)" value-key='id'>
                 <el-option v-for="(item,index) in partData" :label="item.warehouseName" :value="item" :key="index"></el-option>
               </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="orderAction" label="入库类型">
           <template slot-scope="scope">
              <el-select type="text" v-model="scope.row.order"  @change="bbb(scope.$index,$event)" value-key='id'>
                <el-option v-for="(item,index) in inStore" :label="item.name" :value="item" :key="index"></el-option>
              </el-select>
           </template>
          </el-table-column>
          <el-table-column prop="changeNum" label="数量">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.changeNum"/>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="delet(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addTbody">添加</el-button>
      </div>
    </div>
    <div v-if='isShowOut' class="modal">
        <div class="modal-header">
          <div></div>
          <div>备件出库</div>
          <div>
            <el-button type="info" @click="hide">返回</el-button>
            <el-button @click="outStoreD" type="primary">保存</el-button>
          </div>
        </div>
      <div>
        <el-table :data="addOut" style="width: 100%" border v-if='isShowOut'>
          <el-table-column prop="spearName" label="名称" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.spareName" placeholder="请输入关键词" @change="changeInputOut(scope.$index,$event)" filterable :loading="loading" :remote-method="remoteMethodOut" remote>
                <el-option v-for="(item,index) in optionOut" :label="item.spareName" :value="item" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="spareCode" label="编号" >
          </el-table-column>
          <el-table-column prop="spareTypeName" label="类别">
            <template slot-scope="scope">
              <el-input type="text" :value="scope.row.spareTypeName" disabled/>
            </template>
          </el-table-column>
          <el-table-column prop="spareModel" label="备件规格">
          </el-table-column>
          <el-table-column prop="spareUnitName" label="单位">
            <template slot-scope="scope">
              <el-select type="text" :value="scope.row.spareUnitName" disabled></el-select>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库">
            <template slot-scope="scope">
              <el-select type="text" :value="scope.row.warehouseName" disabled></el-select>
            </template>
          </el-table-column>
          <el-table-column prop="orderAction" label="出库类型">
           <template slot-scope="scope">
              <el-select type="text" v-model="scope.row.order"  @change="outAction(scope.$index,$event)" value-key='id'>
                <el-option v-for="(item,index) in outStore" :label="item.name" :value="item" :key="index"></el-option>
              </el-select>
           </template>
          </el-table-column>
          <el-table-column prop="changeNum" label="数量">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.changeNum"/>
            </template>
          </el-table-column>
          <el-table-column prop="spareNum" label="库存">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="delet(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addTbodyOut">添加</el-button>
      </div>
    </div>
  </div>
</template>

<script type="javascript" src="./inventory.js"></script>
<style scoped lang="less" src="./inventory.less"></style>
