/**
 * Created by lixiansky on 2021/7/5
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import SpareParts from '../index';
import find from 'lodash/find';
import {request} from '@/components/mixins/request';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
export default {
  mixins: [request],
  watch: {
    'vm.filterText'(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10,20,30,40,50,100],
      breadcrumbList: [],
      instance: new SpareParts(),
      vm: {
        filterText: '',
        treeData:[],
        // 设备类型数据
        equipmentTreeData: [],
        props:{
          label: 'typeName',
        },
        spareDialogFormVisible: false,
        addSpareDialogFormVisible: false,
        form:{
          "typeName": "",
          "typeCode": "",
          "pId":"",
          parentTypeName: '',
        },
        rules: {
          typeName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          typeCode: [
            {required: true, message: '请输入编码', trigger: 'blur'},
          ],
        },
        spareForm:{
          spareName: '',
          spareCode: '',
          spareTypeId: '',
          spareTypeName: '',
          spareUnitCode: '',
          spareUnitName: '',
          spareModel: '',
          equipTypeIds: [],
        },
        spareRules:{
          spareName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          spareCode: [
            {required: true, message: '请输入编码', trigger: 'blur'},
          ],
          spareModel: [
            {required: true, message: '请输入型号', trigger: 'blur'},
          ],
          spareUnitCode: [
            {required: true, message: '请选择单位', trigger: 'blur'},
          ],
        },
        currentNode: {},
        spareUnits: [],
        dataLoading: [false, false],
        typeTreeDataLoading: [false,false],
      },
      queryObj: {
        name: '',
        formType: '',
      }
    };
  },
  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '备品种类'}
    ]);

    // 获取任务列表
    this.getTableData(1,this.pageSizes[0]);

    this.getSpareTreeData();
  },

  methods: {
    getTableData(pageNumber,pageSize,params){
      this.$set(this.vm.dataLoading,1,true);
      this.requestProcess(this.instance.getData(pageNumber,pageSize,params)).then((res)=>{
        this.tableData = res.data;
        this.pageData = res.page;
      }).finally(()=>{
        this.$set(this.vm.dataLoading,1,false);
      });
    },

    // pageSize 改变时会触发
    handleSizeChange(pageSize){
      console.log(this.pageData);
      this.getTableData(1,pageSize);
    },

    // currentPage 改变时会触发
    handleCurrentChange(pageNumber){
      // console.log(pageNumber,this.pageData['pageSize']);
      this.getTableData(pageNumber,this.pageData['pageSize']);
    },

    // 获取数据
    getSpareTreeData(){
      this.$set(this.vm.dataLoading,0,true);
      this.requestProcess(this.instance.getSpareTreeData()).then((results)=>{
        this.vm.treeData = isArray(results.data) ? [{typeName: '全部',typeCode: '',id: '',children: results.data,pId: '-1'}]: [];
      }).finally(()=>{
        this.$set(this.vm.dataLoading,0,false);
      });
    },

    // 添加备件类型
    addSpare(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.instance.saveSpareType(this.vm.form).then(()=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.resetForm('spareForm');
            this.getSpareTreeData();
          }).catch(error => {
            this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          });
        } else {
          return false;
        }
      });
    },

    updateSpare(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.instance.updateSpareType(this.vm.form).then(()=>{
            this.$message({
              type: 'success',
              message: '更新成功!'
            });
            this.resetForm('spareForm');
            this.getSpareTreeData();
          }).catch(error => {
            this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          });
        } else {
          return false;
        }
      });
    },

    resetForm(formName) {
      this.vm.spareDialogFormVisible = false;
      this.vm.addSpareDialogFormVisible = false;
      this.$refs[formName] && (this.$refs[formName].resetFields());

      this.vm.form = {
        "typeName": "",
        "typeCode": "",
        "pId":"",
        parentTypeName: '',
      };

      this.vm.spareForm = {
        spareName: '',
        spareCode: '',
        spareTypeId: '',
        spareTypeName: '',
        spareUnitCode: '',
        spareUnitName: '',
        spareModel: '',
      };
    },

    editTreeItem(node){
      this.vm.form = JSON.parse(JSON.stringify(node));
      this.vm.spareDialogFormVisible = true;

    },

    // 添加树子节点
    appendTreeItem(node){
      this.vm.spareDialogFormVisible = true;
      this.vm.form.pId = node['id'];
      this.vm.form.parentTypeName = node['typeName'];
    },

    // 移除类型
    removeTreeItem(node,data){
      this.$confirm(`此操作将删除备件分类【${data.typeName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.instance.removeSpareTypeById(data['id']);
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.resetForm('spareForm');
        this.getSpareTreeData();
      }).catch(error => {
        error['message'] && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },

    // 处理选中之后的
    handleNodeClick(data) {
      this.vm.currentNode = data;
      this.getTableData(1,this.pageData['pageSize'],{conditionConfig: {
          "logic": 1,
          conditions:[
            {
              "opCode": "EQUAL",
              "paramsKey": "spareTypeId",
              "targetCode": data['id']
            }
          ]
        }});
    },

    refreshSpareData(){
      this.getTableData(1,this.pageData['pageSize'],{conditionConfig: {
          "logic": 1,
          conditions:((data)=>{
            return data['typeCode'] ? [
              {
                "opCode": "EQUAL",
                "paramsKey": "typeCode",
                "targetCode": data['typeCode']
              }
            ] : [];
          })(this.vm.currentNode),
        }});
    },

    spareDialogOpened(){

      // 获取备件单位字典数据
      this.$set(this.vm.typeTreeDataLoading, 0, true);
      this.requestProcess(this.instance.getDictByType('spareUnit')).then((results)=>{
        this.vm.spareUnits = results['dataList'];
        return this.requestProcess(this.instance.getEquipmentTypeTree());
      }).then((results)=>{
        this.vm.equipmentTreeData = results['data'];

        // console.log(this.vm.spareForm['equipTypeIds']);
        this.$refs.equipmentTree.setCheckedKeys((this.vm.spareForm['equipTypeIds'] ? this.vm.spareForm['equipTypeIds']: []));
      }).finally(()=>{
        this.$set(this.vm.typeTreeDataLoading, 0, false);
      });
    },

    // 添加备件
    addSpareByType(type){
      this.vm.spareForm = {
        spareTypeId: type['id'],
        spareTypeName: type['typeName'],
        spareName: '',
        spareCode: '',
        spareUnitCode: '',
        spareUnitName: '',
        spareModel: '',
      };
      this.vm.addSpareDialogFormVisible = true;
    },

    chooseSpareUnit(value){
      // console.log(value);
      let _unit = find(this.vm.spareUnits,{'id': value});
      _unit && (this.vm.spareForm.spareUnitName =  _unit['name']);
    },

    // 保存备件
    saveSpare(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.$refs.equipmentTree.getCheckedKeys());
          this.vm.spareForm.equipTypeIds = this.$refs.equipmentTree.getCheckedKeys();
          this.instance.saveSpare(this.vm.spareForm).then(()=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.resetForm('addSpareForm');
            this.handleNodeClick(this.vm.currentNode);
          }).catch(error => {
            this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          });
        } else {
          return false;
        }
      });
    },

    // 移除备件
    removeSpare(spare){
      this.instance.removeSpareById(spare['id']).then(()=>{
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.resetForm('addSpareForm');
        this.handleNodeClick(this.vm.currentNode);
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 编辑备件
    editSpare(spare){
      this.requestProcess(this.instance.getSpareById(spare['id'])).then((results)=>{
        this.vm.spareForm = results.data;
        this.vm.addSpareDialogFormVisible = true;
      });
    },

    modifySpare(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.$refs.equipmentTree.getCheckedKeys());
          this.vm.spareForm.equipTypeIds = this.$refs.equipmentTree.getCheckedKeys();
          this.instance.updateSpare(this.vm.spareForm).then(()=>{
            this.$message({
              type: 'success',
              message: '更新成功!'
            });
            this.resetForm('addSpareForm');
            this.vm.currentNode && (this.handleNodeClick(this.vm.currentNode));
          }).catch(error => {
            this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          });
        } else {
          return false;
        }
      });
    },

    changeStatus(item, validity){
      this.vm.dataLoading[1] = true;
      this.requestProcess(this.instance.changeStatus(item.id, (validity>0 ? 1 : 0))).then(res => {
        res.data ? (
          this.$message({
            type: 'success',
            message: '操作成功！'
          }), this.refreshSpareData()): (item.validity = (validity>0 ? 1: 0));
      }).finally(()=>{
        this.vm.dataLoading[1] = false;
      });
    }

  },
  filters: {

  }
}
