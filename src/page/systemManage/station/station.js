import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import DepToPerson from '../../../components/depToPerson/depToPerson';
import {
    roleDatas, roleUsersDatas, delRoleUser, roleAdd, roleScope,
    saveroleScope, roleMenu, saveRoleMenu, roleEdit, roleDel,
    groupAdd, groupEdit, groupDel, addRoleUser,
} from '../../../axios/systemManage/station';
import {request} from '@/components/mixins/request';
import {common} from '@/components/mixins/common';
import reduce from 'lodash/reduce';
import concat from 'lodash/concat';

export default {
    mixins: [request, common],
    components: {
        Breadcrumb,
        DepToPerson
    },
    data() {
        return {
            breadcrumbList: [],
            treeArr: [],
            groupProps: {
                children: 'child',
                label: 'name',
            },
            activeName: 'users',
            loading: false,
            tableData: [],
            stationFrom: {
                roleName: '',
                groupId: '',
                roleDescribe: ''
            },
            stationRule: {
                roleName: [
                    {required: true, message: '角色名不能为空', trigger: 'blur'}
                ],
                groupId: [
                    {required: true, message: '请选择角色组', trigger: 'blur'}
                ],
                roleDescribe: [
                    {required: true, message: '描述不能为空', trigger: 'blur'}
                ],
            },
            dialogStation: false,
            dialogGroup: false,
            groupFrom: {
                name: ''
            },
            groupRules: {
                groupName: [
                    {required: true, message: '分组名称不能为空', trigger: 'blur'}
                ],
            },
            roleId: '',  //角色id
            groupList: [],  //分组列表
            actList: [],  //数据范围列表
            thirdData: [],
            scopeList: [
                {name: '本人', radioNum: '100'},
                {name: '本部门', radioNum: '200'},
                {name: '本组织', radioNum: '300'},
                {name: '全部', radioNum: '400'},
            ],
            tabCheck: '',
            menuTree: [],
            defaultProps: {
                children: 'subActs',
                label: 'actName',
            },
            checkedKeyArr: [],
            stationTitle: '',
            stationBtn: '',
            addGroupTitle: '',
            groupBtn: '',
            drawerAddUser: false,
            showRight: false,
            roleTitleName: '',
            roleMap: {
                users: {
                    command: (roleId) => {
                        this.getUserList(roleId);
                    },
                },
                menus: {
                    command: (roleId) => {
                        this.getRoleMenu(roleId)
                    },
                },
                scope: {
                    command: (roleId) => {
                        this.getRoleScope(roleId)
                    },
                }
            },
            dataLoading: false,
        }
    },
    mounted() {
        this.toBreadcrumb();  //面包屑
        this.addTree();  //tree数据
    },
    methods: {
        addTree() {
            this.showRight = false;
            this.groupList = [];
            // 获取角色
            this.dataLoading = true;
            this.requestProcess(roleDatas()).then(res => {
                this.groupList = res.dataList;
                this.treeArr = res.dataList;
            }).finally(() => {
                this.dataLoading = false;
            });
        },
        getTreeId(data) {
            //判断 点击是否含有children字段
            if (!('child' in data)) {
                // console.log(data);
                this.roleId = data.uuId;
                this.roleTitleName = data.name;
                this.showRight = true;
                this.roleMap[this.activeName] && this.roleMap[this.activeName].command(data.uuId);
            }
        },
        mouseenterTree(data) {
            this.$set(data, 'show', true);
        },
        mouseleaveTree(data) {
            this.$set(data, 'show', false);
        },
        saveRange() {
            if (!this.roleId) {
                this.$message({
                    message: '请先选择角色',
                    type: 'warning'
                });
                return false;
            }
            //保存数据范围设置
            this.requestProcess(saveroleScope({
                roleId: this.roleId,
                data: this.thirdData,
            })).then(res => {
                if (res.data) {
                    this.$message({type: 'success', message: '配置数据范围成功!'})
                } else {
                    throw new Error('数据范围配置失败！');
                }
            });
        },
        getUserList(roleId) {
            this.requestProcess(roleUsersDatas({roleId})).then(res => {
                this.tableData = res.dataList;
            });
        },
        handleClick(tab, event) {
            // console.log(tab.label);
            this.activeName = tab.name;
            if (this.roleId) {
                this.roleMap[this.activeName] && this.roleMap[this.activeName].command(this.roleId);
            }
        },
        getRoleMenu(roleId) {
            //获取功能权限列表
            let params = {
                roleId: roleId
            };
            this.requestProcess(roleMenu(params)).then(res => {
                this.menuTree = res.dataList;
                let _menuKeys = reduce(this.transformToArrayFormat('subActs', res.dataList), (results, menu) => {
                    (menu.checked && menu.subActs.length<=0) && (results.push(menu.actId));
                    return results;
                }, []);

                this.$refs['treeMenu'].setCheckedKeys(_menuKeys, true);
            });
        },
        saveMenu() {
            //保存功能权限设置
            if (!this.roleId) {
                this.$message({
                    message: '请先选择角色',
                    type: 'warning'
                });
                return false;
            }
            let params = {
                roleId: this.roleId,
                data: concat(this.$refs.treeMenu.getCheckedKeys(), this.$refs.treeMenu.getHalfCheckedKeys()),
            };
            this.requestProcess(saveRoleMenu(params)).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '配置功能权限成功!'
                    });
                }
            })
        },
        getMenuTreeId() {
            //功能权限树 获取选中的key值
            this.checkedKeyArr = concat(this.$refs.treeMenu.getCheckedKeys(), this.$refs.treeMenu.getHalfCheckedKeys());
        },
        getRoleScope(roleId) {
            let params = {
                roleId: roleId
            };
            roleScope(params).then(res => {
                this.thirdData = res.dataList;
            })
        },
        addStation(num, stationData) {
            if (num == 1) {
                //新增角色
                this.stationTitle = '新增角色';
                this.stationBtn = '立即创建';
                this.stationFrom.groupId = stationData['uuId'];
            } else if (num == 2) {
                //新增角色
                this.roleId = stationData.uuId;
                this.stationTitle = '修改角色';
                this.stationBtn = '确定修改';
                this.stationFrom = {
                    groupId: stationData.pId,
                    roleDescribe: stationData.roleDescribe,
                    roleName: stationData.name,
                };
            }
            this.dialogStation = !this.dialogStation;
        },
        submitForm(formName) {
            //新增确定按钮
            this.$refs[formName].validate().then((valid) => {
                let params = this.stationTitle === '新增角色' ? this.stationFrom : {
                    roleId: this.roleId,
                    data: this.stationFrom
                };
                return this.requestProcess(this.stationTitle === '新增角色' ? roleAdd(params) : roleEdit(params));
            }).then(res => {
                if (res.data) {
                    this.addTree()
                    this.$message({
                        type: 'success',
                        message: '角色操作成功！'
                    });
                    this.resetForm(formName);
                }
            })
        },
        resetForm(formName) {
            //取消
            this.$refs[formName].resetFields();
            this.dialogStation = !this.dialogStation;
            this.stationFrom = {
                groupId: '',
                roleDescribe: '',
                roleName: '',
            };
        },
        delStation(data) {
            //删除用户
            this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.requestProcess(delRoleUser({roleId: this.roleId, userId: data.id})).then(res => {
                    if (res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        this.getUserList(this.roleId);
                    }
                })
            });
        },
        delRole(data) {
            //删除角色
            this.roleId = data.uuId;
            this.$confirm(`此操作将删除【${data['name']}】角色, 是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(data);
                this.requestProcess(roleDel({roleId: this.roleId,})).then(res => {
                    if (res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        this.addTree();
                    }
                })
            });
        },
        delGroup(data) {
            //删除分组
            this.roleId = data.uuId;
            this.$confirm(`此操作将删除【${data['name']}】分组, 是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(data);
                this.requestProcess(groupDel({roleId: this.roleId,})).then(res => {
                    if (res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.addTree();
                    }
                })
            });
        },
        addGroup(num, groupData) {
            // console.log(groupData);
            //新增组 打开弹窗
            if (num === 1) {
                this.addGroupTitle = '新增分组';
                this.groupBtn = '立即创建';
            } else if (num === 2) {
                this.roleId = groupData.uuId;
                this.addGroupTitle = '修改分组';
                this.groupBtn = '确定修改';
                this.groupFrom = {
                    groupName: groupData.name
                }
            }
            this.dialogGroup = !this.dialogGroup;
        },
        fromClose() {
            //关闭dialog 角色
            this.$refs['stationFrom'].resetFields();
            this.dialogStation = !this.dialogStation;
            this.stationFrom = {
                groupId: '',
                roleDescribe: '',
                roleName: '',
            };
        },
        fromCloseGroup() {
            //关闭dialog 分组
            this.$refs['groupFrom'].resetFields();
            this.dialogGroup = !this.dialogGroup;
            this.groupFrom.groupName = '';
        },
        submitGroupForm(formName) {
            //创建分组 确定按钮
            this.$refs[formName].validate().then((valid) => {
                let params = this.addGroupTitle === '新增分组' ? ({
                    uuId: '',
                    groupName: this.groupFrom.groupName
                }) : ({
                    uuId: this.roleId,
                    groupName: this.groupFrom.groupName
                });

                return this.requestProcess(this.addGroupTitle === '新增分组' ? groupAdd(params) : groupEdit(params));
            }).then((res) => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    this.groupFrom.groupName = '';
                    this.dialogGroup = false;
                    this.addTree();
                }
            });
        },
        resetGroupForm(formName) {
            //取消
            this.$refs[formName].resetFields();
            this.dialogGroup = !this.dialogGroup;
            this.groupFrom.groupName = '';
        },
        addPerson() {
            // 添加成员按钮
            this.drawerAddUser = !this.drawerAddUser;
        },

        saveUsers(data, name) {
            //保存成员信息
            let params = {
                roleId: this.roleId,
                userIdArr: data.userIdArr
            };
            // console.log(params);
            this.requestProcess(addRoleUser(params)).then(res => {
                if (res.data) {
                    this.$message({
                        type: 'success',
                        message: '添加成员成功!'
                    });
                    this.drawerAddUser = false;
                    this.roleMap[this.activeName] && this.roleMap[this.activeName].command(this.roleId);
                } else {
                    throw new Error('添加成员失败！');
                }
            })
        },
        toBreadcrumb() {
            //面包屑
            this.breadcrumbList = [
                {path: '/', name: '首页'},
                {name: '系统管理'},
                {name: '岗位管理'}
            ]
        }
    },

}
