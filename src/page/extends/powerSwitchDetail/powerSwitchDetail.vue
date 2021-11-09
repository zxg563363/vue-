<template>
    <div style="padding: 6px 6px;">
        <el-header class="title" style="text-align: right; height: 48px;">
            <el-button v-if="isShowBack" @click="$router.back(-1)" size="mini"><i class="el-icon-back"></i> 返回
            </el-button>
            <el-button @click="getDetailData" size="mini" type="primary" plain><i class="el-icon-refresh"></i> 刷新
            </el-button>
            <el-dropdown v-if="entityData.canDispose && entityData.approval==2"
                         trigger="click" @command="approvePowerSwitch">
                <el-button type="danger" size="mini">
                    审核 <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="true">审核通过</el-dropdown-item>
                    <el-dropdown-item command="false">审核拒绝</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!--&& entityData.status =='OK'-->
            <el-button v-if="isGive && entityData.status =='OK' && !entityData.pId"
                       @click="inputPowerSwitch(entityData)" type="primary" size="mini">
                <i class="el-icon-plus"></i>
                创建送电申请
            </el-button>
            <el-button v-if="isGive && entityData.applyType==0 && entityData.status !='CANCEL' && !entityData.pId"
                       @click="isHandover = true,vm.appointStaffDialogVisible2=true" type="primary" size="mini">
                <i class="el-icon-connection"></i>
                交接班
            </el-button>
            <el-button v-if="isExecute && entityData.status =='DOING' && !entityData.pId &&!entityData.containerNo"
                       @click="executePowerSwitch(entityData)" type="primary" size="mini">
                <i class="el-icon-s-promotion"></i>
                执行{{ entityData.applyType == 0 ? '停电' : '送电' }}
            </el-button>
            <span v-if="entityData.status!='OK' && entityData.status!='CANCEL'">
                <el-button v-auth-check="15000001" type="primary" size="mini" @click="vm.appointStaffDialogVisible = true">
                    <i class="el-icon-s-custom"></i>
                    指定{{ entityData.applyType == 0 ? '停电' : '送电' }}人
                </el-button>
            </span>
            <el-button v-if="entityData.createUserId==currentUser['id'] && entityData.status=='CANCEL'"
                       :loading="dataLoading"
                       @click="restartExecutePowerSwitch(entityData)" type="warning" size="mini">
              重新发起审批
              <i class="el-icon-right"></i>
            </el-button>

        </el-header>
        <el-row :gutter="12">
            <el-col :span="12">
                <el-card shadow="hover" class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="f-s-14" style="font-weight: bold;">停送电信息</span>
                    </div>
                    <el-form :model="entityData"
                             v-loading="dataLoading"
                             label-suffix="：" class="basic-form"
                             label-width="150px" size="small">
                        <el-form-item v-if="!isInIframe && entityData.pId"
                                      :label="'关联'+(entityData.applyType==0 ? '送': '停')+'电编码'">
                            <el-tooltip class="item" effect="dark" content="点击查看详细" placement="right">
                                <el-link @click="viewDetail" type="primary" class="f-s-14" style="font-weight: bold;">
                                    {{ entityData.pId }}
                                </el-link>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :label="(entityData.applyType==0 ? '停': '送')+'电编码'">
                            <label style="font-weight: bold;" class="f-s-14">{{ entityData.id }}</label>
                        </el-form-item>
                        <el-form-item label="停送电时间">
                            <label>{{ entityData.specifyTime }}</label>
                        </el-form-item>
                        <el-form-item label="设备名称">
                            <label>{{ entityData.equipName }}</label>
                        </el-form-item>
                        <el-form-item label="设备编码">
                            <label>{{ entityData.equipCode }}</label>
                        </el-form-item>
                        <el-form-item label="操作机柜号">
                            <label>{{ entityData.containerNo }}</label>
                        </el-form-item>
                        <el-form-item v-if="entityData.applyType==0" label="停电原因">
                            <label>{{ entityData.reason }}</label>
                        </el-form-item>
                        <el-form-item label="通知停(送)电人">
                            <label>{{ entityData.createUserName }}</label>
                        </el-form-item>
                        <el-form-item label="停(送)电人">
                            <label>{{ entityData.receiverName }}</label>
                        </el-form-item>
                        <el-form-item label="停(送)电协作人">
                            <label>{{ entityData.togetherName }}</label>
                        </el-form-item>
                        <el-form-item v-if="entityData.modifyUserId!=entityData.createUserId" label="交接班人">
                            <label>{{ entityData.modifyUserName }}</label>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-tag v-if="entityData.status =='NEW'" type="warning" size="small" effect="dark">待审批
                            </el-tag>
                            <el-tag v-if="entityData.status =='DOING'" type="info" size="small" effect="dark">执行中
                            </el-tag>
                            <el-tag v-if="entityData.status =='OK'" type="success" size="small" effect="dark">已完成
                            </el-tag>
                            <el-tag v-if="entityData.status =='CANCEL'" type="danger" size="small" effect="dark">已取消</el-tag>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <label>{{ entityData.createTime }}</label>
                        </el-form-item>
                        <el-form-item label="执行时间">
                            <label>{{ entityData.executeTime }}</label>
                        </el-form-item>
                        <el-image
                            class="apply-type"
                            :src="icons[entityData.applyType]"
                            fit="fill"></el-image>
                    </el-form>

                </el-card>
            </el-col>
            <el-col :span="12">
                <ApprovalProcessNode :uuid="uuId" ref="approvalProcessNode"></ApprovalProcessNode>
            </el-col>
        </el-row>
        <!--审核-->
        <ApprovalProcess :process-fun="processApproval" ref="approvalModal" title="停送电审批"></ApprovalProcess>
        <!--交班-->

        <!--指定停送电人-->
        <el-dialog title="指定停送电人" :visible.sync="vm.appointStaffDialogVisible"
                   :close-on-click-modal="false"
                   width="400px" :show-close="false">
            <el-form :model="vm.appointStaffForm" :rules="vm.appointStaffRules" ref="applyForm3"
                     v-loading="vm.dataLoading"
                     label-suffix="：" style="width: 550px;"
                     label-width="140px" size="small">
                <el-form-item :label="(entityData.applyType == 0 ? '停' : '送')+'电人'" prop="receiverId">
                    <el-button v-if="!vm.appointStaffForm.receiverId"
                               @click="vm.currentChoosen = 'receiver',vm.appointStaffDialogVisible2 = true" type="primary" icon="el-icon-plus"
                               circle></el-button>
                    <el-tag style="margin-right: 10px;" v-if="vm.appointStaffForm.receiverId"
                            @close="vm.appointStaffForm.receiverId='',vm.appointStaffForm.receiverName=''" size="small" closable>
                        {{ vm.appointStaffForm.receiverName }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="协作人" prop="togetherId">
                    <el-button v-if="!vm.appointStaffForm.togetherId"
                               @click="vm.currentChoosen = 'together',vm.appointStaffDialogVisible2 = true" type="primary" icon="el-icon-plus"
                               circle></el-button>
                    <el-tag style="margin-right: 10px;" v-if="vm.appointStaffForm.togetherId"
                            @close="vm.appointStaffForm.togetherId='',vm.appointStaffForm.togetherName=''" size="small" closable>
                        {{ vm.appointStaffForm.togetherName }}
                    </el-tag>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('applyForm3')" size="small">取消</el-button>
                <el-button type="primary"
                           :loading="vm.dataLoading"
                           @click="appointStaff('applyForm3')" size="small">确定
                </el-button>
            </div>
        </el-dialog>
        <!--送电申请-->
        <!--@opened="getProcess"-->
        <el-dialog title="创建送电申请" :visible.sync="vm.operatorDialogVisible2"
                   :close-on-click-modal="false"
                   width="600px" :show-close="false">
            <el-form :model="vm.applyPower" :rules="vm.applyRules" ref="applyForm2"
                     v-loading="vm.dataLoading"
                     label-suffix="：" style="width: 550px;"
                     label-width="140px" size="small">
                <el-form-item label="送电时间" prop="specifyTime">
                    <el-date-picker
                        v-model="vm.applyPower.specifyTime"
                        type="datetime"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="通知送电人">
                    {{ currentUser.realName }}
                </el-form-item>
                <el-form-item label="">
                    <label>备注：流程审批与停电相同</label>
                    <el-select v-if="false" v-model="vm.applyPower.useWorkflowId" filterable clearable
                               placeholder="请选择流程" style="min-width: 220px;">
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
                <el-button @click="resetForm('applyForm2')" size="small">取消</el-button>
                <el-button type="primary"
                           :loading="vm.dataLoading"
                           @click="addPowerSwitch('applyForm2')" size="small">确定
                </el-button>
            </div>
        </el-dialog>
        <!--人员信息表-->
        <DepToPerson v-bind:fatherData="vm.receivers" :multi-select="false"
                     v-bind:opens="vm.operatorDialogVisible"
                     v-on:dialogOpen="(data)=>{vm.operatorDialogVisible=data}"
                     v-on:personParams="getPersonParams"></DepToPerson>
        <!--指定停送电人-->
        <DepToPerson v-bind:fatherData="[]" :multi-select="false"
                     v-bind:opens="vm.appointStaffDialogVisible2"
                     v-on:dialogOpen="(data)=>{vm.appointStaffDialogVisible2=data}"
                     v-on:personParams="appointStaffPersonParams"></DepToPerson>
    </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
