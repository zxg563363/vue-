/**
 * Created by lixiansky on 2021/8/18
 */
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "../../axios/request";
export default {
  name: "DeviceType",
  mixins: [request, variables],
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: '',
      vm: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取设备类型

    getData(){
      this.treeDataLoading = true;
      return this.requestProcess(axiosInstance({
        url: '/api-capital/equipment/type',
        method: 'get',
        params: {},
      })).then(res => {
        this.treeData = res.data;
      }).finally(()=>{
        this.treeDataLoading = false;
      });
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },
    setCurrentKey(key){
      this.$refs.tree.setCurrentKey(key);
    },
    setCurrentNode(node) {
      this.$nextTick(()=>{
        this.$refs.tree.setCurrentNode(node);
      });
    },
    getCurrentNode(){
      // console.log(this.$refs.tree.getCurrentNode());
      return this.$refs.tree.getCurrentNode();
    },
    getNode(key){
      return this.$refs.tree.getNode(key);
    },
  },
  props: {
    // 完成后的回调
    onClickNode: {
      type: Function,
      required: true,
    }
  }
}
