/**
 * Created by lixiansky on 2021/7/7
 */
import request from "@/axios/request";
import assign from 'lodash/assign';
import concat from 'lodash/concat';
import forEach from 'lodash/forEach';
export default {
  name: "DeviceListDialog",
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [5,10,20,30,40,50,100],
      queryObj: {
        equipCode: '',
        equipName: '',
        model: '',
        typeId: '',
        spaceId: '',
      },
      vm:{
        deviceTypeTreeData: [],
        deviceSpaceTreeData: [],
        // 选择的数据
        selectionData: [],
      }
    };
  },
  mounted() {
    this.getTableData(1,this.pageSizes[0]);

    this.getDeviceTypeData();
    this.getDeviceSpaceData();
  },
  updated () {
    // this.vm.selectionData.forEach(row => {
    //   // console.log(row);
    //   this.$refs.deviceListTable.toggleRowSelection(this.tableData[1],true);
    // });
  },
  methods: {

    getTableData(pageNumber,pageSize,params){
      this.getData(pageNumber,pageSize,params).then((res)=>{
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      // console.log(this.pageData);
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },

    getData(page,rows,params) {
      return request({
        url: '/api-capital/equipments/search',
        method: 'post',
        data:((_params)=>{
          return assign({
            page,rows
          },_params)
        })((params ? params : {})),
      })
    },

    // 获取设备类型
    getDeviceTypeData() {
      return request({
        url: '/api-capital/equipment/type',
        method: 'get',
        params: {},
      }).then((res)=>{
        this.vm.deviceTypeTreeData = res.data;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 获取空间数据
    getDeviceSpaceData() {
      return request({
        url: '/api-capital/space',
        method: 'get',
        params: {},
      }).then((res)=>{
        this.vm.deviceSpaceTreeData = res.data;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    confirmAddEquipment(){
      // this.$refs.deviceListTable.selection
      this.$props.confirm(this.$refs.deviceListTable.selection);
    },
    cancelAddEquipment(){
      this.$props.cancel();
    },
    onSubmit(){
      let params = {
        conditionConfig: {
          "logic": 1,
          "conditions": [
            {
              "paramsKey": "equipCode",
              "opCode": "LIKE",
              "targetCode": this.queryObj.equipCode
            },
            {
              "paramsKey": "equipName",
              "opCode": "LIKE",
              "targetCode": this.queryObj.equipName
            },
            {
              "paramsKey": "model",
              "opCode": "LIKE",
              "targetCode": this.queryObj.model
            }
          ],
        },
        "params":{
          "typeId": this.queryObj.typeId ,  //设备类型ID
          "spaceId" : this.queryObj.spaceId , //空间ID
        }
      };

      this.getTableData(1,this.pageSizes[0],params);
    },

    onReset(){
      this.queryObj = {
          equipCode: '',
          equipName: '',
          model: '',
          typeId: '',
          spaceId: '',
      };
      this.getTableData(1,this.pageSizes[0])
    },
    handleChange(selection,row){
        this.vm.selectionData = this.$refs.deviceListTable.selection
    },
    getRowKey (row) {
      return row.id
    },
    opened(){
      // console.log(111)
      this.$refs.deviceListTable && (this.$refs.deviceListTable.clearSelection());
    },
  },
  props: {
    open: { // 父组件传来的id
      type: Boolean
    },
    confirm:{
      type: Function, //参数类型：函数
      required: true,
    },
    cancel:{
      type: Function, //参数类型：函数
      required: true,
    }
  }
}
