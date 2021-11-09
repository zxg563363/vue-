/**
 * Created by lixiansky on 2021/7/19
 */
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import WorkOrder from '../index';
import layer from "layui-layer";
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      tableData: [],
      pageData: {},
      pageSizes: [10, 20, 30, 40, 50, 100],
      breadcrumbList: [],
      instance: new WorkOrder(),
      vm: {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        queryObj:{
          slaName:'',
          applyTime: '',
        },
        tableDataLoading: false,
      }

    }
  },

  components: {
    Breadcrumb
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      {name: '服务协议列表'}
    ]);

    // 获取延期申请列表
    this.getTableData(1,this.pageSizes[0]);
  },
  methods: {

    getTableData(pageNumber, pageSize, params) {
      this.vm.tableDataLoading = true;
      this.instance.getAgreementData(pageNumber, pageSize, params).then((res) => {
        this.tableData = res.data;
        this.pageData = res.page;
      }).catch(error => {
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      }).finally(()=>{
        this.vm.tableDataLoading = false;
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
    onSubmit(){
      this.getTableData(1,this.pageData['pageSize'],{
        conditionConfig: {
          "logic": 1,
          "conditions": ((query)=>{
            let _con = [];
            if(query.slaName){
              _con.push({
                "opCode": "EQUAL",
                "paramsKey": "slaName",
                "targetCode": query.slaName,
              })
            }

            return _con;
          })(this.vm.queryObj),
        }
      });
    },
    onReset(){
      this.vm.queryObj = {slaName: ''};
      this.onSubmit();
    },

    // 添加服务协议
    addAgreement(){
      layer.open({
        type: 2,
        title: ['添加服务协议', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: ['/coal-midway/operation_config_midway.html?token='+VueCookies.get('access_token'), 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          this.getTableData(1,this.pageSizes[0]);
        },
      });
    },
    modifyAgreement(row){
      layer.open({
        type: 2,
        title: ['编辑服务协议【'+row.slaName+'】', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1280px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        content: ['/coal-midway/operation_config_midway.html?uuId='+row['id']+'&token='+VueCookies.get('access_token'), 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          this.onSubmit();
        },
      });
    },

    viewAgreement(row){
      layer.open({
        type: 2,
        title: ['设置服务水平【'+row.slaName+'】', 'font-size:14px; font-weight:bold;'],
        shade: 0.3,
        shadeClose: false,
        maxmin: true, // 开启最大化最小化按钮
        area: ['1400px', '660px'],
        offset: 'auto', // 右下角弹出
        anim: 2,
        // 120.133.52.105:8009
        content: ['/coal-midway/operation_config_midway.html?uuId='+row['id']+'&isSetting=true&token='+VueCookies.get('access_token'), 'yes'], // iframe的url，no代表不显示滚动条
        end: ()=> {
          this.onSubmit();
        },
      });
    },

    // 移除
    removeAgreement(row){
      this.$confirm(`是否要删除服务协议【${row.slaName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.instance.deleteAgreement(row['id']).then(()=>{
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success',
            onClose:(message)=>{
              this.onSubmit();
            }
          });
        }).catch(error => {
          this.$message.error((error.message || (error.status + ' ' + error.statusText)));
        });
      })
    }
  }
}

