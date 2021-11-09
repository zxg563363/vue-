import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import {depTree, roleAdd, userList,} from '@/axios/systemManage/station';
import {depAdd, depGet, depEdit, depDel, userAdd, userEdit,} from '@/axios/systemManage/department';
import {request} from '@/components/mixins/request';

export default {
  mixins: [request],
  data() {
    return {
      breadcrumbList: [],
      depTrees: [],
      depProps: {
        children: 'children',
        label: 'departName',
      },
      dep: {},
      depTitle: '',
      depFromBtn: '',
      dialogDep: false,
      depFrom: {
        isUpdate: false,
        departName: '',
        pId: 0,
        pName: ''
      },
      depRule: {
        departName: [
          {required: true, message: '部门名称不能为空', trigger: 'blur'}
        ],
      },
      editDepId: '',
      page: 1,
      rows: 10,
      currentPage: 1,
      total: 0,
      userTableLoading: false,
      userTableData: [],
      depHeaderTit: '',
      userTitle: '',
      dialogUsers: false,
      userFrom: {
        isUpdate: null,
        departName: '',
        departId: '',
        pId: '',
        realName: '',
        userEmail: '',
        account: '',
        userPass: '',
        userPhone: '',
        validity: 0
      },
      userRule: {
        realName: [
          {required: true, message: '姓名（昵称）不能为空', trigger: 'blur'}
        ],
        account: [
          {required: true, message: '登陆名不能为空', trigger: 'blur'}
        ],
        userPass: [
          {required: true, message: '登陆默认密码不能为空', trigger: 'blur'}
        ],
        departId: [
          {required: true, message: '请选择所属部门', trigger: 'blur'}
        ],
      },
      depList: [],
      userTitleBtn: '',
      depDisabled: false,
      isAddUser: true,
      userEditId: '',
      treeDataLoading: false,
    }
  },
  mounted() {
    this.toBreadcrumb()
    this.depTreeList()
  },
  methods: {
    depTreeList() {
      //获取左侧部门树
      this.treeDataLoading = true;
      this.requestProcess(depTree()).then(res => {
        this.depTrees = res.dataList;
        this.setName(res.dataList);  //方法遍历树结构，获取所有部门列表
        // this.depTrees.unshift({
        //     departName:'全部部门',
        //     departId:'abcd'
        // });
        this.dep = this.depTrees[0];
        this.$nextTick(() => {
          this.$refs.depTreeRef.setCurrentKey(this.depTrees[0].departId);
        });
        this.depHeaderTit = this.dep.departName;
        //获取用户列表
        this.getUserList();
      }).finally(()=>{
        this.treeDataLoading = false;
      });
    },
    setName(datas) { //遍历树  获取id数组
      for (var i in datas) {
        this.depList.push({
          departId: datas[i].departId,
          departName: datas[i].departName,
        })
        if (datas[i].children) {
          this.setName(datas[i].children);
        }
      }
    },
    getDepId(data) {
      //点击左侧部门树
      this.dep = data;
      this.getUserList()
      this.userTableLoading = true;
      this.depHeaderTit = this.dep.departName;
    },
    getUserList() {
      //获取用户列表
      this.userTableLoading = true;
      let params = {
        rows: this.rows,
        page: this.page,
        departId: this.dep.departId || ''
      };
      this.requestProcess(userList(params)).then(res => {
        this.userTableData = res.dataList;
        this.total = res.page.recordCount;
      }).finally(() => {
        this.userTableLoading = false;
      });
    },
    addPerson(num, data) {
      if (this.dep.pId * 1 == 0 && num == 1) {
        this.$message({
          message: '根节点不允许添加成员，请选择其子部门添加成员信息',
          type: 'warning'
        });
      } else {
        if (num == 1) {
          this.isAddUser = true;
          this.dialogUsers = !this.dialogUsers;
          this.userTitle = '添加成员';
          this.userTitleBtn = '立即创建';
          this.depDisabled = true;
          this.userFrom.departId = this.dep.departId;
          this.userFrom.departName = this.dep.departName;
          this.userFrom.pId = this.dep.pId;
          this.userFrom.validity = 1;
          this.userFrom.isUpdate = false;
        } else if (num == 2) {
          // console.log(data,'编辑');
          this.dialogUsers = !this.dialogUsers;
          this.userTitle = '修改成员';
          this.userTitleBtn = '确定修改';
          this.isAddUser = false;
          this.depDisabled = false;
          this.userFrom.departId = data.departId;
          this.userFrom.departName = this.dep.departName;
          this.userFrom.pId = this.dep.pId;
          this.userFrom.isUpdate = true;
          this.userFrom.validity = data.validity;
          this.userFrom.realName = data.realName;
          this.userFrom.userPhone = data.userPhone;
          this.userFrom.userEmail = data.userEmail;
          this.userEditId = data.id;
        }
      }
    },
    submitUserForm(formName) {
      //新增用户确定按钮
      this.$refs[formName].validate().then(valid => {
        if (this.userTitle === '添加成员') {
          //新增
          let params = this.userFrom;
          return this.requestProcess(userAdd(params)).then(res => {
            if(res.data){
              this.$message({
                type: 'success',
                message: '新增用户成功!'
              });
              return true;
            }
            return false;
          })
        }
        //修改
        let params = {
          realName: this.userFrom.realName,
          userPhone: this.userFrom.userPhone,
          userEmail: this.userFrom.userEmail,
          departId: this.userFrom.departId,
          validity: this.userFrom.validity,
          id: this.userEditId
        };
        return this.requestProcess(userEdit(params, this.userEditId)).then(res => {
          if(res.data){
            this.$message({
              type: 'success',
              message: '修改用户成功!'
            });
            return true;
          }
          return false;
        })
      }).then(res=>{
        if(res){
          this.getUserList();
          this.userFrom = {
            isUpdate: null,
            departName: '',
            departId: '',
            pId: '',
            realName: '',
            userEmail: '',
            account: '',
            userPass: '',
            userPhone: '',
            validity: 0
          };
          this.dialogUsers = !this.dialogUsers;
        }
      })
    },
    resetUserForm(formName) {
      //取消新增用户确定按钮
      this.$refs[formName].resetFields();
      this.dialogUsers = !this.dialogUsers;
    },
    usersFromClose() {
      this.$refs['userFrom'].resetFields();
      this.dialogUsers = !this.dialogUsers;
    },
    depSubmit(num, data) {

      //部门添加修改
      this.dep = data;
      if (num == 1) {
        this.depTitle = '添加部门';
        this.depFromBtn = '立即创建';

      } else if (num == 2) {
        this.depTitle = '编辑部门';
        this.depFromBtn = '确定修改';
        depGet(this.dep.departId).then(res => {
          this.dep['departNameEdit'] = res.data.pName;
          this.depFrom.departName = res.data.departName;
          this.editDepId = res.data.departId;
        })
      } else if (num == 3) {
        this.depTitle = '添加一级部门';
        this.depFromBtn = '立即创建';
      }
      this.dialogDep = !this.dialogDep;
    },
    submitDepForm(formName) {
      //确定部门添加编辑
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.depTitle == '添加部门') {
            if (this.dep.departName == '全部部门' && this.dep.departId == 'abcd') {
              //为添加一级
              this.depFrom.pId = 0;
              this.depFrom.pName = '';
            } else {
              //为子集添加
              this.depFrom.pId = this.dep.departId;
              this.depFrom.pName = this.dep.departName;
            }
            depAdd(this.depFrom).then(res => {
              if (res.status == 200) {
                this.depTreeList()
                this.$message({
                  type: 'success',
                  message: '新增部门成功!'
                });
                this.resetDepForm(formName);
              } else {
                this.$message({
                  message: res.msg + '原因为:' + res.error,
                  type: 'warning'
                });
                this.resetDepForm(formName);
              }
            })
          } else if (this.depTitle == '编辑部门') {
            if (this.dep.departName == '全部部门' && this.dep.departId == 'abcd') {
              //为添加一级

            } else {
              let params = {
                departName: this.depFrom.departName,
                isUpdate: true
              }
              depEdit(params, this.editDepId).then(res => {
                if (res.status == 200) {
                  this.depTreeList()
                  this.$message({
                    type: 'success',
                    message: '修改部门成功!'
                  });
                  this.resetDepForm(formName);
                }
              })
            }
          } else if (this.depTitle == '添加一级部门') {
            let params = {
              departName: this.depFrom.departName,
              pId: 0
            }
            depAdd(params).then(res => {
              if (res.status == 200) {
                this.depTreeList()
                this.$message({
                  type: 'success',
                  message: '新增部门成功!'
                });
                this.resetDepForm(formName);
              } else {

              }
            }).catch(error => {
              console.log(error.message, 12);
              this.$message({
                message: '添加部门失败原因为:' + error.message,
                type: 'warning'
              });
              this.resetDepForm(formName);
            })
          }
        }
      })
    },
    depRemove(data) {
      //删除部门
      // console.log(this.dep);
      this.dep = data;
      this.$confirm(`此操作将删除【${data.departName}】部门及其下属部门, 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.dep.departId;
        depDel(id).then(res => {
          if (res.status == 200) {
            this.depTreeList();
            this.$message({
              type: 'success',
              message: '删除部门成功!'
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
    depFromClose() {
      this.$refs['depFrom'].resetFields();
      this.dialogDep = !this.dialogDep;
    },
    resetDepForm(formName) {
      //取消部门添加编辑
      this.$refs[formName].resetFields();
      this.dialogDep = !this.dialogDep;
    },
    handleSizeChange(val) {
      this.rows = val;
      this.page = 1;
      this.currentPage = 1;
      this.userTableLoading = true;
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userTableLoading = true;
      this.getUserList()
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else if (rowIndex % 2 === 1) {
        return 'success-row';
      }
      return '';
    },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [
        {path: '/', name: '首页'},
        {name: '系统管理'},
        {name: '成员管理'}
      ]
    }
  },
  components: {
    Breadcrumb
  }
}
