<template>
  <el-dialog
    class="message-box-dialog"
    :visible.sync="dialogVisible"
    width="780px"
    @opened="getNoticeData"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <span class="el-dialog__title" slot="title">
      <i class="el-icon-receiving"></i>
      通知消息
      <div style="float: right; padding-right: 50px;">
        <el-link @click="readMark">标记为已读 <i class="fa fa-paper-plane-o"></i></el-link>
        &nbsp;&nbsp;
        <el-link @click="cleanNotice">清空消息 <i class="fa fa-close"></i></el-link>
      </div>
    </span>
    <el-tabs tab-position="left" @tab-click="(tab)=>{vm.notice[`${tab.name}`].init = true}" v-model="activeName"
             style="height: 530px;">
      <el-tab-pane name="collector_alarm">
        <span slot="label">
          <el-badge :is-dot="notice.collector_alarm.unread>0" class="item">
          <i class="fa fa-warning"></i>
          采集告警
          ({{notice.collector_alarm.unread + '/'+ notice.collector_alarm.total}})
          </el-badge>
        </span>
        <div class="message-box">
          <pull-scroll v-if="vm.notice.collector_alarm.init" ref="collector_alarm_scroll" :request-fun="getCollectorAlarmNotice" :completed="vm.notice.collector_alarm.command">
            <template slot="scroll-item" slot-scope="{items}">
              <el-row v-for="(item, index) in items" :key="index">
                <el-col :span="20" :offset="2">
                  <div style="width: 200px; margin: 0 auto;">
                    <span class="datetime">{{item.time | dateHumanize}}</span>
                  </div>
                  <el-card shadow="hover" class="notice-card">
                    <div slot="header" class="clearfix">
                      <el-badge :is-dot="item.unread">
                      <span class="f-s-13" style="font-weight: bold;">【{{item.title}}】告警提醒</span>
                      </el-badge>
                    </div>
                    <el-form @click.native="readNotice(item,'collector_alarm')" v-bind:class="{'read': item.unread}"
                             size="small" label-suffix="：" label-width="100px">
                      <el-form-item label="编号">
                        <label class="f-s-13">{{item.data.id}}</label>
                      </el-form-item>
                      <el-form-item label="设备">
                        <label class="f-s-13">{{item.data.collectorName}}</label>
                      </el-form-item>
                      <el-form-item label="位置">
                        <label class="f-s-13">{{item.data.spaceName}}</label>
                      </el-form-item>
                      <el-form-item label="时间">
                        <label class="f-s-13">{{item.data.alarmTime}}</label>
                      </el-form-item>
                      <el-form-item label="内容">
                        <label class="f-s-13">{{item.content}}</label>
                      </el-form-item>
                    </el-form>
                    <el-divider v-if="false"></el-divider>
                    <div v-if="false" class="clearfix view-notice">
                      <span class="f-s-13" style="font-weight: bold;">
                        <el-image
                          style="width: 20px; height: 20px;top:5px;"
                          :src="icon.xitong"
                          fit="fill"></el-image>
                        查看详情
                      </span>
                      <div style="float: right;">
                        <el-link size="small">
                          <i class="el-icon-arrow-right" style="font-weight: bold;"></i>
                        </el-link>
                      </div>
                    </div>
                  </el-card>

                </el-col>
              </el-row>
            </template>
          </pull-scroll>
        </div>

      </el-tab-pane>

      <el-tab-pane name="task">
        <span slot="label">
          <el-badge :is-dot="notice.plan_task.unread>0" class="item">
          <i class="el-icon-finished"></i> 任务消息({{notice.plan_task.unread + '/'+ notice.plan_task.total}})
          </el-badge>
        </span>
        <div class="message-box">
          <pull-scroll v-if="vm.notice.task.init" ref="task_scroll" :request-fun="getTaskNotice" :completed="vm.notice.task.command">
            <template slot="scroll-item" slot-scope="{items}">
              <el-row v-for="(item, index) in items" :key="index">
                <el-col :span="20" :offset="2">
                  <div style="width: 200px; margin: 0 auto;">
                    <span class="datetime">{{item.time | dateHumanize}}</span>
                  </div>
                  <el-card shadow="hover" class="notice-card">
                    <div slot="header" class="clearfix">
                      <el-badge :is-dot="item.unread">
                        <span class="f-s-13" style="font-weight: bold;">任务消息提醒</span>
                      </el-badge>
                    </div>
                    <el-form @click.native="readNotice(item,'plan_task')" v-bind:class="{'read': item.unread}"
                             size="small" label-suffix="：" label-width="100px">
                      <el-form-item label="名称">
                        <label class="f-s-13">{{item.title}}</label>
                      </el-form-item>
                      <el-form-item label="备注">
                        <label class="f-s-13">{{item.content}}</label>
                      </el-form-item>
                    </el-form>
                    <el-divider v-if="false"></el-divider>
                    <div v-if="false" class="clearfix view-notice">
                      <span class="f-s-13" style="font-weight: bold;">
                        <el-image
                          style="width: 20px; height: 20px;top:5px;"
                          :src="icon.renwu"
                          fit="fill"></el-image>
                        查看详情
                      </span>
                      <div style="float: right;">
                        <el-link size="small">
                          <i class="el-icon-arrow-right" style="font-weight: bold;"></i>
                        </el-link>
                      </div>
                    </div>
                  </el-card>

                </el-col>
              </el-row>
            </template>
          </pull-scroll>

        </div>
      </el-tab-pane>


      <el-tab-pane name="order">
        <span slot="label">
          <el-badge :is-dot="notice.ops_repair.unread>0" class="item">
          <i class="el-icon-s-order"></i> 工单消息({{notice.ops_repair.unread + '/'+ notice.ops_repair.total}})
          </el-badge>
        </span>
        <div class="message-box">
          <pull-scroll v-if="vm.notice.order.init" ref="order_scroll" :request-fun="getOrderNotice" :completed="vm.notice.order.command">
            <template slot="scroll-item" slot-scope="{items}">
              <el-row v-for="(item, index) in items" :key="index">
                <el-col :span="20" :offset="2">
                  <div style="width: 132px; margin: 0 auto;text-align: center;">
                    <span class="datetime">{{item.time | dateHumanize}}</span>
                  </div>
                  <el-card shadow="hover" class="notice-card">
                    <div slot="header" class="clearfix">
                      <el-badge :is-dot="item.unread">
                        <span class="f-s-13" style="font-weight: bold;">【{{item.title}}】消息提醒</span>
                      </el-badge>
                    </div>
                    <el-form @click.native="readNotice(item,'ops_repair')" v-bind:class="{'read': !item.unread}"
                             size="small" label-suffix="：" label-width="100px">

                      <label class="f-s-13 el-form-item__content">{{item.content}}</label>
                      <div v-if="item.data.uuId">
                        <el-form-item label="编号">
                          <label class="f-s-13">{{item.data.uuId}}</label>
                        </el-form-item>
                        <el-form-item label="标题">
                          <label class="f-s-13">{{item.data.title}}</label>
                        </el-form-item>
                        <el-form-item label="联系人">
                          <label class="f-s-13">{{item.data.contactName}}</label>
                        </el-form-item>
                        <el-form-item label="联系电话">
                          <label class="f-s-13">{{item.data.contactMobile}}</label>
                        </el-form-item>
                        <el-form-item label="类型">
                          <label class="f-s-13">{{item.data.catalogName}}</label>
                        </el-form-item>
                        <el-form-item label="优先级">
                          <label class="f-s-13">{{item.data.urgency}}</label>
                        </el-form-item>
                        <el-form-item label="内容">
                          <label class="f-s-13">{{item.data.description}}</label>
                        </el-form-item>
                      </div>
                    </el-form>
                    <el-divider></el-divider>
                    <div @click="jumpToNextStep(item,'ops_repair',{uuId:item.data.uuId})" class="clearfix view-notice">
                      <span class="f-s-13" style="font-weight: bold;">
                        <el-image
                          style="width: 20px; height: 20px;top:5px;"
                          :src="icon.gongdan"
                          fit="fill"></el-image>
                        查看详情
                      </span>
                      <div style="float: right;">
                        <el-link size="small">
                          <i class="el-icon-arrow-right" style="font-weight: bold;"></i>
                        </el-link>
                      </div>
                    </div>
                  </el-card>

                </el-col>
              </el-row>
            </template>
          </pull-scroll>
        </div>
      </el-tab-pane>
      <el-tab-pane name="power_switch">
        <span slot="label">
          <el-badge :is-dot="notice.power_switch.unread>0" class="item">
          <i class="fa fa-flash"></i>
          停送电通知
          ({{notice.power_switch.unread + '/'+ notice.power_switch.total}})
          </el-badge>
        </span>
        <div class="message-box">
          <pull-scroll v-if="vm.notice.power_switch.init" ref="power_switch_scroll" :request-fun="getPowerSwitchNotice" :completed="vm.notice.power_switch.command">
            <template slot="scroll-item" slot-scope="{items}">
              <el-row v-for="(item, index) in items" :key="index">
                <el-col :span="20" :offset="2">
                  <div style="width: 132px; margin: 0 auto;text-align: center;">
                    <span class="datetime">{{item.time | dateHumanize}}</span>
                  </div>
                  <el-card shadow="hover" class="notice-card">
                    <div slot="header" class="clearfix">
                      <el-badge :is-dot="item.unread">
                        <span class="f-s-13" style="font-weight: bold;">【{{item.title}}】消息提醒</span>
                      </el-badge>
                    </div>
                    <el-form @click.native="readNotice(item,'power_switch')" v-bind:class="{'read': !item.unread}"
                             size="small" label-suffix="：" label-width="100px">
                      <div v-if="item.data.id">
                        <el-form-item label="编号">
                          <label class="f-s-13">{{item.data.id}}</label>
                        </el-form-item>
                        <el-form-item :label="(item.data.applyType==0 ? '停': '送')+'电时间'">
                          <label class="f-s-13">{{item.data.specifyTime}}</label>
                        </el-form-item>
                        <el-form-item label="停电原因">
                          <label class="f-s-13">{{item.data.reason}}</label>
                        </el-form-item>
                        <el-form-item label="设备">
                          <label class="f-s-13">{{item.data.equipName}}（{{item.data.equipCode}}）</label>
                        </el-form-item>
                        <el-form-item :label="'通知'+(item.data.applyType==0 ? '停': '送')+'电人'">
                          <label class="f-s-13">{{item.data.createUserName}}</label>
                        </el-form-item>
                        <el-form-item :label="(item.data.applyType==0 ? '停': '送')+'电人'">
                          <label class="f-s-13">{{item.data.receiverName}}</label>
                        </el-form-item>
                      </div>
                    </el-form>
                    <el-divider></el-divider>
                    <div @click="jumpToNextStep(item,'power_switch',{uuId:item.data.id})" class="clearfix view-notice">
                      <span class="f-s-13" style="font-weight: bold;">
                        <el-image
                          style="width: 20px; height: 20px;top:5px;"
                          :src="icon.gongdan"
                          fit="fill"></el-image>
                        查看详情
                      </span>
                      <div style="float: right;">
                        <el-link size="small">
                          <i class="el-icon-arrow-right" style="font-weight: bold;"></i>
                        </el-link>
                      </div>
                    </div>
                  </el-card>

                </el-col>
              </el-row>
            </template>
          </pull-scroll>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
