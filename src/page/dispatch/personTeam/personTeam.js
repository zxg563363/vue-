import Breadcrumb from '../../../components/breadcrumb/breadcrumb'
import {addWorkTeam, getWorkTeam, editWorkTeam, delWorkTeam, userListTeam, userToTeam, removeTeamUser} from '../../../axios/dispatch/personTeam'
import {depTree} from "../../../axios/systemManage/station";
import { userList } from "../../../axios/systemManage/station"
import moment from 'moment'
import { ellipsis } from '../../../filters/index'
import findIndex from 'lodash/findIndex';
import {request} from '@/components/mixins/request';
export default {
    name: '',
    mixins: [request],
    data() {
        return {
            breadcrumbList:[],
            formTypeList:[
                {name:'巡检',value:'check'},
                {name:'点检',value:'point'},
                {name:'保养',value:'protect'},
            ],
            formTypeValue:'check',
            dialogWorkTeam:false,
            workTeamFrom:{
                name:'',
                formType:'check',
            },
            workTeamRule:{
                name: [
                    {required: true, message: '班组名称不能为空', trigger: 'blur'}
                ],
                formType: [
                    { required: true, message: '请选择表单类型', trigger: 'change' }
                ],
            },
            workTeamFromBtn:'立即创建',
            workTeamTrees:[],
            workTeamProps:{
                children: 'children',
                label: 'name',
            },
            teamData:null,
            page:1,
            rows:6,
            currentPage: 1,
            total:0,
            loading:true,
            loadingDevice:true,
            showDvice:true,
            drawerAddUser:false,
            depTreeDatas:[],
            depProps:{
                children: 'children',
                label: 'departName',
            },
            rows1:6,
            page1:1,
            total1:0,
            currentPage1:1,
            userTableData:[],
            userTableLoading:false,
            tableData:[],
            departId:'',
            activeName:'person',
            drawerAddDevice:false,
            deviceTreeDatas:[],
            deviceProps:{
                children: 'children',
                label: 'typeName',
            },
            rowsDevice:6,
            pageDevice:1,
            currentPageDevice:1,
            totalDevice:0,
            deviceTypeId:'',
            deviceTableData:[],
            deviceTableLoading:false,
            tableDevice:[],
            vm:{
              currentNode: {},
              dataLoading: false,
            }
        }
    },
    mounted() {
        this.toBreadcrumb();  //面包屑
        this.getWorkTeamList(this.formTypeValue);
    },
    created() {

    },
    methods: {
        modifyWorkTeam(data){
          this.dialogWorkTeam = true;
          this.workTeamFrom = JSON.parse(JSON.stringify(data));
        },
        submitWorkTeamFrom(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.vm.dataLoading = true;
                  let _promiseReq = this.requestProcess(this.workTeamFrom['id'] ? editWorkTeam(this.workTeamFrom,this.workTeamFrom['id']) : addWorkTeam(this.workTeamFrom));
                  _promiseReq.then(res => {
                    if(res.data) {
                      this.$message({
                        type: 'success',
                        message: '操作成功！'
                      });
                      this.getWorkTeamList(this.formTypeValue);
                    }
                  }).finally(()=>{
                    this.vm.dataLoading = false;
                    this.dialogWorkTeam = false;
                  });

                }
            })
        },
        getWorkTeamId(data) {
            this.teamData = data;
            this.getUserList(data['id']);
        },
        WorkTeamRemove(data) {
          this.teamData = data;
            this.$confirm(`此操作将删除【${data['name']}】班组, 是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              this.requestProcess(delWorkTeam(data['id'])).then(res => {
                    if(res.data) {
                        this.getWorkTeamList(this.formTypeValue);
                        this.$message({
                            type: 'success',
                            message: '删除班组成功!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        getWorkTeamList(formType) {
          this.vm.dataLoading = true;
            this.requestProcess(getWorkTeam({formType:formType})).then(res =>{
                this.workTeamTrees = res.data;
                if(res.data && res.data.length > 0) {
                    (res.data.length > 0) && (this.teamData = res.data[0], this.getUserList(res.data[0]['id']));
                    this.$nextTick(() => {
                        this.$refs.workTeamRef.setCurrentKey(res.data[0].id);
                    });
                } else {
                    this.teamData = null;
                    this.loading = false;
                }
            }).finally(()=>{
              this.vm.dataLoading = false;
            })
        },

        getUserList(teamId) {
          this.loading = true;
          this.requestProcess(userListTeam({teamId})).then(res => {
            this.tableData = res.data;
          }).catch(e=>{
            this.tableData = [];
          }).finally(()=>{
            this.loading = false;
          });
        },
        addPerson() {
            if(!this.teamData) {
                this.$message({
                    message: '请先添加班组',
                    type: 'warning'
                });
                return false;
            }
            this.drawerAddUser = !this.drawerAddUser;
            this.depTreeDatas = [];
            this.requestProcess(depTree()).then(res => {
                  this.depTreeDatas = res.dataList;
                  this.depTreeDatas.unshift({
                      departName:'全部部门',
                      departId:''
                  });
                  // console.log(this.depTreeDatas);
                  this.departId = res.dataList[0].departId;
                  this.getUsers(res.dataList[0].departId);
                  this.$nextTick(() => {
                      this.$refs.depTreeRef.setCurrentKey(res.dataList[0].departId);
                  })
            });

        },
        getUsers(departId) {
            let startDate = moment().format('YYYY-MM-DD HH:mm:ss');
            let nd = moment(startDate).valueOf();
            let params = {
                validity:1,
                _search:false,
                rows:this.rows1,
                page:this.page1,
                sidx:'',
                sord:'asc',
                departId:departId
            }
          this.requestProcess(userList(params)).then(res => {
                for(var i = 0; i < this.tableData.length; i++) {
                    for(var j = 0; j < res.dataList.length; j++) {
                        if(this.tableData[i].id == res.dataList[j].id) {
                            res.dataList[j]['checkedMe'] = true;
                        }
                    }
                }
                this.userTableData = res.dataList;
                this.userTableLoading = false;
                this.total1 = res.page.recordCount;
            })
        },
        addUserToTable(data) {
            //点击添加成员
          data['checkedMe'] = true;
          if(findIndex(this.tableData,{id: data['id']})>-1){
            this.$message({message:'已存在，请勿重复添加',duration: 1000,type: 'warning'});
            return false;
          }
          this.tableData.push(data);
        },
        delUserToTable(data) {
            //点击删除成员
            for(var i = 0; i < this.userTableData.length; i++) {
                if(this.userTableData[i].id == data.id) {
                    delete this.userTableData[i]['checkedMe'];
                }
            }
            for(var i = 0; i < this.tableData.length; i++) {
                if(this.tableData[i].id == data.id) {
                    this.tableData.splice(i,1)
                }
            }
        },
        handleSizeChange1(val) {
            this.rows1 = val;
            this.page1 = 1;
            this.currentPage1 = 1;
            this.userTableLoading = true;
            this.getUsers(this.departId)
        },
        handleCurrentChange1(val) {
            this.page1 = val;
            this.userTableLoading = true;
            this.getUsers(this.departId)
        },
        resetSaveUsers() {
            //取消
            this.drawerAddUser = !this.drawerAddUser;
            this.rows = 6;
            this.page = 1;
            this.currentPage = 1;
            this.getUserList(this.teamData.id);
        },
        saveUsers() {
            //保存成员信息
          let params = {
              teamId:this.teamData.id,
              userIdArr:[]
          };
          for(var i = 0; i < this.tableData.length; i++) {
              params.userIdArr.push(this.tableData[i].id)
          }
          this.loading = true;
          this.requestProcess(userToTeam(params)).then(res =>{
              if(res.data) {
                  this.$message({
                      type: 'success',
                      message: '添加成员成功!'
                  });
                  this.drawerAddUser = false;
              } else {
                  this.$message({
                      message: '添加失败，请重试',
                      type: 'warning'
                  });
              }

          }).finally(()=>{
            this.getUserList(params.teamId);
            this.loading = false;
          })
        },
        getDepId(data) {
            if(data.departName == '全部部门' && data.departId == 'abcd') {
                this.departId = '';
            } else {
                this.departId = data.departId;
            }
            this.getUsers(this.departId);
        },
        toBreadcrumb() {
            //面包屑
            this.breadcrumbList = [
                { path:'/', name:'首页' },
                { name:'系统管理' },
                { name:'班组管理' }
            ]
        },
        removeUserForWorkTeam(user){
            this.requestProcess(removeTeamUser(this.teamData['id'], user.id)).then(res=>{
                res.data && (this.$message({
                    type: 'success',
                    message: '移除成员成功!'
                }));
                !res.data && (this.$message({
                    type: 'warning',
                    message: '移除成员失败!'
                }));
            }).finally(()=>{
                this.getUserList(this.teamData['id']);
            });
        },
    },
    components: {
        Breadcrumb
    },
}
