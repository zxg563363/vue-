/**
 * Created by lixiansky on 2021/9/8
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import PowerSwitchDetail from '@/page/extends/powerSwitchDetail/powerSwitchDetail';
import {request, variables} from '@/components/mixins/request';
import PowerSwitch from "../index";
export default {
  mixins: [request, variables],
  components: {
    Breadcrumb,
    PowerSwitchDetail,
  },
  data() {
    return {
      instance: new PowerSwitch(),
    }
  },
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '停送电申请详情'}
    ]);
  },
  methods: {

  }
}
