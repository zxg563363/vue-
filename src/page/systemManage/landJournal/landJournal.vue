<template>
    <div class="landJournal">
        <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
        <div class="content">
            <div class="serchBox">
                <el-form :inline="true" :model="serchFrom" class="demo-form-inline">
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-input v-model="serchFrom.landUrl" placeholder="登录地址" clearable></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-input v-model="serchFrom.userName" placeholder="用户名" clearable></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-select v-model="serchFrom.status" placeholder="状态" clearable filterable>
                                <el-option label="全部" value="全部"></el-option>
                                <el-option label="正常" value="正常"></el-option>
                                <el-option label="关闭" value="关闭"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="onSubmit('serchFrom')" class="saveBtn">查询</el-button>
                            <el-button @click="resetForm('serchFrom')" class="resetBtn">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
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
                <el-table-column prop="realName" label="用户名"></el-table-column>
                <el-table-column prop="realName" label="登录地址"></el-table-column>
                <el-table-column prop="realName" label="登录地点"></el-table-column>
                <el-table-column prop="realName" label="浏览器"></el-table-column>
                <el-table-column prop="realName" label="操作系统"></el-table-column>
                <el-table-column prop="realName" label="登录状态"></el-table-column>
                <el-table-column prop="realName" label="操作信息"></el-table-column>
                <el-table-column prop="realName" label="登录日期"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script type="javascript" src="./landJournal.js"></script>
<style scoped lang="less" src="./landJournal.less"></style>
