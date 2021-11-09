/**
 * Created by lixiansky on 2021/9/10
 */
const wordOrder = {
  data() {
    return {
      statusMap: {
        'ALL': {
          id: 0,
          label: '全部',
          type: '',
        },
        'NEW': {
          id: 1,
          label: '新建',
          type: '',
        },
        'WAITING': {
          id: 2,
          label: '待处理',
          type: 'warning'
        },
        'DOING': {
          id: 3,
          label: '处理中',
          type: 'warning'
        },
        'OK': {
          id: 4,
          label: '已完成',
          type: 'success'
        },
        'CANCEL': {
          id: 5,
          label: '已取消',
          type: 'danger'
        }
      }
    }
  }
};
export {wordOrder};
