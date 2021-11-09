<template>
    <div class="contentMain">
        <el-container>
            <el-container :class="classObj" class="mainP">
                <el-aside>
                    <!--左侧导航 START-->
                    <LeftBar class="fl"></LeftBar>
                    <!--左侧导航 END-->
                </el-aside>
                <el-main>
                  <el-header class="headerP" style="position: fixed;">
                    <!--头部 START-->
                    <Header></Header>
                    <!--头部 END-->
                  </el-header>
                  <div style="padding: 12px; margin-top: 60px;">
                    <!--<router-view name="index"/>-->
                    <router-view/>
                  </div>
                </el-main>
            </el-container>
        </el-container>
        <VersionUpdateLog></VersionUpdateLog>
    </div>
</template>

<script>
    import Header from './header.vue'
    import LeftBar from './leftBar.vue'
    import VersionUpdateLog from '@/components/VersionUpdateLog/VersionUpdateLog';
    export default {
      computed: {
        sidebar() {
          return this.$store.state.app.sidebar;
        },
        classObj() {
          return {
            hideSidebar: !this.sidebar.opened,
            openSidebar: this.sidebar.opened,
            withoutAnimation: this.sidebar.withoutAnimation,
          };
        },
      },
        data() {
            return {
                transitionName:""
            }
        },
        mounted() {
          try {
            this.$store.dispatch('setUser',JSON.parse(this.$ls.get('userInfo')));
          }catch (e) {

          }

        },
        methods: {

        },
        components: {
            Header,
            LeftBar,
            VersionUpdateLog,
        },
        watch: {
            $route(to, from) {
                if(to.path !=='/' && to.path !=='/' && to.path !=='/' || from.path !=='/' && from.path !=='/' && from.path !=='/'){
                    //如果to索引大于from索引,判断为前进状态,反之则为后退状态
                    if(to.meta.index < from.meta.index){
                        //设置动画名称
                        this.transitionName = 'slide-left';
                    }else if(to.meta.index > from.meta.index){
                        this.transitionName = 'slide-right';
                    }else if(to.meta.index == 99){
                        this.transitionName =""
                    }
                }else{
                    this.transitionName =""
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .contentMain{
        height: 100%;
        width: 100%;
        .main{
            width: 100%;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -o-box-sizing: border-box;
            -ms-box-sizing: border-box;
            box-sizing: border-box;
        }
        .headerP{
            width: 100%;
            z-index: 10;
        }
    }
</style>
