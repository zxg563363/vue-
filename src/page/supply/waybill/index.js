/**
 * Created by lixiansky on 2021/10/20
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Supply from '../index';
import {request, variables} from '@/components/mixins/request';
export default {
  mixins: [request, variables],
  components: {Breadcrumb,},
  data() {
    return {
      instance: new Supply(),
      activeNames: [],
      remoteLoading: false,
      vm: {}
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '发货单管理'}
    ]);

  },
  methods: {

  },
}
