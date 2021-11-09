/**
 * Created by lixiansky on 2021/7/26
 */
export default {
  name: "WorkOrderProgress",
  data() {
    return {
      active: 0, //步骤
      stepsMapping: (() => {
        return this.$store.state['workOrderMapping'];
      })(),
    }
  },
  components: {},
  mounted() {
    this.active = this.installProgress(this.status);
  },
  methods: {
    installProgress(status){
      let _step = this.stepsMapping[status];
      return _step ? _step['active'] : 0;
    }
  },
  filters: {

  },
  props: {
    status: { // 父组件传来的id
      type: String,
      required: true,
    },
  }
}

