<template>
    <div class="detail">
        <el-page-header @back="goBack" content="表单详情"></el-page-header>
        <el-card shadow="hover" style="margin-top: 20px;" class="clearfix">
            <el-row :gutter="20" class="topBox">
                <el-col :span="6">
                    <span>设备名称:</span>
                    <span>给你妹</span>
                </el-col>
                <el-col :span="6">
                    <span>设备编码:</span>
                    <span>SB520</span>
                </el-col>
                <el-col :span="6">
                    <span>填写次数:</span>
                    <span>22</span>
                </el-col>
                <el-col :span="6">
                    <span>填写人次:</span>
                    <span>33</span>
                </el-col>
            </el-row>
        </el-card>
        <div class="btnBox">
            <el-button type="primary" size="small">全部导出</el-button>
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <span class="items">记录编号: A4</span>
                    <span>填写日期: 2021-1-1   18：00</span>
                </template>
                <div class="itemStyle">表单项目1：已填写内容</div>
                <div class="itemStyle">表单项目2：已填写内容</div>
                <div class="itemStyle">表单项目3：已填写内容</div>
                <div class="itemStyle">表单项目4：已填写内容</div>
                <div class="selfCon">
                    <div>
                        <span>填表人：姓名</span>
                        <span>联系方式：手机号</span>
                        <span>工号：工号</span>
                    </div>
                    <div>
                        <span>所属部门：部门名称</span>
                        <span>岗位：岗位名称</span>
                        <span>所在班组：班组名称</span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <span class="items">记录编号: A4</span>
                    <span>填写日期: 2021-1-1   18：00</span>
                </template>
                <div class="itemStyle">表单项目1：已填写内容</div>
                <div class="itemStyle">表单项目2：已填写内容</div>
                <div class="itemStyle">表单项目3：已填写内容</div>
                <div class="itemStyle">表单项目4：已填写内容</div>
                <div class="selfCon">
                    <div>
                        <span>填表人：姓名</span>
                        <span>联系方式：手机号</span>
                        <span>工号：工号</span>
                    </div>
                    <div>
                        <span>所属部门：部门名称</span>
                        <span>岗位：岗位名称</span>
                        <span>所在班组：班组名称</span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>

    export default {
        name: '',
        data() {
            return {
                activeNames:['1']
            }
        },
        mounted() {

        },
        methods: {
            goBack() {
                this.$router.push({
                    path:'/taskManage/formList'
                });
            },
        },
        components: {

        },
    }
</script>

<style scoped lang="less">
    .detail{
        .topBox{
            text-align: center;
        }
        .btnBox{
            padding: 20px;
            background: #fff;
            margin: 20px 0;
        }
        .items{
            margin-right: 20px;
        }
        .selfCon{
            border-top: 1px solid #ddd;
            padding: 10px 0 20px 0;
            margin-top: 10px;
        }
        .itemStyle{
            min-height: 30px;
            display: flex;
            align-items: center;
        }
    }
</style>