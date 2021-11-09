/**
 * Created by lixiansky on 2021/8/30
 */
import {request} from '@/components/mixins/request';
import {axiosInstance, axios} from "@/axios/request";
import {MQTT} from '@/components/mixins/mqtt';
import uniqueId from 'lodash/uniqueId';
import collector0001 from './js/collector0001';
import collector0002 from './js/collector0002';
import collector0004 from './js/collector0004';
import collector0007 from './js/collector0007';
import collector0009 from './js/collector0009';
import Vue from 'vue';
export default {
  name: "RealTimeData",
  mixins: [request, MQTT],
  components: {
    // 线路型
    'collector0001': Vue.extend(collector0001),
    // 厂用型 0002
    'collector0002': Vue.extend(collector0002),
    // 电动机型 0003
    'collector0003': Vue.extend(collector0001),
    // PT型 0004
    'collector0004': Vue.extend(collector0004),
    // 差动型 0005
    'collector0005': Vue.extend(collector0004),
    // 备自投型 0006
    'collector0006': Vue.extend(collector0004),
    // 低压 0007
    'collector0007': Vue.extend(collector0007),
    // 除尘机 0009
    'collector0009': Vue.extend(collector0009),
  },
  data() {
    return {
      uuid: uniqueId('real-time-data-'),
    }
  },
  watch: {
    collectorId: {
      immediate: true, // 很重要！！
      handler(newVal, oldVal) {
        // console.log(newVal,oldVal);
        oldVal && (this.unsubscribeMQTT(oldVal));
        newVal && (this.subscribeMQTT(this.mqttClient, newVal));
      }
    },
  },
  mounted() {
    this.mqttClient = this.connectMQTT();
    this.handleMQTT(this.mqttClient,this.collectorId);
  },
  methods: {

  },
  props: {
    collectorId: { // 传感器id
      type: String,
      required: false,
    },
    externalTypeCode: {
      type: String,
      required: false,
    }
  }
}
