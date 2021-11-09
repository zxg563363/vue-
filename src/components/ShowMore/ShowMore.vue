<template>
  <div  :style="{position: 'relative',height: ((isShowMore && !isExpand) ? '88px' : 'auto'), overflow: 'hidden'}">
    <div class="editor-wrapper">
      <div class="co-editor-wrap">
        <div class="co-editor-editable-wrap">
          <div ref="contents" class="render-editable" v-html="content"></div>
        </div>
      </div>
    </div>
    <div v-if="isShowMore" class="editor-wrapper-expand" :class="{'editor-wrapper-expand-open':isExpand}">
      <div @click="expandContent" class="editor-wrapper-expand-button" :class="{'editor-wrapper-expand-button-up':isExpand}">
        <span></span>
        {{isExpand ? '收起' : '展开'}}信息
      </div>
    </div>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
