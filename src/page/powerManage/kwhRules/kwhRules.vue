<template>
  <div class="kwhRules">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="list" v-if="isInit">
      <div class="title">
        <el-button @click="handleAdd">新增规则</el-button>
      </div>
      <div class="content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="对应设备组/单台设备">
          </el-table-column>
          <el-table-column prop="id" label="触发条件">
          </el-table-column>
          <el-table-column prop="id" label="执行操作">
          </el-table-column>
          <el-table-column prop="id" label="接收人/部门">
          </el-table-column>
          <el-table-column prop="id" label="推送方式">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDelet(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="modalAdd" v-if="isWarn">
      <div class="title">
        <div></div>
        <div>新增规则</div>
      </div>
      <div class="content">
        <div>
          <div>规则名称</div>
          <el-input placeholder="请输入规则名称" type="text"></el-input>
        </div>
        <div>
          <div>规则描述：</div>
          <textarea placeholder="请输入规则描述"></textarea>
        </div>
        <div>
          <div>对应设备类型：</div>
          <el-select v-model="addData.method"></el-select>
        </div>
        <div>
          <div>对应设备：</div>
          <el-select v-model="addData.method"></el-select>
        </div>
        <div>
          <div>接收人：</div>
          <el-select v-model="addData.method"></el-select>
        </div>
        <div>
          <div>接收部门：</div>
          <el-select v-model="addData.method"></el-select>
        </div>
        <div>
          <div>推送方式：</div>
          <el-select v-model="addData.method">
            <el-option v-for="item in methodOpt" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <div>触发条件：</div>
          <div class="single">
            <div v-for="(item,i) in data" :key='i'>
             当<el-select v-model="item.VA">
               <el-option value="电压">电压</el-option>
               <el-option value="电流">电流</el-option>
             </el-select>值<el-select v-model="item.More">
               <el-option value="高于">高于</el-option>
               <el-option value="低于">低于</el-option>
             </el-select>预设阈值<el-input placeholder="百分比" type="text" v-model="item.bizhi"></el-input>%时 &nbsp;&nbsp;<span style="color: #ccc;">选择高于时，默认阈值为上线，选择低于时，默认阈值为下限</span></br></br>
             单位时间<el-input placeholder="几分钟内" type="text"></el-input>超过<el-input placeholder="多少次" type="text"></el-input>次
             <el-button  class='f' @click="delet(i)" v-if="clear">删除</el-button>
            </div>
          </div>
          <div class="add" @click="add">+</div>
        </div>
        <div>
          <div>是否执行操作：</div>
          <div style="padding-left: 15px;">
            <el-radio label="1" v-model="radio" @change='aaa'>只推送消息</el-radio>
            <el-radio label="2" v-model="radio" @change='aaa'>推送消息+执行操作</el-radio>
          </div>
        </div>
        <div class="showDoing" v-if="isShowDoing">
          <div></div>
          <div>
            <el-radio label="1" v-model="radio1" @change='bbb'>当前设备停车</el-radio>
            <el-radio label="2" v-model="radio1" @change='bbb'>关联多设备停车</el-radio><br>
            <div style="margin-top: 20px;" v-if="isStopP">
              请选择关联设备：
              <el-select v-model="addData.method" style="width: 800px;">
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button @click="handleHide">返回</el-button>
        <el-button @click="AddPostWarn" v-if="isPost">提交</el-button>
        <!-- <el-button @click="AddPostScram" v-if="isScram">提交</el-button> -->
      </div>
    </div>
  </div>
</template>
<script type="javascript" src="./kwhRules.js"></script>
<style scoped lang="less" src="./kwhRules.less"></style>
