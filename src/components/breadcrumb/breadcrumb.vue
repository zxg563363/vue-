<template>
    <div class="breadcrumb clearfix">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" v-if="item.path" :to="{ path: item.path }" :key="index">{{item.name}}</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" v-if="!item.path" :key="index">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        },
        props: {
            breadcrumbList: { // 父组件传来的id
                type: Array
            },
        }
    }
</script>

<style scoped>

</style>
