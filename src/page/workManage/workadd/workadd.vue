<template>
  <div class="workadd">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <div class="content">
      <div v-loading="dataLoading" v-for="(item,i) in logData" :key='i' class="single">
        <div class="title">
          {{item.catalogName}}
          <span v-if="logData&&logData[i].children">({{logData[i].children.length}})</span>
        </div>
        <div class="main">
          <div v-for="(data,j) in logData[i].children" :key='j' class="child" @click="addWork(data)">
            {{data.catalogName}}
          </div>
          <div class="addModel" @click="routes">
            <div>+</div>
            <div>创建新模板</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript" src="./workadd.js"></script>
<style scoped lang="less" src="./workadd.less"></style>
