/**
 * Created by lixiansky on 2021/9/2
 */
import {request} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
export default {
  template: require('../template/collector.html'),
  mixins: [request],
  data() {
    return {
      collectorData: {
        transmit:{}
      },
      dataLoading: false,
    }
  },
  mounted() {
    this.collectorId && (this.getCollectorById(this.collectorId));
  },
  methods: {
    getCollectorById(collectorId){
      this.dataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-electricity/collectors/'+collectorId,
        method: 'get',
        params: {}
      })).then(res=>{
        this.collectorData = res.data;
      }).finally(()=>{
        this.dataLoading = false;
      });
    }
  },
  watch: {
    collectorId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.getCollectorById(newVal);
        }
      }
    }
  },
  props: {
    collectorId: { // 传感器id
      type: true,
      required: false,
    }
  }
};
