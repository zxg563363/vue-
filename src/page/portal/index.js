/**
 * Created by lixiansky on 2021/8/27
 */
export default {
  data() {
    return {
      icons: [
        require('../../static/img/portal/icon/shebeiguanli.png'),
        require('../../static/img/portal/icon/gongdian.png'),
        require('../../static/img/portal/icon/diaoduzhihui.png'),
        require('../../static/img/portal/icon/jizhongkongzhi.png'),
        require('../../static/img/portal/icon/shengchanguanli.png'),
        require('../../static/img/portal/icon/anquanguanli.png'),
        require('../../static/img/portal/icon/jingying.png'),
        require('../../static/img/portal/icon/jichupingtai.png')
      ]
    }
  },
  methods: {
    showLoading(){
      this.$msgbox({
        showClose: false,
        showCancelButton: false,
        showConfirmButton: false,
      });
    }
  }
}
