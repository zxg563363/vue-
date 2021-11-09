<template>
    <div class="repair">
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
                <el-button type="primary" size="small" style="margin: 0px 0 15px 0;" @click="goAdd()">新建计划任务</el-button>
                <div class="title">计划任务列表</div>
                <el-table :data="tableData"
                          :header-cell-style="{fontSize:'14px','text-align':'center','background':'#fff'}"
                          :cell-style="{'text-align':'center'}"
                          style="margin: 20px 0;color: #333;background-color: #fff;"
                          v-loading="loading"
                          element-loading-text="拼命加载中"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.3)"
                          :default-sort = "{prop: '', order: 'descending'}"
                          :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="85"></el-table-column>
                    <el-table-column prop="formType" label="计划类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.formType == 'check'">巡检</span>
                            <span v-if="scope.row.formType == 'point'">点检</span>
                            <span v-if="scope.row.formType == 'protect'">保养</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="计划名称"></el-table-column>
                    <el-table-column label="巡视周期">
                        <template slot-scope="scope">
                            <span v-if="scope.row.repeatType == 1">每天</span>
                            <span v-if="scope.row.repeatType == 2">每周</span>
                            <span v-if="scope.row.repeatType == 3">每月</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="巡视时间">
                        <template slot-scope="scope">
                            <div v-if="scope.row.repeatType == 1">
                                <span>每天</span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                            <div v-if="scope.row.repeatType == 2">
                                <span v-for="(item,index) in scope.row.repeatScope.split(',')" :key="index">
                                    每周{{item}}
                                </span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                            <div v-if="scope.row.repeatType == 3">
                                每<span v-for="(item,index) in scope.row.repeatScope.split(',')" :key="index">
                                    {{item}}号
                                </span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划描述">
                        <template slot-scope="scope">
                            <span v-if="scope.row.describe">{{scope.row.describe}}</span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" class="el-icon-edit" @click="editRepair(scope.row,1)">编辑</el-button>
                            <el-button type="text" class="el-icon-delete" @click="deleteRepair(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="title">设备列表</div>
                <el-table :data="tableDevice"
                          :header-cell-style="{fontSize:'14px','text-align':'center','background':'#fff'}"
                          :cell-style="{'text-align':'center'}"
                          style="margin: 20px 0;color: #333;background-color: #fff;"
                          v-loading="loadingDevice"
                          element-loading-text="拼命加载中"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.3)"
                          :default-sort = "{prop: '', order: 'descending'}"
                          :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="85"></el-table-column>
                    <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
                    <el-table-column prop="formType" label="计划类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.formType == 'check'">巡检</span>
                            <span v-if="scope.row.formType == 'point'">点检</span>
                            <span v-if="scope.row.formType == 'protect'">保养</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="计划名称"></el-table-column>
                    <el-table-column label="巡视周期">
                        <template slot-scope="scope">
                            <span v-if="scope.row.repeatType == 1">每天</span>
                            <span v-if="scope.row.repeatType == 2">每周</span>
                            <span v-if="scope.row.repeatType == 3">每月</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="巡视时间">
                        <template slot-scope="scope">
                            <div v-if="scope.row.repeatType == 1">
                                <span>每天</span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                            <div v-if="scope.row.repeatType == 2">
                                <span v-for="(item,index) in scope.row.repeatScope.split(',')" :key="index">
                                    每周{{item}}
                                </span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                            <div v-if="scope.row.repeatType == 3">
                                每<span v-for="(item,index) in scope.row.repeatScope.split(',')" :key="index">
                                    {{item}}号
                                </span> -
                                <span>{{scope.row.repeatTimes.replace(/,/g,'，')}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" class="el-icon-edit" @click="editRepair(scope.row,2)">编辑</el-button>
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

<script type="javascript" src="./repair.js"></script>
<style scoped lang="less" src="./repair.less"></style>