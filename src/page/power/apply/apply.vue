<template>
    <el-row id="power-apply" class="workorder">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
        <el-col :span="24" class="content">
            <div class="title">
                <el-row>
                    <el-col :span="6" v-for="(item,i) in statusData" :key='i'
                            :class="currentItemId ==item.id?'active':''">
                        <div @click='changeStatus(item)'>{{ item.value }}</div>
                    </el-col>
                </el-row>
                <div class="ime">
                    <el-button @click="addApply"
                               size="small" type="primary">
                        <i class="el-icon-plus"></i>
                        新建停电申请
                    </el-button>
                    <span style="float: right;">
                        <el-form :inline="true" :model="vm.query" size="small" ref="queryForm">
                            <el-form-item prop="type">
                                <el-select style="width: 120px;" v-model="vm.query.type"
                                           @change="(value)=>{vm.query.typeValue=''}"
                                           clearable placeholder="请选择" size="small">
                                  <el-option label="类型" value="applyType"></el-option>
                                  <el-option label="状态" value="status"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="typeValue">
                                <el-select style="width: 90px;" v-if="vm.query.type" v-model="vm.query.typeValue"
                                           clearable placeholder="请选择" size="small">
                                    <el-option v-for="item in vm.queryTypeMap[vm.query.type]['options']"
                                               :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="dateType">
                              <el-select style="width: 140px;" v-model="vm.query.dateType"
                                         clearable placeholder="请选择" size="small">
                                  <el-option label="指定停送电时间" value="specifyTime"></el-option>
                                  <el-option label="执行停送电时间" value="executeTime"></el-option>
                                </el-select>
                          </el-form-item>
                          <el-form-item prop="duration">
                              <el-date-picker v-if="vm.query.dateType"
                                              v-model="vm.query.duration"
                                              type="daterange"
                                              align="right"
                                              unlink-panels
                                              range-separator="至"
                                              start-placeholder="开始日期"
                                              end-placeholder="结束日期"
                                              :picker-options="pickerOptions">
                            </el-date-picker>
                          </el-form-item>
                          <el-form-item>
                            <el-input type='text' v-model="searchData" size="small" placeholder="编号、设备名称及编码、停送电人"
                                      class="input-custom"></el-input>
                          </el-form-item>
                          <el-button @click="search" type="primary" size="small">搜索</el-button>
                          <el-button @click="reset" size="small">重置</el-button>
                        </el-form>

                    </span>
                </div>
            </div>
        </el-col>
        <el-col :span="24">
            <el-table
                v-loading="tableDataLoading"
                stripe
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    fixed
                    prop="id"
                    label="申请编号"
                    width="160">
                    <template slot-scope="scope">
                        <el-button @click="viewDetail(scope.row)" type="text" size="small">{{
                                scope.row.id
                            }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed
                    prop="equipName"
                    min-width="160"
                    show-overflow-tooltip
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="equipCode"
                    min-width="160"
                    show-overflow-tooltip
                    label="设备编码">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="containerNo"
                    label="配电柜编码"
                    width="100">
                </el-table-column>

                <el-table-column
                    fixed
                    prop="applyType"
                    label="停送电类型"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.applyType==0" type="danger" size="small" effect="dark">停电</el-tag>
                        <el-tag v-else size="small" type="success" effect="dark">送电</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="reason"
                    min-width="180"
                    width="*"
                    show-overflow-tooltip
                    label="停电原因">
                </el-table-column>
                <el-table-column
                    prop="status"
                    min-width="100"
                    label="状态">
                    <template slot="header" slot-scope="{column, $index }">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content" style="line-height: 18px;">
                                审批中：审批停送电申请；<br>
                                执行中：执行停送电操作；<br>
                                已完成：停送电操作完成；<br>
                                已取消：停送电申请未通过；<br>
                            </div>
                            <label style="cursor: pointer;">{{ column.label }} <i class="el-icon-question"></i> </label>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <el-popover v-if="scope.row.status =='NEW'"
                                    placement="bottom" :visible-arrow="true" width="420" popper-class="process-popover"
                                    @after-enter="getProcessDetail(scope.row, true,scope.$index)"
                                    @hide="getProcessDetail(scope.row, false,scope.$index)"
                                    trigger="click">
                            <ApprovalProcessNode v-if="scope.row.isShowProcess"
                                                 :uuid="scope.row.id"></ApprovalProcessNode>
                            <el-tag slot="reference" type="warning" size="small" style="cursor: pointer;"
                                    title="点击查看流程">审批中
                            </el-tag>
                        </el-popover>
                        <el-tag v-if="scope.row.status =='DOING'" type="info" size="small">执行中</el-tag>
                        <el-tag v-if="scope.row.status =='OK'" type="success" size="small">已完成</el-tag>
                        <el-tag v-if="scope.row.status =='CANCEL'" size="small">已取消</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    min-width="140"
                    label="通知停(送)电人">
                </el-table-column>
                <el-table-column
                    prop="specifyTime"
                    min-width="140"
                    label="指定停(送)电时间">
                </el-table-column>
                <el-table-column
                    prop="receiverName"
                    min-width="140"
                    label="停(送)电人">
                </el-table-column>
                <el-table-column
                    prop="executeTime"
                    min-width="150"
                    label="停(送)电时间">
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24" style="text-align: right;">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        @prev-click="handleCurrentChange"
                        @next-click="handleCurrentChange"
                        :current-page.sync="pageData.pageNumber"
                        :page-sizes="pageSizes"
                        :page-size="pageData.pageSize"
                        layout="total, prev, pager, next, sizes"
                        :total="pageData.recordCount">
                    </el-pagination>
                </el-col>
            </el-row>

            <!--停电申请-->
            <el-dialog title="创建停电申请" :visible.sync="vm.powerSwitchDialogVisible"
                       :close-on-click-modal="false"
                       width="600px" :show-close="false" @opened="powerSwitchDialogOpened">
                <el-form :model="vm.applyPower" :rules="vm.applyRules" ref="applyForm"
                         v-loading="vm.dataLoading"
                         label-suffix="：" style="width: 550px;"
                         label-width="140px" size="small">
                    <el-form-item label="停电时间" prop="specifyTime">
                        <el-date-picker
                            v-model="vm.applyPower.specifyTime"
                            type="datetime"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="false" label="申请类型" prop="applyType">
                        <el-radio-group v-model="vm.applyPower.applyType">
                            <el-radio :label="0">停电</el-radio>
                            <el-radio :label="1">送电</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="停电设备" prop="equipId">
                        <el-select v-model="vm.applyPower.equipId"
                                   filterable clearable placeholder="请选择设备"
                                   style="min-width: 410px;">
                            <el-option
                                v-for="item in vm.equipments"
                                :key="item.id"
                                :label="item.equipName+'（'+(item.equipCode)+'）'"
                                :value="item.id">
                                <span style="float: left">{{ item.equipName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.equipCode }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="false" label="配电柜号" prop="containerNo">
                        <el-input v-model="vm.applyPower.containerNo" clearable placeholder="请输入配电柜号1-31"></el-input>
                    </el-form-item>
                    <el-form-item label="停电原因" prop="reason">
                        <el-input
                            type="textarea"
                            :autosize="{minRows: 2, maxRows: 8}"
                            placeholder="请输入停电原因"
                            maxlength="500"
                            show-word-limit
                            v-model="vm.applyPower.reason">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="通知停电人">
                        {{ currentUser.realName }}
                    </el-form-item>
                    <el-form-item v-if="false" label="停电人" prop="receiverId">
                        <el-button @click="vm.operatorDialogVisible=true" type="primary" icon="el-icon-plus"
                                   circle></el-button>
                        <el-tag style="margin-right: 10px;" @close="deleteReceivers(index)"
                                v-for="(item,index) in vm.receivers" :key="index" size="small" closable>
                            {{ item.receiverName }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="停电审批流程" prop="useWorkflowId">
                        <el-select v-model="vm.applyPower.useWorkflowId" filterable clearable placeholder="请选择流程"
                                   style="min-width: 220px;">
                            <el-option
                                v-for="item in vm.workflowDefine"
                                :key="item.workflowId"
                                :label="item.workflowName"
                                :value="item.workflowId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('applyForm')" size="small">取消</el-button>
                    <el-button v-if="!vm.applyPower.id" type="primary"
                               :loading="vm.dataLoading"
                               @click="addPowerSwitch('applyForm')" size="small">确定
                    </el-button>
                </div>
            </el-dialog>
            <!--人员信息表-->
            <DepToPerson v-bind:fatherData="vm.receivers" :multi-select="false"
                         v-bind:opens="vm.operatorDialogVisible"
                         v-on:dialogOpen="(data)=>{vm.operatorDialogVisible=data}"
                         v-on:personParams="getPersonParams"></DepToPerson>
        </el-col>
    </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
