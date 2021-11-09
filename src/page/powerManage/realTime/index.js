/**
 * Created by lixiansky on 2021/7/16
 */
import RealTimeData from '@/components/RealTimeData/RealTimeData';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import GaugeCharts from '@/components/GaugeCharts/GaugeCharts';
import Power from '../index';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
// import random from 'lodash/random';
import {mapGetters} from "vuex";
export default {
  watch: {
    'vm.filterText'(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    ...mapGetters(["powerInstrument"]),
  },
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new Power(),
      vm:{
        filterText: '',
        treeData:[],
        treeLoading: false,
        currentNode: {},
        realData: [],
        realDataLoading: false,
        // 采集点模型
        model:[],
        modelMap:{},
        realDataTimer: null,
      }
    }
  },

  components: {
    Breadcrumb,
    GaugeCharts,
    RealTimeData,
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '实时数据'}
    ]);

    this.getTreeData();
  },
  // 销毁后
  destroyed(){
    clearInterval(this.vm.realDataTimer);
  },
  methods: {
    getTreeData(){
      this.vm.treeLoading = true;
      this.instance.getTerminalTreeData().then(results=>{
        this.vm.treeData = results;
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.treeLoading = false;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleNodeClick(data) {
      if(data['type']!=='collector'){
        this.$message({
          message: `当前节点【${data.name}】，不是采集点`,
          type: 'warning'
        });
        return false;
      }
      this.vm.currentNode = data;
      // 获取数据模型
      this.vm.realDataLoading = true;
      this.instance.getDataModelByCollectorId(data['id']).then((results)=>{
        this.vm.model = results;
        this.vm.modelMap = reduce(results,(res,value)=>{
          res[value['paramsKey']] = 0;
          return res;
        },{});
        // console.log(this.vm.modelMap);
        return this.instance.getCollectorRealData(data['id']);
      }).then(results=>{
        // console.log(results,this.vm.modelMap);
        this.vm.realData = results;
        // 混合对象
        this.vm.modelMap = assign(this.vm.modelMap,results,{});
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        this.vm.realDataLoading = false;
      });
    },

    // 根据采集点获取数据
    getRealData(collectorId){

      return this.instance.getCollectorRealData(collectorId).then(results=>{
        // console.log(results,this.vm.modelMap);
        this.vm.realData = results;

        // 模拟ua装置电压
        this.vm.modelMap = results; //assign(this.vm.modelMap,assign(results,{'Ua':random(200,220)}),{});

      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      }).finally(()=>{
        clearInterval(this.vm.realDataTimer);
        this.vm.realDataTimer = this.startTimer(1000*5,()=>{
          this.getRealData(collectorId);
        });
      });
    },

    startTimer(interval, cb) {
      // console.log(interval);
      this.vm.realDataTimer = setTimeout(()=> {
        cb();
      }, 5 * 1000);
      return this.vm.realDataTimer;
    },

    getDataModelByCollectorId(collectorId){
      return this.instance.getDataModelByCollectorId(collectorId).then(results=>{
        console.log(results);
      }).catch(error => {
        this.$message({type: 'error',message: (error.message || (error.status + ' ' + error.statusText)),duration: 3500});
      })
    }
  },
  filters: {

  }
}
