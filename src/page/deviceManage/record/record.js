import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {record} from "@/axios/deviceManage/inventory"
import {getDict} from "@/axios/deviceManage/spareConfig"
export default {
  name: '',
  data() {
    return {
		pageSize: 1,
		totalData: 0,
      breadcrumbList: [],
      tableData: [],
      isShow: false,
      title: '新建种类',
      isView: false,
      isAdd: false,
      detail: {},
      typeData:[],
      defaultProps: {
         children: 'children',
         label: 'typeName'
       }
    }
  },
  mounted() {
    this.toBreadcrumb()
    this.init()
  },
  methods: {
	  handleCurrentChange(val) {
		this.pageSize = val;
		this.init()
	  },
    toBreadcrumb() {
      //面包屑
      this.breadcrumbList = [{
          path: '/',
          name: '首页'
        },
        {
          name: '设备管理'
        },
        {
          name: '出入库记录'
        }
      ]
    },
    init() {
      getDict({
        type: 'inStoreType'
      }).then(res => {
        this.inStore = res.dataList
      })
      getDict({
        type: 'outStoreType'
      }).then(res => {
        this.outStore = res.dataList
      })
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": []
        },
        "params": {},
        "page": this.pageSize,
        "rows": 10,
        "sidx": "",
        "sord": "asc"
      }
      record(data).then(res => {
        res.data.forEach((item,i)=>{
          if(item.orderType==0){
            item.orderName="出库"
          }else if(item.orderType==1){
            item.orderName="入库"
          }
        })
        this.tableData = res.data;
		this.totalData = res.page.recordCount
      })
    },
    hide() {
      this.isShow = false;
      this.isView = false;
    },
    add() {
      this.isAdd = true
      this.isShow = true;
      this.addData = {
        "spareName": "",
        "spareCode": "",
        "spareTypeCode": "",
        "spareModel": "",
        "spareUnitCode": "",
        "remark": "",
        "equipTypeIds": ['1']
      }
      getType().then(res=>{
        this.typeData=res.data
      })
    },
    save() {
      let that=this
      that.addData.equipTypeIds=[]
      let arr=this.$refs.tree.getCheckedNodes();
      arr.forEach((item,i)=>{
        that.addData.equipTypeIds.push(item.id)
      })
      addCategory(this.addData).then(res => {
        if(res.status==200){
          this.isShow=false
          this.init()
        }
      })
    },
    handleView(row) {
      this.isView = true
      getDetail(row.id).then(res => {
        this.detail = res.data
      })
    },
    handleEdit(row) {
      this.isAdd = false
      getDetail(row.id).then(res => {
        this.isShow = true;
        this.addData = res.data
      })
    },
    handleDelet(row) {
      deleteCate(row.id).then(res => {
        console.log(res)
      })
    },
    change() {
      changeCate(this.addData).then(res => {
        console.log(res)
      })
    },
    handleSoS(row) {
      // if(row.status)
      startOrStop(row.id, 0).then(res => {
        console.log(res)
      })
    }
  },
  components: {
    Breadcrumb
  }
}
