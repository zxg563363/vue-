<template>
	<div class="mind">
		<Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
		<div class="list" v-if="isInit">
			<div class="title">
				<el-button @click="handleAddTerminal">新增采控终端</el-button>
				<el-button @click="handleAddApply">新增通信终端</el-button>
				<el-button @click="reset">重置</el-button>
			</div>
			<div class="content">
          <el-table
             highlight-current-row
            :data="tableData"
            style="width: 100%"
            @row-click="getTerminal">
            <el-table-column
              prop="transmitName"
              label="通信终端名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="transmitCode"
              label="通信终端编码"
              width="120">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="period"
              label="上报周期">
            </el-table-column>
            <el-table-column
              prop="iotNumber"
              label="物联网卡号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="transmitPassword"
              label="终端密码">
            </el-table-column>
           <el-table-column
              prop="valiy"
              label="运行状态">
            </el-table-column>
        <!--   <el-table-column
              prop="id"
              label="累计运行时间">
            </el-table-column>
            <el-table-column
              prop="id"
              label="采集数量">
            </el-table-column> -->
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="150">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="handleView(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click.stop="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click.stop="handleDelet(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click.stop="handleSOS(scope.row)">禁用/启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paging">
            <el-pagination @current-change="handleCurrent" background layout="total,prev, pager, next" :total="totalData"
              :page-size="5" :current-page.sync="pageSize">
            </el-pagination>
          </div>
          <el-table
            :data="tableData1"
            style="width: 100%;margin-top: 30px;">
            <el-table-column
              prop="collectorName"
              label="采控终端名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="collectorCode"
              label="采控终端编码"
              width="120">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="period"
              label="周期">
            </el-table-column>
            <el-table-column
              prop="collectorPassword"
              label="终端密码">
            </el-table-column>
            <el-table-column
              prop="transmit.transmitName"
              label="对应通信终端"
              width="120">
            </el-table-column>
            <el-table-column
              prop="valiy"
              label="运行状态">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="添加时间"
              width="150">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleViewTN(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="handleEditTN(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDeletTN(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="handleSOSTN(scope.row)">禁用/启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paging">
            <el-pagination @current-change="handleCurrentChange" background layout="total,prev, pager, next" :total="totalData0"
              :page-size="5" :current-page.sync="pageSize0">
            </el-pagination>
          </div>
      </div>
		</div>
    <div class="modalAdd" v-if="isViewApply">
      <div class="title">
        <div></div>
        <div>通信终端详情</div>
        <div>
          <el-button @click="handleHide">返回</el-button>
        </div>
      </div>
      <div class="detail">
        <div><span>终端名称：</span>{{applyView.transmitName}}</div>
        <div><span>终端编号：</span>{{applyView.transmitCode}}</div>
        <div><span>终端密码：</span>{{applyView.transmitPassword}}</div>
        <div><span>物联卡卡号：</span>{{applyView.iotNumber}}</div>
        <div><span>周期：</span>{{applyView.period}}</div>
      </div>
    </div>
    <div class="modalAdd" v-if="isViewTerminal">
      <div class="title">
        <div></div>
        <div>采控终端详情</div>
        <div>
          <el-button @click="handleHide">返回</el-button>
        </div>
      </div>
      <div class="detail">
        <div><span>终端名称：</span>{{terminalView.collectorName}}</div>
        <div><span>终端编号：</span>{{terminalView.collectorCode}}</div>
        <div><span>终端密码：</span>{{terminalView.collectorPassword}}</div>
        <div><span>周期：</span>{{terminalView.period}}</div>
        <div><span>最大电压：</span>{{terminalView.maxVoltage}}V</div>
        <div><span>最小电压：</span>{{terminalView.minVoltage}}V</div>
        <div><span>最大电流：</span>{{terminalView.maxAmpere}}A</div>
        <div><span>最小电流：</span>{{terminalView.minAmpere}}A</div>
        <div v-if="terminalView.equips&&terminalView.equips[0].equipName"><span>设备类型：</span>{{terminalView.equips[0].equipName}}</div>
        <div><span>对应通信终端：</span>
        <span v-if="terminalView.transmit&&terminalView.transmit.transmitName">{{terminalView.transmit.transmitName}}</span>
        </div>
      </div>
    </div>
		<div class="modalAdd" v-if="isTerminal">
      <div class="title">
        <div></div>
        <div>{{title}}</div>
        <div>
          <el-button type="info" @click="handleHide">返回</el-button>
          <el-button type="primary" @click="AddPostTerminal" v-if="isAdd">提交</el-button>
          <el-button type="primary" @click="changePostTerminal" v-else>修改</el-button>
        </div>
      </div>
      <div class="content">
        <div>
          <span>终端名称：</span>
          <el-input placeholder="请输入终端名称" type="text" v-model="addTerminal.collectorName"></el-input>
        </div>
        <div>
          <span>终端编号：</span>
          <el-input placeholder="请输入终端编号" type="text" v-model="addTerminal.collectorCode"></el-input>
        </div>
        <div>
          <span>电压范围/V：</span>
          <el-input placeholder="请输入最小电压" type="text" v-model="addTerminal.minVoltage" style="width: 375px;"></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
          <el-input placeholder="请输入最大电压" type="text" v-model="addTerminal.maxVoltage" style="width: 375px;"></el-input>
        </div>
        <div>
          <span>电流范围/A：</span>
          <el-input placeholder="请输入最小电流" type="text" v-model="addTerminal.minAmpere" style="width: 375px;"></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
          <el-input placeholder="请输入最大电流" type="text" v-model="addTerminal.maxAmpere" style="width: 375px"></el-input>
        </div>
        <div>
          <span>周期：</span>
          <el-input placeholder="请输入终端版本" type="text" v-model="addTerminal.period"></el-input>
        </div>
        <div>
          <span>终端密码：</span>
          <el-input placeholder="请输入终端密码" type="text" v-model="addTerminal.collectorPassword"></el-input>
        </div>
        <div>
          <span>对应通信终端：</span>
          <el-select v-model="addTerminal.transmitId">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.transmitName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div @click="choose" v-if="isAdd" >
          <span>对应设备：</span>
          <el-input placeholder="请输入对应设备" type="text" readonly v-model="addTerminal.equipName"/>
        </div>
        <div v-else>
          <span>对应设备：</span>
          <el-tag closable @close="handleClose" v-if="isQuip">
            {{addTerminal.equipName}}
          </el-tag>
          <div @click="choose" v-else>
            <el-input placeholder="请输入对应设备" type="text" readonly v-model="addTerminal.equipName"style="width:265%;"/>
          </div>
        </div>
        <div style="height: 100px;">
          <span>备注：</span>
          <el-input v-model="addTerminal.remark" type="textarea"></el-input>
        </div>
      </div>
    </div>
    <div>
      <el-dialog  title="对应设备" :visible.sync="isChoose">
      <!-- <div class="modal-title">
          搜索设备：<el-input type="text"/>
        </div> -->
        <div class="modal-main" v-if="isAdd">
          <div v-for="(item,i) in typeData" :key='i' @click="chooseType(item)">
            {{item.equipName}}({{item.equipCode}})
          </div>
        </div>
        <div class="modal-main" v-else>
          <div v-for="(item,i) in typeData" :key='i' @click="changeType(item)">
            设备名称:{{item.equipName}}<br>编码:{{item.equipCode}}
          </div>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div> -->
      </el-dialog>
    </div>
    <div class="modalAdd" v-if="isApply">
      <div class="title">
        <div></div>
        <div>{{title}}</div>
        <div>
          <el-button type="info" @click="handleHide">返回</el-button>
          <el-button type="primary" @click="AddPostApply" v-if="isAdd">提交</el-button>
          <el-button type="primary" @click="changePostApply" v-else>修改</el-button>
        </div>
      </div>
      <div class="content">
        <div>
          <span>终端名称：</span>
          <el-input placeholder="请输入终端名称" type="text" v-model="addApply.transmitName"></el-input>
        </div>
        <div>
          <span>终端编号：</span>
          <el-input placeholder="请输入终端编号" type="text" v-model="addApply.transmitCode"></el-input>
        </div>
        <div>
          <span>终端密码：</span>
          <el-input placeholder="请输入终端密码" type="text" v-model="addApply.transmitPassword"></el-input>
        </div>
        <div>
          <span>数据上报周期：</span>
          <el-input placeholder="请输入数据上报周期" type="text" v-model="addApply.period"></el-input>
        </div>
        <div>
          <span>物联网卡号：</span>
          <el-input placeholder="请输入物联网卡号" type="text" v-model="addApply.iotNumber"></el-input>
        </div>
        <div style="height: 100px;">
          <span>备注：</span>
          <el-input v-model="addApply.remark" type="textarea"></el-input>
        </div>
      </div>
    </div>
	</div>
</template>
<script type="javascript" src="./mind.js"></script>
<style scoped lang="less" src="./mind.less"></style>
