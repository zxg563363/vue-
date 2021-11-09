/**
 * Created by lixiansky on 2021/10/20
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Stock from '../index';
import {request, variables} from '@/components/mixins/request';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
export default {
  mixins: [request, variables],
  components: {Breadcrumb,},
  data() {
    return {
      instance: new Stock(),
      activeNames: [],
      remoteLoading: false,
      vm: {}
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '备件库存'}
    ]);

    // 查询库存
    this.getStockInventory(1, this.pageSizes[1],{});
  },
  methods: {
    getStockInventory(pageNumber, pageSize, params){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getStockInventory(pageNumber, pageSize, params)).then(res => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(() => {
        this.tableDataLoading = false;
      });
    },

    handleSizeChange(pageSize) {
      this.getStockInventory(1, pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber) {
      this.getStockInventory(pageNumber, this.pageData['pageSize']);
    },
  },
}
