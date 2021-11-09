<template>
  <el-row class="workflow">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <el-col :span="24" class="content">
      <el-header class="title" v-if="addData.status!='CANCEL'" style="height: unset; text-align: right;">
        <el-button v-if="addData.status!='OK'" type="primary" plain size="mini" @click='edit' style="float: left;">
          <i class="el-icon-edit"></i>
          编辑
        </el-button>
        <el-button @click="back" size="small">
          <i class="el-icon-back"></i>
          返回
        </el-button>
        <!--<el-button @click="cancel"  type="danger" size="small">取消工单</el-button>-->
           <el-button v-if="addData.canDispose"
                      @click="aduitShow = true"
                      type="danger" size="small">
             {{addData.status == 'DELAY' ? '延期审批': '工单审批'}}
           </el-button>
          <el-button @click='start' type="primary" size="small" v-if="addData.status=='WAITING'&&addData.receiverId== userinfo&&(addData.approval==0||addData.approval==1)">
            <i class="el-icon-caret-right"></i>
            开始工单
          </el-button>
          <el-button @click='endVisible=true' size="small" type="primary"
                     v-if="(addData.status=='DOING' || addData.status=='DELAY') && userinfo==addData.receiverId">
            完成工单
          </el-button>
          <el-button @click="transferOrder" type="primary" size="small" v-if="addData.status!='OK' && addData.status != 'DELAY'">{{title}}</el-button>
          <el-button type="primary" plain size="small" @click="vm.dialogRemarksVisible=true">添加备注</el-button>
          <!--<el-button v-if="addData.status!='OK'"  type="warning" size="small" @click='reminder'>催单</el-button>-->
          <el-dropdown v-if="addData.status!='OK'" trigger="click"  @command="moreOperations">
            <el-button size="small" type="primary" plain>
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="cancel">取消工单</el-dropdown-item>
              <el-dropdown-item command="delay"
                                v-if="addData.status=='DOING' && addData.slaLevelId">工单延期</el-dropdown-item>
              <el-dropdown-item command="urge">催单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-header>
      <el-header class="title" v-else style="text-align: right;">
        <el-button @click="back" size="small">
          <i class="el-icon-back"></i>
          返回
        </el-button>
      </el-header>

      <WorkOrderDetail :uuid="uuId" :completed="init">
        <template v-slot:collaborator v-if="addData.status !='DONE' && addData.status !='CANCEL'">
          <div class="addP" @click="synergicPer" style="margin: 0 10px;"><i class="el-icon-circle-plus-outline"></i>添加协作人</div>
          <div v-for="(item,i) in addData.teams" :key="i" style="margin-right: 10px;font-size: 13px;">
            {{item.synergicUserName}}
            <el-popconfirm title="确定删除吗？" @confirm="deletPer(item,i)">
              <span slot="reference" style="color: red;">
                <i class="el-icon-delete"></i>
              </span>
            </el-popconfirm>
          </div>
        </template>
      </WorkOrderDetail>

      <DepToPerson v-bind:fatherData="tableData" v-bind:opens="opens" v-on:dialogOpen="getOpens"
                   v-on:personParams="getPersonParams"></DepToPerson>
      <el-dialog :title="'满意度评价['+uuId+']'" :visible.sync="evaluate">
        <div class="evalue">
          <el-form :model="form">
            <el-form-item label="满意度:">
              <el-radio-group v-model="form.satisfaction">
                  <el-radio :label="2">好评</el-radio>
                  <el-radio :label="1">中评</el-radio>
                  <el-radio :label="0">差评</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评价内容:">
             <el-input v-model="form.idea" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="维修速度:">
             <el-rate
               v-model="form.processing"
               show-text>
             </el-rate>
            </el-form-item>
            <el-form-item label="服务态度:">
              <el-rate
                v-model="form.serve"
                show-text>
              </el-rate>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="evaluate = false" size="small">取消</el-button>
          <el-button type="primary" @click="postValue" size="small">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="modalTitle" :visible.sync="dialogFormVisible" width="500px" :show-close="false">
        <el-form :model="data" size="small">
          <el-form-item>
            <el-input v-model="data.receipt" type="textarea" :placeholder="modalTitle"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="confirm" size="small" v-if="modalTitle=='取消工单说明'">确定</el-button>
          <el-button type="primary" @click="confirmRemin" size="small" v-if="modalTitle=='催单说明'">确定</el-button>
        </div>
      </el-dialog>

      <!--添加备注-->
      <el-dialog title="添加备注" width="500px" :show-close="false" :visible.sync="vm.dialogRemarksVisible">
        <el-form :model="vm.orderRemarks" label-width="120px" size="small">
          <el-form-item label="备注说明">
            <el-input v-model="vm.orderRemarks.remark" type="textarea" autosize placeholder="请填写备注说明"></el-input>
          </el-form-item>
          <!--<el-form-item label="附件">-->

          <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="vm.dialogRemarksVisible=false" size="small">取消</el-button>
          <el-button type="primary" @click="submitRemark" :loading="!vm.dialogRemarksVisible" size="small">确定</el-button>
        </div>
      </el-dialog>

      <!--审批-->
      <el-dialog :title="addData.status == 'DELAY' ? '延期审批' : '工单审批'"  width="500px" :show-close="false" :visible.sync="aduitShow">
        <el-form label-suffix="：" size="small" label-width="120px" :model="aduitData" :v-loading="vm.delayLoading">
          <el-form-item label="审核">
            <el-radio-group v-model="aduitData.agree">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input v-model="aduitData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="aduitShow=false" size="small">取消</el-button>
          <el-button type="primary" @click="confirmAduit" size="small" :v-loading="vm.delayLoading">确定</el-button>
        </div>
      </el-dialog>

      <!--延期申请-->
      <el-dialog title="延期申请" :visible.sync="vm.opMap.delay.display"
                 :close-on-click-modal="false"
                 @opened="vm.opMap.delay.getProcess()"
                 :show-close="false" width="600px">
        <el-form :model="vm.opMap.delay.formData"
                 ref="delayForm"
                 label-suffix="："
                 :rules="vm.opMap.delay.rules"
                 size="small" label-width="140px" v-loading="vm.opMap.delay.loading">
          <el-form-item label="延期时间" prop="delayTime">
            <el-date-picker
              v-model="vm.opMap.delay.formData.delayTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="延期事由" prop="cause">
            <el-input v-model="vm.opMap.delay.formData.cause" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="延期审批流程" prop="useWorkFlowId">
            <el-select v-model="vm.opMap.delay.formData.useWorkFlowId" clearable placeholder="请选择">
              <el-option
                v-for="item in vm.opMap.delay.processList"
                :key="item.workflowId"
                :label="item.workflowName"
                :value="item.workflowId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="vm.opMap.delay.display = false" size="small">取消</el-button>
          <el-button type="primary" @click="vm.opMap.delay.confirm" :loading="vm.opMap.delay.loading" size="small">确定</el-button>
        </div>
      </el-dialog>

      <!--解决方案-->
      <el-dialog title="解决方案" :visible.sync="endVisible" :destroy-on-close="true" :show-close="false" width="1024px">
        <el-form :model="data" size="small" label-suffix="："  label-width="100px" v-loading="vm.endVisible">
          <el-form-item label="是否解决">
            <el-select v-model="data.solution">
              <el-option value="1" label="已解决">已解决</el-option>
              <el-option value="0" label="未解决">未解决</el-option>
            </el-select>
          </el-form-item>
          <!--  <el-form-item label="故障现象:">
            <el-input v-model="data.omens" type="textarea" style="width: 80%;"></el-input>
          </el-form-item> -->
          <el-form-item label="解决描述">
            <el-input v-model="data.receipt" type="textarea" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="备件使用">
            <el-table
              :data="vm.useSpareTableData"
              max-height="230px"
              stripe
              style="width: 100%;margin-top: -14px;">
              <el-table-column
                label="备件名称"
                :show-overflow-tooltip="true"
                min-width="180">
                <template slot-scope="scope">

                  <el-autocomplete
                    v-if="!scope.row.spareId"
                    @focus="vm.currentIndex = scope.$index"
                    popper-class="spare-autocomplete"
                    v-model="scope.row.queryStr"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入名称搜索"
                    @select="handleSelect">
                    <i class="el-icon-search el-input__icon" slot="suffix"></i>
                    <template slot-scope="{item}">
                      <div class="name">{{ item.spareName }}</div>
                      <span class="addr">{{ item.spareTypeName }}-{{item.spareUnitName}}</span>
                    </template>
                  </el-autocomplete>
                  <label v-else>{{scope.row.spareName}}({{scope.row.spareCode}})</label>
                </template>
              </el-table-column>
              <el-table-column
                prop="spareModel"
                label="型号">
              </el-table-column>
              <el-table-column
                prop="spareTypeName"
                label="类型">
              </el-table-column>
              <el-table-column
                width="80px"
                prop="spareUnitName"
                label="单位">
              </el-table-column>
              <el-table-column
                width="80px"
                label="数量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.nums" type="number" size="small" placeholder="请输入数量"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                min-width="140"
                prop="remark"
                label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" size="small" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                width="80"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="vm.useSpareTableData.splice(scope.$index,1)" type="text" size="small" style="color: #e72926;">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="24" style="text-align: center;">
                <el-button @click="addRowSpare" type="primary" plain size="mini">
                  <i class="el-icon-plus"></i>
                  添加一行
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="附件">
            <span class="upload" style="width: 800px;text-align: left;vertical-align: top;">
              <!--图片上传-->
              <ul class="weui-uploader__files" id="uploaderFiles">
                <li ref="files" class="weui-uploader__file" v-for="(image,index) in images" :key="index" :style="'backgroundImage:url(' + image +' )'"><span
                    @click="deleteimg(index)" class="x" style="width: 25px;">&times;</span></li>
              </ul>
              <div v-show="images" class="weui-uploader__input-box">
                <input @change="change" id="uploaderInput" class="weui-uploader__input" type="file" multiple accept="image/*">
              </div>
            </span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="endVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="endThods" :loading="vm.endVisible" size="small">确定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script type="javascript" src="./detail.js"></script>
<style scoped lang="less" src="./detail.less"></style>
