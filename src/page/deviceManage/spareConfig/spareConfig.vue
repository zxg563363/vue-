<template>
  <div class="spareConfig">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple">
      <div class="title">
        <div>入库类型</div>
        <div @click="reset('1')"><i class="el-icon-refresh" style="color: #008A00;"></i></div>
      </div>
      <div class="type">
        <el-table :data="inStore" border style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="名称">
          </el-table-column>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delet(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="title">
        <el-input placeholder="添加入库类型" v-model="store.inData"/>
        <el-button @click="addIn">添加</el-button>
      </div>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
      <div class="title">
        <div>出库类型</div>
        <div @click="reset(2)"><i class="el-icon-refresh" style="color: #008A00;"></i></div>
      </div>
      <div class="type">
        <el-table :data="outStore" border style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="名称">
          </el-table-column>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delet(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="title">
        <el-input placeholder="添加入库类型" v-model="store.outData"/>
        <el-button @click="addOut">添加</el-button>
      </div>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
      <div class="title">
        <div>备件单位</div>
        <div @click="reset(3)"><i class="el-icon-refresh" style="color: #008A00;"></i></div>
      </div>
      <div class="type">
        <el-table :data="unit" border style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="名称">
          </el-table-column>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delet(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="title">
        <el-input placeholder="添加入库类型" v-model="store.unitData"/>
        <el-button @click="addUnit">添加</el-button>
      </div>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
      <div class="title">
        <div>备件类型</div>
        <div @click="reset(4)"><i class="el-icon-refresh" style="color: #008A00;"></i></div>
      </div>
      <div class="type">
        <el-table :data="type" border style="width: 100%">
          <el-table-column
            fixed
            prop="name"
            label="名称">
          </el-table-column>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="delet(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="title">
        <el-input placeholder="添加入库类型" v-model="store.TypeData"/>
        <el-button @click="addType">添加</el-button>
      </div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script type="javascript" src="./spareConfig.js"></script>
<style scoped lang="less" src="./spareConfig.less"></style>
