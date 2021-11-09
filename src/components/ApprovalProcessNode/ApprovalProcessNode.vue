<template>
  <el-tabs v-model="currentTab" type="border-card" @tab-click="getOperatorHistory">
    <el-tab-pane label="流程信息" name="workflow">
        <el-timeline class="process-timeline" v-loading="tableDataLoading">
          <el-timeline-item v-for="(item, index) in tableData" :key="index"
                            :icon="item.status=='DONE' ? 'el-icon-check' : (item.status=='DOING' ? 'el-icon-s-flag': 'el-icon-check' )"
                            :timestamp="item.handleTime ? item.handleTime : item.initialTime"
                            :hide-timestamp="!item.handleTime && !item.initialTime"
                            placement="top"
                            :type="item.status=='DONE' ? 'primary' : (item.status=='DOING' ? 'success': '' )"
                            size="large">
            <el-card>
              <h4 class="f-s-13" :class="{'text-success f-s-14': item.status=='DOING'}"
                  style="margin-bottom: 12px;" :style="{'font-weight': item.status=='DOING' ? 'bold': ''}">
                【{{item.nodeName}}】
              </h4>
              <el-form class="timeline-form" label-suffix="：" label-width="120px"  size="small">
                <el-form-item label="处理人员" v-if="item.status=='DOING'">
                    <span  class="f-s-13" style="display: inline-block;margin-right: 10px;" v-for="(user, i) in item.user" :key="i">
                      <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                      <span class="node-user">
                        {{user.userName}}
                      </span>
                    </span>
                </el-form-item>
                <div v-if="item.status=='DONE'"  v-for="(user, i) in item.operator" :key="i">
                  <el-form-item :label="'处理人-'+(i+1)" >
                      <span  class="f-s-13" style="display: inline-block;margin-right: 10px;" >
                        <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                        <span class="node-user">
                          {{user.createUserName}}
                        </span>
                      </span>
                  </el-form-item>
                  <el-form-item label="审核意见">
                    <show-more :content="user.remark"></show-more>
                  </el-form-item>
                  <el-image class="approval-icon" fit="fill" :src="icons[0][user.agree]"></el-image>
                  <el-divider v-if="i>0"></el-divider>
                </div>
                <div v-if="item.status=='INIT'">
                  <el-form-item :label="'处理'+(item.setting.ruleTypeName)" >
                    <span  class="f-s-13" style="display: inline-block;margin-right: 10px;" v-for="(user, i) in item.setting.data" :key="i">
                      <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
                      <span class="node-user">
                        {{user.name}}
                      </span>
                    </span>
                  </el-form-item>
                </div>
              </el-form>

            </el-card>
          </el-timeline-item>
        </el-timeline>
    </el-tab-pane>
    <el-tab-pane label="审批操作信息" name="approve">
      <el-timeline class="process-timeline">
        <el-timeline-item v-for="(item,index) in operatorData" :key="index" :timestamp="item.createTime" placement="top">
          <el-card>
            <h4 class="f-s-14 text-bold">【{{item.nodeInsName}}】</h4>
            <el-form class="timeline-form" label-suffix="：" label-width="120px"  size="small">
              <el-form-item label="操作人">
                <span  class="f-s-13" style="display: inline-block;">
                  {{item.createUserName}}
                </span>
              </el-form-item>
              <el-form-item label="审核意见">
                <show-more :content="item.remark"></show-more>
              </el-form-item>
              <el-image class="approval-icon" fit="fill" :src="icons[0][item.agree]"></el-image>
            </el-form>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-tab-pane>
  </el-tabs>

</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
