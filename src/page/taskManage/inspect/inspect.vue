<template>
    <div class="inspect">
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
                <el-card shadow="hover" style="margin-bottom: 20px">
                    <el-row :gutter="20">
                        <el-col :span="6" class="infoTitle">设备类型名称</el-col>
                        <el-col :span="6" class="infoMain">{{deviceInfo.typeName}}</el-col>
                        <el-col :span="6" class="infoTitle">编码</el-col>
                        <el-col :span="6" class="infoMain">{{deviceInfo.typeCode}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6" class="infoTitle">创建时间</el-col>
                        <el-col :span="6" class="infoMain">{{deviceInfo.createTime}}</el-col>
                        <el-col :span="6"></el-col>
                        <el-col :span="6"></el-col>
                    </el-row>
                </el-card>
                <el-tabs v-model="fromType" type="border-card" @tab-click="tabClick">
                    <el-tab-pane name="check" label="巡检">
                        <!--点击按钮添加自定义表单-->
                        <el-button type="primary" size="small" v-if="id" style="margin: 0px 0 15px 0;" @click="delFrom()">删除自定义表单</el-button>
                        <fm-making-form
                                ref="makingformcheck"
                                preview
                                style="height:500px;display: block;"
                                :layout-fields = '[]'
                                clearable
                        >
                            <template slot="action">
                                <el-button type="primary" @click="submitFrom">提交保存</el-button>
                            </template>
                        </fm-making-form>
                    </el-tab-pane>
                    <el-tab-pane name="point" label="点检">
                        <el-button type="primary" size="small" v-if="id" style="margin: 0px 0 15px 0;" @click="delFrom()">删除自定义表单</el-button>
                        <fm-making-form
                                ref="makingformpoint"
                                preview
                                style="height:500px;display: block;"
                                :layout-fields = '[]'
                                clearable
                        >
                            <template slot="action">
                                <el-button type="primary" @click="submitFrom">提交保存</el-button>
                            </template>
                        </fm-making-form>
                    </el-tab-pane>
                    <el-tab-pane name="protect" label="保养">
                        <el-button type="primary" size="small" v-if="id" style="margin: 0px 0 15px 0;" @click="delFrom()">删除自定义表单</el-button>
                        <fm-making-form
                                ref="makingformprotect"
                                preview
                                style="height:500px;display: block;"
                                :layout-fields = '[]'
                                clearable
                        >
                            <template slot="action">
                                <el-button type="primary" @click="submitFrom">提交保存</el-button>
                            </template>
                        </fm-making-form>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </div>
</template>

<script type="javascript" src="./inspect.js"></script>
<style scoped lang="less" src="./inspect.less"></style>