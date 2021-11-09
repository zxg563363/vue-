/**
 * Created by lixiansky on 2021/10/21
 */
import ApprovalProcessNode from '@/components/ApprovalProcessNode/ApprovalProcessNode';
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
import moment from "moment";
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import layer from "layui-layer";
export default {
  name: 'PowerSwitchDetailSingle',
  mixins: [request, variables],
  components: {ApprovalProcessNode},
  data() {
    return {
      isInIframe: (() => {
        return window.self.frameElement && self.frameElement.tagName === "IFRAME";
      })(),
      icons: [
        require('./assets/tingdian2x.png'),
        require('./assets/gongdian2x.png'),
      ],
    }
  },
  mounted() {
    this.getDetailData(this.uuid);
  },
  methods: {
    // 获取数据
    getDetailData() {
      this.dataLoading = true;
      this.requestProcess(axiosInstance({
        url: '/api-electricity/power_switch',
        method: 'get',
        params: {id: this.uuid},
      })).then(res => {
        this.entityData = res.data;
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    // 查看详细
    viewDetail() {
      layer.open({
        type: 2,
        title: [`查看申请【${this.entityData.pId}】`, 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: [`/index.html#/extends/power-switch/apply/detail/${this.entityData.pId}`, 'yes'], // iframe的url，no代表不显示滚动条
        end: () => {
        },
      });
    },

  },
  props: {
    uuid: { // 父组件传来的id
      type: String,
      required: true,
    },
  }
}
