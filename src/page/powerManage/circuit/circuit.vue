<template>
	<div class="circuit">
		<Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
		<div class="list" v-if="isInit">
			<div class="title">
				<el-button @click="handleAdd">新增</el-button>
			</div>
			<div class="content">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="lineName"
              label="线路名称">
            </el-table-column>
            <el-table-column
              prop="lineCode"
              label="线路编码">
            </el-table-column>
            <el-table-column
              prop="lineAmpere"
              label="线路电流/A">
            </el-table-column>
            <el-table-column
              prop="lineVoltage"
              label="线路电压/V">
            </el-table-column>
            <el-table-column
              prop="address"
              label="线路位置">
            </el-table-column>
            <el-table-column
              prop="valiy"
              label="状态">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelet(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="handleStop(scope.row)">启用/禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
			</div>
		</div>
		<div class="modalAdd" v-else>
      <div class="title">
        <div></div>
        <div>{{title}}</div>
      </div>
      <div class="content">
        <div>
          <div>线路名称：</div>
          <el-input placeholder="请输入线路名称" type="text" v-model="addData.lineName"></el-input>
        </div>
        <div>
          <div>线路编码：</div>
          <el-input placeholder="请输入线路编码" type="text" v-model="addData.lineCode"></el-input>
        </div>
        <div>
          <div>线路电压/V：</div>
          <el-input placeholder="请输入线路规格" type="Number" v-model="addData.lineVoltage"></el-input>
        </div>
        <div>
          <div>线路电流/A：</div>
            <el-input placeholder="请输入线路规格" type="Number" v-model="addData.lineAmpere"></el-input>
        </div>
        <div>
          <div>线路位置：</div>
          <el-input placeholder="请输入线路位置" type="text" v-model="addData.address"></el-input>
        </div>
        <div>
          <div>对应空间：</div>
          <el-tree
            :data="spacesData"
            show-checkbox
            :props="spaceProps"
            ref="tree"
            >
          </el-tree>
        </div>
        <div style="height: 100px;">
          <div>备注：</div>
          <textarea v-model="addData.remark"></textarea>
        </div>
      </div>
      <div class="footer">
        <el-button @click="handleHide">返回</el-button>
        <el-button @click="AddPost" v-if="isAdd">提交</el-button>
        <el-button @click="changePost" v-else>提交</el-button>
      </div>
    </div>
	</div>
</template>
<script type="javascript" src="./circuit.js"></script>
<style scoped lang="less" src="./circuit.less"></style>
