/**
 * Created by lixiansky on 2021/9/13
 */
import DeviceListDialog from '@/components/DeviceListDialog/DeviceListDialog';
import PlcCommand from '@/components/PlcCommand/PlcCommand';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {request, variables} from '@/components/mixins/request';
import Power from '../index';
import reduce from 'lodash/reduce';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
import assign from 'lodash/assign';
import {axios} from "@/axios/request";
export default {
  mixins: [request, variables],
  components: {Breadcrumb, DeviceListDialog, PlcCommand},
  data() {
    return {
      instance: new Power(),
      params: {
        keyword: '',
      },
      vm: {
        dialogVisible: false,
        plcCommandDialogVisible: false,
        plc: {
          plcId: '',
          plcName: '',
          plcModel: '',
        },
        plcRules: {
          plcId: [
            {required: true, message: '请输入编码', trigger: 'blur'},
          ],
          plcName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        plcEquipments: {},
        // 当前设备
        currentEquipment: {},
        currentPlcId: '',
        currentIndex: -1,
      }
    }
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: 'PLC管理'}
    ]);

    this.getData();
  },
  methods: {
    getData(){
      this.tableDataLoading = true;
      this.requestProcess(this.instance.getPLC()).then(res=>{
        this.tableData = reduce(res.data,(results, value)=>{
          value['loading'] = false;
          results.push(value);
          return results;
        },[]);
      }).finally(()=>{
        this.tableDataLoading = false;
      });
    },
    reset(){
      this.params.keyword = '';
      this.$refs['queryForm'].resetFields();
      this.getData();
    },
    search(){
      this.getData();
    },
    bindPlc(formName){
      this.$refs[formName].validate().then(()=>{
        this.dataLoading = true;
        return this.requestProcess(this.instance.bindPLC(this.vm.plc.plcId));
      }).then(res =>{
        if(!res.data){
          this.$message({
            type: 'error',
            message: '绑定错误！'
          });
          return false;
        }
        res.data && (this.$message({
          type: 'success',
          message: '绑定成功！'
        }),this.dialogVisible = false,this.getData());

      }).finally(()=>{
        this.dataLoading = false;
      });
    },
    // 更新plc
    updatePlc(formName){
      this.$refs[formName].validate().then(()=>{
        this.dataLoading = true;
        return this.requestProcess(this.instance.updatePLC(this.vm.plc));
      }).then(res =>{
        if(!res.data){
          this.$message({
            type: 'error',
            message: '更新出错！'
          });
          return false;
        }
        res.data && (this.$message({
          type: 'success',
          message: '更新成功！'
        }),this.dialogVisible = false,this.getData());
      }).finally(()=>{
        this.dataLoading = false;
      });
    },

    // 解绑
    unbindPlc(plcId){
      this.requestProcess(this.instance.unbindPLC(plcId)).then(res =>{
        res.data && (this.$message({
          type: 'success',
          message: '解绑成功！'
        }), this.getData());
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName] && (this.$refs[formName].resetFields());
    },

    addEquipmentToPlc(plc){
      // console.log(plc);
      this.vm.plc = plc.row;
      this.vm.dialogVisible = true;
    },
    confirmAddEquipment(selectedEquipment){

      let _tempMap = reduce(this.vm.plcEquipments[this.vm.plc.id],(results,value)=>{
        value && (results[value['equipId']] = value);
        return results;
      },{});

      let _equipments = reduce(selectedEquipment,(results, value)=>{
        if(!_tempMap[value['id']]) {
          let {equipName, equipCode} = value;
          results.push(this.requestProcess(this.instance.postDeviceByPlcId(this.vm.plc.id,{
            equipId: value['id'], equipName, equipCode,
            commands: '',
            commandNames: '',
            plcDeviceId: '',
            plcAddress: '',
            plcId: this.vm.plc.id,
          })));
        }
        return results;
      },[]);
      // this.$set(this.vm.plcEquipments, `${this.vm.plc.id}`, concat(_equipments,(this.vm.plcEquipments[this.vm.plc.id] ? this.vm.plcEquipments[this.vm.plc.id]: [])));

      // let _equipments = concat(_equipments,(this.vm.plcEquipments[this.vm.plc.id] ? this.vm.plcEquipments[this.vm.plc.id]: []);
      if(_equipments.length <= 0){
        this.$message({
          type: 'warning',
          message: '添加设备已经存在或者设备选择为空！'
        });
        return false;
      }
      axios.all(_equipments).then(res => {
        console.log(res);
        this.$message({
          type: 'success',
          message: '添加成功！'
        });
        this.vm.dialogVisible = false;
        // 刷新
        this.getDeviceByPlcId(this.vm.plc,res);
      }).finally(() => {

      });
    },

    removeEquipment(index,id){
      this.$confirm(`是否要删除【${this.vm.plcEquipments[this.vm.plc.id][index]['equipName']}】设备？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        return this.requestProcess(this.instance.deleteDeviceById(id));
      }).then((res)=>{
        res.data && (this.$message({
          type: 'success',
          message: '移除成功！'
        }), this.getDeviceByPlcId(this.vm.plc,[res]));
      });
    },
    getDeviceByPlcId(expandedRows,expanded){
      if(expanded.length>0) {
        this.vm.plc = expandedRows;
        this.$set(expandedRows, 'loading', true);
        this.requestProcess(this.instance.getDeviceByPlcId(expandedRows.id)).then(res => {
          let _tempData = reduce(res.data,(results, value)=>{
            value['commandMap'] = ((map)=>{
              return reduce(map.ids,(_map, _value, _index)=>{
                _map[_value] = {id: _value, name: (map.names[_index] || '')};
                return _map;
              },{});
            })({
              ids: (value['commands'] ? value['commands'].split(','): []),
              names: (value['command'] ? value['command'].split(','): []),
            });
            results.push(value);
            return results;
          },[]);
          this.$set(this.vm.plcEquipments, `${expandedRows.id}`, _tempData);
        }).finally(() => {
          this.$set(expandedRows, 'loading', false);
        });
      }
    },
    confirmAddCommand(commands){
      let _temp = ((_map)=>{
        return assign(_map, commands.map);
      })(this.vm.currentEquipment['commandMap']);
      // this.vm.currentEquipment = this.vm.plcEquipments[`${this.vm.currentPlcId}`][this.vm.currentIndex];
      this.$set(this.vm.plcEquipments[this.vm.currentPlcId][this.vm.currentIndex],'commandMap',_temp);
      let _commands = reduce(this.vm.currentEquipment['commandMap'],(results, value)=>{
        results.ids.push(value['id']);
        results.names.push(value['name']);
        return results;
      },{ids: [],names: []});
      // console.log(_commands);
      this.vm.currentEquipment.commands = _commands['ids'].join(',');
      this.vm.currentEquipment['commandNames'] = _commands['names'].join(',');

      // 关闭
      this.vm.plcCommandDialogVisible = false;
    },
    // 修改设备
    updateEquipment(item){
      this.requestProcess(this.instance.putDeviceByPlcId(item)).then(res => {
        res.data && (this.$message({
          type: 'success',
          message: '移除成功！'
        }), this.getDeviceByPlcId(this.vm.plc,[res]));
      });
    },
    addCommand(item,index,plcId){
      this.vm.plcCommandDialogVisible = true;
      this.vm.currentEquipment = this.vm.plcEquipments[plcId][index];
      this.vm.currentPlcId = plcId;
      this.vm.currentIndex = index;
    },
    closeTag(command,index,plcId){
      this.$delete(this.vm.plcEquipments[plcId][index]['commandMap'],`${command.id}`);
    }
  }
}
