/**
 * Created by lixiansky on 2021/9/27
 */
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import reduce from 'lodash/reduce';
export default {
  name: 'PlcCommand',
  mixins: [request, variables],
  data() {
    return {
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.tableDataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-electricity/plc/commands',
        method: 'get',
      })).then((res)=>{
        this.tableData = reduce(res.data,(results, value)=>{
          value['checked'] = false;
          results.push(value);
          return results;
        },[]);
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },
    opened(){

    },
    confirmAddEquipment(){
      this.$props.confirm(((tableData)=>{
        return reduce(tableData,(results, value)=>{
          if(value['checked']) {
            results.ids.push(value['id']);
            results.names.push(value['commandName']);
            results.map[value['id']] = {id: value['id'], name: value['commandName']};
          }
          return results;
        },{ids: [], names: [],map:{}});
      })(this.tableData));
    },
    cancelAddEquipment(){
      this.$props.cancel();
    },
  },
  computed: {
    totalNum: function () {
      return reduce(this.tableData,(results, value)=>{
        results = results+(~~value['checked']);
        return results;
      },0)
    }
  },
  props: {
    open: { // 父组件传来的id
      type: Boolean
    },
    confirm:{
      type: Function, //参数类型：函数
      required: true,
    },
    cancel:{
      type: Function, //参数类型：函数
      required: true,
    }
  }
}
