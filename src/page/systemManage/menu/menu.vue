<template>
    <div class="menu">
        <div class="clearfix">
            <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
            <el-button type="primary fr" @click="menuFrom(1)">新建菜单</el-button>
        </div>

        <el-dialog :title="menuTitle" :visible.sync="dialogMenu" :before-close="fromClose">
            <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item prop="actName" label="菜单名称">
                            <el-input v-model="form.actName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="actUrl" label="资源地址">
                            <el-input v-model="form.actUrl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="sort" label="排序">
                            <el-input v-model="form.sort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="pId" label="父菜单">
                            <el-input v-model="form.pId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="actType" label="资源类型">
                            <el-select v-model="form.actType" placeholder="请选择资源类型">
                                <el-option label="菜单" value="menu"></el-option>
                                <el-option label="数据权限" value="data"></el-option>
                                <el-option label="按钮动作" value="action"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="validity" label="	数据有效性">
                            <el-select v-model="form.validity" placeholder="请选择数据有效性">
                                <el-option label="无效" value="0"></el-option>
                                <el-option label="有效" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="actCode" label="权限编码">
                            <el-input v-model="form.actCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-form-item align="right">
                        <el-button @click="resetForm('form')">取消</el-button>
                        <el-button type="primary" @click="submitForm('form')" style="margin-right: 20px">立即创建</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="javascript" src="./menu.js"></script>
<style scoped lang="less" src="./menu.less"></style>