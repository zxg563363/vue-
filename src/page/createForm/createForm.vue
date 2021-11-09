<template>
    <div class="createForm clearfix">
        <!--<fm-making-form-->
                <!--ref="makingform"-->
                <!--style="height: 500px"-->
                <!--preview-->
                <!--generate-code-->
                <!--generate-json-->
        <!--&gt;-->
            <!--<template slot="action">-->
            <!--</template>-->
        <!--</fm-making-form>-->
        <div class="dynamicForm">
            <!--  高级定义和布局字段 我不需要就设置为空啦   :advance-fields = '[]'   :layout-fields = '[]'  -->
            <fm-making-form
                    ref="makingform"
                    style="height:800px;display: block;"
                    preview
                    :advance-fields = '[]'
                    :layout-fields = '[]'
            >
                <!-- 头部内容自定义，添加提交按钮 -->
                <template slot="action">
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                </template>
            </fm-making-form>
        </div>

        <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

    </div>
</template>

<script type="javascript" src="./createForm.js"></script>
<style scoped lang="less" src="./createForm.less"></style>