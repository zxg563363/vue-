/**
 * Created by lixiansky on 2021/7/26
 */
import WorkOrderDetail from '@/components/WorkOrderDetail/WorkOrderDetail';
export default {
  inject:['reload'],
  data() {
    return {
      //工单编号
      uuId: (()=>{
        return this.$router.history.current.params['uuId'];
      })(),
    }
  },
  components: {
    WorkOrderDetail,
  },
  mounted() {

  },
  methods: {

    // 初始化
    init(results){
      console.log(results);
    },
  },
  filters: {

  }
}
