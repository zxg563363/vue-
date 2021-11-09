/**
 * Created by lixiansky on 2021/8/26
 */
import {depTree, userList,} from '../../axios/systemManage/station'
import isArray from 'lodash/isArray';
import {ellipsis} from '../../filters/index'
import findIndex from 'lodash/findIndex';
import {request} from '@/components/mixins/request';

export default {
    name: 'DepToPerson',
    mixins: [request],
    data() {
        return {
            state: false,
            depTreeDatas: [],
            depProps: {
                children: 'children',
                label: 'departName',
                value: 'departId',
                checkStrictly: true,
            },
            departId: '',
            key: '',
            tableData: [],
            page: 1,
            rows: 5,
            currentPage: 1,
            total: 0,
            userTableData: [],
        }
    },
    mounted() {
        // this.getTree();
        this.tableData = this.fatherData || [];
    },
    methods: {
        closeDialog() {
            this.$emit('dialogOpen', this.state);
        },
        getTree() {
            this.depTreeDatas = [];
            this.requestProcess(depTree()).then(res => {
                this.depTreeDatas = res.dataList;
                this.getUsers(this.departId);
            })
        },
        getUsers(departId) {

            let params = {
                _search: false,
                rows: this.rows,
                page: this.page,
                sidx: 'createTime',
                sord: 'desc',
                departId: ((_departId)=>{
                  return isArray(_departId) ? _departId[_departId.length-1] : _departId;
                })(departId),
                key: this.key,
            };
            this.requestProcess(userList(params)).then(res => {
                // console.log('userList',res);
                this.userTableData = res.dataList;
                this.total = res.page.recordCount;
            })
        },
        addUserToTable(data) {
            //点击添加成员
            if (findIndex(this.tableData, {id: data['id']}) > -1) {
                this.$message({message: '已存在，请勿重复添加', duration: 1000, type: 'warning'});
                return false;
            }
            !this.multiSelect && (this.tableData.length > 0 && (this.tableData.splice(0, 1)));
            this.tableData.push(data);
        },
        delUserToTable(data, i) {
            //点击删除成员
            this.tableData.splice(i, 1);
        },
        resetSaveUsers() {
            //取消
            this.rows = 5;
            this.page = 1;
            this.currentPage = 1;
            this.$emit('dialogOpen', this.state);
            // this.$emit('personParams',{userIdArr:[]},{userNameArr:[]});
        },
        saveUsers() {
            //保存成员信息
            let params = {
                userIdArr: []
            };
            let par = {
                userNameArr: []
            };
            for (var i = 0; i < this.tableData.length; i++) {
                params.userIdArr.push(this.tableData[i].id);
                par.userNameArr.push(this.tableData[i].realName)
            }
            this.$emit('personParams', params, par);
        },
        handleSizeChange(val) {
            this.rows = val;
            this.page = 1;
            this.currentPage = 1;
            this.getUsers(this.departId);
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getUsers(this.departId);
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex % 2 === 0) {
                return 'warning-row';
            } else if (rowIndex % 2 === 1) {
                return 'success-row';
            }
            return '';
        },
    },
    watch: {
        fatherData: {
            handler(newVal, oldVal) {
                // console.log(newVal);
                this.tableData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
    },
    props: {
        opens: { // 父组件传来的id
            type: Boolean
        },
        fatherData: {
            type: Array
        },
        multiSelect: {
            type: Boolean,
            default: true,
            required: false,
        }
    }
}
