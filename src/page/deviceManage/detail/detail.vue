<template>
  <div class="detail">
    <div class="leftmain">
      <div class="title">基本信息</div>
      <div class="content">
        <div>
          <div>设备编码：</div>
          <div>{{data.equipCode}}</div>
        </div>
        <div>
          <div>设备名称：</div>
          <div>{{data.equipName}}</div>
        </div>
        <div>
          <div>设备型号：</div>
          <div>{{data.model}}</div>
        </div>
        <div>
          <div>设备类型：</div>
          <div>{{data.typeName}}</div>
        </div>
        <div>
          <div>电机型号：</div>
          <div>{{data.motorType}}</div>
        </div>
        <div>
          <div>定额电压/V：</div>
          <div>{{data.minVoltage}}-{{data.maxVoltage}}</div>
        </div>
        <div>
          <div>定额电流/A：</div>
          <div>{{data.minAmpere}}-{{data.maxAmpere}}</div>
        </div>
        <div style="height: 30px;"></div>
        <div>
          <div>制造厂家：</div>
          <div>{{data.manufacturers}}</div>
        </div>
        <div>
          <div>出厂日期：</div>
          <div>{{data.serviceDate}}</div>
        </div>
        <div>
          <div>使用年限：</div>
          <div>{{data.serviceLife}}</div>
        </div>
        <div>
          <div>安装日期：</div>
          <div>{{data.installDate}}</div>
        </div>
        <div>
          <div>投产日期：</div>
          <div>{{data.serviceDate}}</div>
        </div>
        <div style="height: 30px;"></div>
        <div>
          <div>设备空间：</div>
          <div>{{data.spaceName}}</div>
        </div>
        <div>
          <div>设备状态：</div>
          <div>{{data.status=='use'?"在线":"离线"}}</div>
        </div>
        <div>
          <div>负责人：</div>
          <div>{{data.principalName}}</div>
        </div>
        <div style="border-bottom: 1px solid #E7E7E7;margin-bottom:50px;padding-bottom: 20px;">
          <div>负责人电话：</div>
          <div>{{data.principalPhone}}</div>
        </div>
      </div>
      <div class="content" v-if="data.extension&&data.extension.formFields">
        <div v-for="(item,i) in data.extension.formFields.list" :key="i" v-if="data.extension&&data.extension.formFields">
          <div>{{item.name}}：</div>
          <div>{{item.form_Value}}</div>
        </div>
      </div>
    </div>
    <div class="rightmain">
      <div class="spare">
        <div class="title">可用备件</div>
        <el-table
          :data="okEquip"
          style="width: 100%">
          <el-table-column
            prop="spareName"
            label="备件名称">
          </el-table-column>
          <el-table-column
            prop="spareCode"
            label="备件编码">
          </el-table-column>
          <el-table-column
            prop="spareTypeName"
            label="备件类别">
          </el-table-column>
          <el-table-column
            prop="spareModel"
            label="备件类型">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="spareNum"-->
            <!--label="库存">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="spareUnitName"
            label="单位">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="warehouseName"-->
            <!--label="仓库">-->
          <!--</el-table-column>-->
        </el-table>
      <!--  <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="spare.currentPage"
          :page-sizes="[10, 20, 30, 100]"
          :page-size="spare.rows"
          layout="total, sizes, prev, pager, next"
          :total="spare.total">
        </el-pagination> -->
      </div>
      <div class="record">
        <div class="header">
          <div v-for="(item,i) in record" :key="i" :class='id==i?"active":""' @click='id=i'>{{item}}</div>
        </div>
        <el-table
          :data="recordData"
          style="width: 100%">
          <el-table-column
            prop="spareName"
            label="备件名称">
          </el-table-column>
          <el-table-column
            prop="spareCode"
            label="备件编码">
          </el-table-column>
          <el-table-column
            prop="spareTypeName"
            label="备件类别">
          </el-table-column>
          <el-table-column
            prop="spareModel"
            label="备件类型">
          </el-table-column>
          <el-table-column
            prop="spareNum"
            label="库存">
          </el-table-column>
          <el-table-column
            prop="spareUnitName"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库">
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
       <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="recordPage.currentPage"
          :page-sizes="[10, 20, 30, 100]"
          :page-size="recordPage.rows"
          layout="total, sizes, prev, pager, next"
          :total="recordPage.total">
        </el-pagination> -->
      </div>
    </div>
  </div>
</template>


<script type="javascript" src="./detail.js"></script>
<style scoped lang="less" src="./detail.less"></style>
