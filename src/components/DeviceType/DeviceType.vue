<template>
  <el-row>
    <el-col :span="24" class="device-type-tree">
      <el-input size="small"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        v-loading="treeDataLoading"
        class="filter-tree"
        node-key="id"
        :data="treeData"
        :props="{label: 'typeName', value: 'id'}"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="onClickNode"
        ref="tree">
        <!--插槽-->
        <span class="custom-tree-node" slot-scope="{node, data}">
          <span>{{ data.typeName }}</span>
          <slot name="node" :node="node" :data="data"></slot>
        </span>

      </el-tree>
    </el-col>
  </el-row>

</template>

<script src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
