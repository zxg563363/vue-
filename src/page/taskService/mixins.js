/**
 * Created by lixiansky on 2021/9/26
 */
const taskService = {
  data() {
    return {
      taskType: {
        equipment: {
          label: '设备信息',
        },
        equipmentPowerSwitch: {
          label: '设备停送电',
        },
        equipmentQRCode: {
          label: '设备二维码',
        }
      }
    }
  }
};
export {taskService};
