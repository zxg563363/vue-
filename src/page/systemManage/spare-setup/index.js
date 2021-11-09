/**
 * Created by lixiansky on 2021/10/19
 */
import System from "../index";
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {request, variables} from '@/components/mixins/request';
export default {
  mixins: [request, variables],
  data() {
    return {
      instance: new System(),
    };
  },
  components: {
    Breadcrumb
  },
  mounted() {
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '备件选项设置'}
    ]);
  },
}
