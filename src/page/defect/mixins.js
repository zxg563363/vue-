/**
 * Created by lixiansky on 2021/9/10
 */
const defectType = {
    data() {
      return {
        TypeMap: {
          '0': {
            id: "0",
            label: '生产',
            type: '',
          },
          '1': {
            id: "1",
            label: '机修',
            type: 'success',
          },
          '2': {
            id: "2",
            label: '电气',
            type: 'warning'
          },
        }
      }
    }
  };
  export {defectType};
  


  const defectStatus = {
    data() {
      return {
        statusMap: {
          '0': {
            id: "0",
            label: '未解决',
            type: 'danger',
          },
          '1': {
            id: "1",
            label: '已解决',
            type: 'success'
          }
        }
      }
    }
  };
  export {defectStatus};