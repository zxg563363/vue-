/**
 * Created by lixiansky on 2021/8/11
 */
import {axiosInstance} from "@/axios/request";
import {request} from '@/components/mixins/request';
import {mapGetters} from "vuex";
import TaskRecord from '@/components/TaskRecord/TaskRecord';
import assign from 'lodash/assign';
export default {
  inject:['reload'],
  mixins: [request],
  computed: {
    ...mapGetters(["equipmentStatusMapping"]),
  },
  data() {
    return {
      //设备编号
      uuId: (()=>{
        return this.$router.history.current.params['uuId'];
      })(),

      // 设备信息
      equipment: {
        extension: {
          formFields:{
            list: [],
          }
        }
      },
      dataLoading: false,

      // 备件信息
      spareTableData: [],
      qrCode: '',
      workData: [],
      pageData: {},
      pageSizes: [7, 10, 20, 30, 40, 50, 100],
      workDataLoading: false,

      // 备件使用情况
      spareUsageData: [],
    }
  },
  components: {TaskRecord},
  mounted() {
    this.getEquipment();
  },
  methods: {

    // 获取设备信息
    getEquipment(){
      this.dataLoading = true;
      this.requestProcess(axiosInstance({
        url: `/api-capital/equipments/${this.uuId}`,
        method: 'get',
        params:{},
      })).then(res => {
        this.equipment = res.data;
        this.getTableData({equipType: res.data['typeId']});
        // 获取工单
        this.getEquipmentOrder(1,this.pageSizes[0]);

        // 获取备件消耗情况
        this.spareUsage();
      }).finally(()=>{
        this.dataLoading = false;
      })
    },

    // 查询备件
    getTableData(params){
      this.requestProcess(axiosInstance({
        url: '/api-capital/spare/equip/can/use/'+params['equipType'],
        method: 'get',
        params:{},
      })).then(res=>{
        this.spareTableData = res.data;
      });
    },

    getEquipmentOrder(page, rows){
      this.workDataLoading = true;
      this.requestProcess(axiosInstance({
        url:'/api-global/ops/repair/search',
        method:'post',
        data: {
          "conditionConfig": {
            "logic": 1,
            "conditions": [
              {
                "opCode":"EQUAL",
                "paramsKey":"pointId",
                "targetCode": this.equipment.id
              },
            ]
          },
          "rows": rows,
          "page": page,
          "sidx": "",
          "sord": "asc"
        }
      })).then(res =>{
        this.workData = res.data;
        this.pageData = res.page;
      }).finally(()=>{
        this.workDataLoading = false;
      });
    },
    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      this.getEquipmentOrder(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      this.getEquipmentOrder(pageNumber,this.pageData['pageSize']);
    },

    // 备件消耗情况
    spareUsage(){
      this.requestProcess(axiosInstance({
        url: '/api-global/ops/report/repair/point/use/spare',
        method:'get',
        params: {
          pointId: this.equipment.id,
          start: '',
          end: '',
        }
      })).then(res =>{
        console.log(res);
        this.spareUsageData = res.data;
      });
    }
  },
  filters: {

  }
}
