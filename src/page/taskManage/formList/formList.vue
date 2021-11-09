<template>
    <div class="formList">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
        <el-container class="content">
            <!--左侧树-->
            <el-aside width="300px" class="leftTree">
                <div class="treeTop">
                    <div class="treeTitle">设备类型列表</div>
                </div>
                <el-tree ref="deviceTreeRef"
                         :data="deviceTrees"
                         :props="deviceProps"
                         :default-expand-all="true"
                         @node-click="getDeviceId"
                         node-key="id"
                         :expand-on-click-node="false"
                         highlight-current
                         class="leftTrees">
                </el-tree>
            </el-aside>
            <!--右侧内容-->
            <el-main style="padding: 0;">
                <!--<div class="tabList">-->
                    <!--<span @click="tabClick('check')" :class="{'activeSpan':fromType == 'check'}">巡检</span>-->
                    <!--<span @click="tabClick('point')" :class="{'activeSpan':fromType == 'point'}">点检</span>-->
                    <!--<span @click="tabClick('protect')" :class="{'activeSpan':fromType == 'protect'}">保养</span>-->
                <!--</div>-->
                <el-form :inline="true" :model="serchFrom" class="demo-form-inline">
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <el-select v-model="serchFrom.type" placeholder="表单类型">
                                <el-option label="全部" value="all"></el-option>
                                <el-option label="巡检" value="check"></el-option>
                                <el-option label="点检" value="point"></el-option>
                                <el-option label="保养" value="protect"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="serchFrom.code" placeholder="请输入设备编号"></el-input>
                            <!--<el-input placeholder="请输入设备名称/编号/型号" v-model="serchFrom.state" class="input-with-select">-->
                                <!--<el-select v-model="serchFrom.select" slot="prepend" placeholder="请选择" style="width: 110px;">-->
                                    <!--<el-option label="设备名称" value="1"></el-option>-->
                                    <!--<el-option label="设备编号" value="2"></el-option>-->
                                    <!--<el-option label="设备型号" value="3"></el-option>-->
                                <!--</el-select>-->
                            <!--</el-input>-->
                        </el-col>
                        <el-col :span="5">
                            <el-date-picker
                                    v-model="serchFrom.date"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="serchFrom.speed" placeholder="任务完成度">
                                <el-option label="未巡检" value="0"></el-option>
                                <el-option label="巡检无异常" value="1"></el-option>
                                <el-option label="巡检有异常" value="2"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="onSubmit('serchFrom')" class="saveBtn">查询</el-button>
                            <el-button @click="resetForm('serchFrom')" class="resetBtn">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--表格内容-->
                <el-table :data="tableData"
                          :header-cell-style="{fontSize:'14px','text-align':'center','background':'#fff'}"
                          :cell-style="{'text-align':'center'}"
                          style="margin: 20px 0;color: #333;background-color: #fff;"
                          v-loading="tableLoading"
                          element-loading-text="拼命加载中"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.3)"
                          :default-sort = "{prop: '', order: 'descending'}"
                          :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="85"></el-table-column>
                    <el-table-column prop="equipmentCode" label="设备编号"></el-table-column>
                    <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
                    <el-table-column prop="formType" label="表单类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.formType == 'check'">巡检</span>
                            <span v-if="scope.row.formType == 'point'">点检</span>
                            <span v-if="scope.row.formType == 'protect'">保养</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planName" label="计划名称"></el-table-column>
                    <el-table-column prop="operateTime" label="填写时间"></el-table-column>
                    <el-table-column prop="status" label="当前任务状态">
                        <template slot-scope="scope">
                            <div v-if="(new Date(scope.row.endTime).getTime() * 1) < (new Date().getTime() * 1)">
                                已超时
                            </div>
                            <div v-else>
                                <span v-if="scope.row.status == 0">未巡检</span>
                                <span v-if="scope.row.status == 1">巡检无异常</span>
                                <span v-if="scope.row.status == 2">巡检有异常</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="260">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-view" @click="goDetail(1)">查看表单</el-button>
                            <el-button type="text" icon="el-icon-download">数据导出</el-button>
                            <el-button type="text" icon="el-icon-edit">设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="10"
                        layout="total, prev, pager, next"
                        :total="total"
                        align="center"
                        background>
                </el-pagination>
            </el-main>
        </el-container>
    </div>
</template>

<script type="javascript" src="./formList.js"></script>
<style scoped lang="less" src="./formList.less"></style>
