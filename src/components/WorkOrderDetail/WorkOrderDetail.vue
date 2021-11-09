<template>
  <el-row :gutter="12">
    <el-col :span="8">
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333;">工单信息</h5>
          <div class="widget-toolbar">

            <el-button @click="initCompleted()" size="mini">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
        <div class="widget-body">
          <div class="widget-main" id="work-order-form">
            <WorkOrderForm :uuid="uuid" :completed="initCompleted"></WorkOrderForm>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="16">
      <el-tabs type="border-card">
        <el-tab-pane label="工单详细信息">
          <div class="main_title">
            工单状态信息
          </div>
          <div class="source">
            <WorkOrderProgress v-if="addData.status" :status="addData.status"></WorkOrderProgress>
          </div>
          <div v-if="addData.slaLevelId" class="main_title">
            工单SLA信息
          </div>
          <div v-if="addData.slaLevelId" class="source">
            <el-form :inline="true" :model="addData" label-suffix="："
                     label-width="110px"
                     style="max-width: 720px; min-width: 640px;" class="sla-form-inline">
              <el-form-item label="SLA响应时间">
                <label>{{addData.slaResponseTime}}</label>
              </el-form-item>
              <el-form-item label="实际响应时间">
                {{addData.actualResponseTime}}
                <label :inner-html.prop="addData.slaResponseTime | timeComparisonFormatter(addData.actualResponseTime)"></label>
              </el-form-item>
              <el-form-item label="SLA完成时间">
                <label>{{addData.slaCompletionTime}}</label>
              </el-form-item>
              <el-form-item label="实际完成时间">
                <label>{{addData.actualCompletionTime}}</label>
                <label :inner-html.prop="addData.slaCompletionTime | timeComparisonFormatter(addData.actualCompletionTime)"></label>
              </el-form-item>
              <el-form-item v-if="addData.status =='DELAY'" label="延期时间" class="delay-time-item">
                <label>{{vm.delayData.delayTime}}</label>
                <label>【延期时长：{{addData.slaCompletionTime | timeComparisonFormatter2(vm.delayData.delayTime)}}】</label>
              </el-form-item>
            </el-form>
          </div>
          <div class="perpon">
            <div style="margin-right: 20px;">
              <div class="act">创建人</div>
              <div style="border-right: 2px solid #eee;padding: 0 20px;font-size: 13px;">{{addData.createUserName}}</div>
            </div>
            <div style="margin-right: 20px;">
              <div class="act">处理人</div>
              <div style="border-right: 2px solid #eee;padding: 0 20px;font-size: 13px;">{{addData.receiverName?addData.receiverName:"暂无"}}</div>
            </div>
            <div>
              <div class="act">协作人</div>
              <!--协作人插槽-->
              <slot name="collaborator">
                <div class="perpon" v-if="addData.teams.length == 0"><span style="margin-left: 20px;font-size: 13px;">暂无</span></div>
                <div v-for="(item,i) in addData.teams" :key="i" style="margin-right: 10px;font-size: 13px;">
                  {{item.synergicUserName}}
                </div>
              </slot>
            </div>
          </div>
          <div class="main_title" style="border-bottom: none;">
            工单动态
          </div>
          <div class="secondmain">
            <!--工单动态-->
            <WorkOrderOperationLog :uuid="uuid"></WorkOrderOperationLog>
          </div>
        </el-tab-pane>

        <el-tab-pane label="延期申请" v-if="(addData.status == 'DELAY' || addData.status=='OK') && addData.delayBean">
          <el-form :model="vm.delayData" label-width="150px" label-suffix="：" size="small" class="evalue">
            <el-form-item label="申请日期">
              <label>{{vm.delayData.applyTime}}</label>
            </el-form-item>
            <el-form-item label="申请人">
              <label>{{vm.delayData.applyUserName}}</label>
            </el-form-item>
            <el-form-item label="申请事由">
              <label>{{vm.delayData.cause}}</label>
            </el-form-item>
            <el-form-item label="延期日期">
              <label>{{vm.delayData.delayTime}}</label>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="解决方案" v-if="addData.status=='OK'">
          <div class="evalue">
            <el-form :model="receiptData" label-width="150px" label-suffix="：" size="small">
              <el-form-item label="是否解决">
                <label>{{receiptData.solution==1?"已解决":"未解决"}}</label>
              </el-form-item>
              <el-form-item label="故障现象">
                <label></label>
              </el-form-item>
              <el-form-item label="解决过程">
                <label>{{receiptData.receipt}}</label>
              </el-form-item>
              <el-form-item label="备件使用">
                <el-table
                  :data="receiptData.spares"
                  stripe
                  style="width: 100%;margin-top: -14px;">
                  <el-table-column
                    label="备件名称"
                    prop="spareName"
                    :show-overflow-tooltip="true"
                    min-width="180">
                  </el-table-column>
                  <el-table-column
                    prop="spareCode"
                    label="编码">
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
                    prop="nums"
                    width="80px"
                    label="数量">
                  </el-table-column>
                  <el-table-column
                    min-width="140"
                    prop="remark"
                    label="备注">
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="附件">
                <div style="margin-top: -12px;">
                  <el-table
                    stripe
                    :data="receiptData.attachments">
                    <el-table-column
                      label="序号"
                      type="index"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      prop="fileName"
                      min-width="200px"
                      label="附件名称">
                    </el-table-column>
                    <el-table-column
                      prop="filePath"
                      min-width="200px"
                      label="附件">
                      <template slot-scope="scope">
                        <el-image
                          style="width: 60px; height: 60px"
                          :src="'https://picture.ceiov.com/'+scope.row.filePath"
                          :preview-src-list="['https://picture.ceiov.com/'+scope.row.filePath]">
                          <div slot="placeholder" class="image-slot">
                            加载中<span class="dot">...</span>
                          </div>
                        </el-image>
                      </template>
                    </el-table-column>

                  </el-table>
                </div>
              </el-form-item>
            </el-form>

          </div>
        </el-tab-pane>
        <el-tab-pane label="满意度评价" v-if="receiptData.satisfaction!='-1'&&addData.status=='OK'">
          <div class="evalue">
            <el-form :model="receiptData" label-width="150px" label-suffix="："size="small">
              <el-form-item label="满意度">
                <el-radio-group v-model="receiptData.satisfaction">
                  <el-radio :label="2" disabled>好评</el-radio>
                  <el-radio :label="1" disabled>中评</el-radio>
                  <el-radio :label="0" disabled>差评</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评价内容">
                {{receiptData.idea}}
              </el-form-item>
              <el-form-item label="维修速度">
                <el-rate
                  disabled
                  v-model="receiptData.processing"
                  show-text>
                </el-rate>
              </el-form-item>
              <el-form-item label="服务态度">
                <el-rate
                  disabled
                  v-model="receiptData.serve"
                  show-text>
                </el-rate>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="满意度评价"  v-if="addData.status=='OK'&&receiptData.satisfaction=='-1'">
          <div style="text-align: center;line-height: 300px;">暂无评价，点击<a @click="evaluate=true">进行满意度评价</a>吧~！</div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
