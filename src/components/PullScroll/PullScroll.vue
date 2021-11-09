<template>
  <mescroll-vue :id="uuId" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
    <div v-if="dataList.length==0" class="empty-data">
      <el-empty description="暂无消息" :image-size="200"></el-empty>
    </div>
    <el-backtop v-if="mescroll" :target="'#'+uuId" :bottom="40" :right="12"></el-backtop>
    <slot name="scroll-item" :items="dataList"></slot>
  </mescroll-vue>
</template>

<script>
    import MescrollVue from 'mescroll.js/mescroll.vue';
    import {request} from '@/components/mixins/request';
    import has from 'lodash/has';
    import uniqueId from 'lodash/uniqueId';
    import reduce from 'lodash/reduce';
    import assign from 'lodash/assign';
    export default {
      name: "PullScroll",
      mixins: [request],
      components: {MescrollVue},
      data() {
        return {
          uuId: uniqueId('mescroll_'),
          mescroll: null,
          mescrollDown:{
            autoShowLoading: false,
            auto: true,
            callback:  () =>{
              this.mescroll.resetUpScroll();
              this.deviceList = [];
            },
          },
          mescrollUp: {
            use: true,
            autoShowLoading: false,
            auto: false,
            callback: this.upCallback,
          },
          dataList: [],
        }
      },
      mounted() {

      },
      destroyed(){

      },
      methods: {
        mescrollInit (mescroll) {
          this.mescroll = mescroll;  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        triggerDownScroll(){
          this.mescroll.triggerDownScroll();
        },
        upCallback (page, mescroll) {
          this.requestProcess(this.requestFun(page)).then(res => {
            if(page.num === 1){
              this.dataList = [];
            }
            let _tempData = reduce(res.data,(results,value,key)=>{
              results.push(assign(value,{data: ((data)=>{
                    try {
                      return JSON.parse(data);
                    }catch (e) {
                      return {};
                    }
                })(value['data'])}));
              return results;
            },[]);
            this.dataList = this.dataList.concat(_tempData);
            this.$nextTick(() => {
              mescroll.endSuccess(res.data.length,(res.data.length>0));
              this.completed && this.completed(this.dataList,page, mescroll);
            })
          }).catch((e) => {
            // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
          })
        }
      },
      props: {
        completed: {
          type: Function,
          required: false,
        },
        // 请求方法
        requestFun: {
          type: Function,
          required: true,
        }
      }
    }
</script>

<style scoped lang="less">
  /deep/ .el-backtop{
    position: absolute;
  }
  .empty-data{
    width: 200px;
    margin: 0 auto;
    text-align: center;
    /deep/ .el-empty__description>p{
      font-size: 13px;
    }
  }
</style>
