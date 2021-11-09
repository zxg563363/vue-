import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import {
  getInventory,
  putSpare,
  outSpare,
  okEquipType,
  getSafe
} from "@/axios/deviceManage/inventory"
import {
  getCategory
} from "@/axios/deviceManage/spareCategory"
import {
  getPart
} from "@/axios/deviceManage/sparePart"
import {
  getDict
} from "@/axios/deviceManage/spareConfig"
export default {
  name: '',
  data() {
    return {
      totalData:0,
      pageSize:1,
      isShowSpare:'',
      breadcrumbList: [],
      tableData: [],
      isShow: true,
      isShowIn: false,
      isShowOut: false,
      title: '新建种类',
      addData: {
        "spareName": "",
        "spareCode": "",
        "spareTypeCode": "",
        "spareModel": "",
        "spareUnitCode": "",
        "remark": "",
        "equipTypeIds": [],
      },
      isAdd: false,
      detail: {},
      typeData: [],
      defaultProps: {
        children: 'children',
        label: 'typeName'
      },
      addTr: [],
      addOut: [],
      options: [],
      optionOut: [],
      loading: false,
      partData: [],
      inStore: [],
      outStore: [],
      value0: '',
      value1: '',
      warehouseName: '',
      searchData: {
        spearName: '',
        spearCode: '',
        spearType: '',
        spearModel: '',
        spearUniy: '',
        spearPart: '',
      },
      unit: [],
      type: [],
      searchValue: '',
      isShowSpare:true
    }
  },
  mounted() {
    this.toBreadcrumb()
    this.init()
    // this.remoteMethod()
  },
  methods: {
    // okPart(row) {
    //   console.log(row)
    //   okEquipType(row.spareId).then(res => {
    //     console.log(res)
    //   })
    // },
    handleCurrentChange(val) {
      this.pageSize = val;
      this.init()
    },
    search() {
      this.tableData = []
      let that = this
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": []
        },
        "params": {},
        "page": 1,
        "rows": 10,
        "sidx": "",
        "sord": "asc"
      }
      getInventory(data).then(res => {
        res.data.forEach((item, i) => {
          if (item.spareName == that.searchValue) {
            that.tableData.push(item)
          }
        })
      })
    },
    outAction(rowIndex, data) {
      console.log(data)
      this.addOut[rowIndex]['orderAction'] = data.id
      this.addOut[rowIndex]['order'] = data.name
    },
    aaa(rowIndex, data) {
      console.log(data)
      this.addTr[rowIndex]['warehouseId'] = data.id
      this.addTr[rowIndex]['warehouseName'] = data.warehouseName
    },
    bbb(rowIndex, data) {
      console.log(data)
      this.addTr[rowIndex]['orderAction'] = data.id
      this.addTr[rowIndex]['order'] = data.name
    },
    changeInput(rowIndex, data) {
      let that = this;
      this.addTr[rowIndex]['spareCode'] = data.spareCode;
      this.addTr[rowIndex]['spareId'] = data.id;
      this.addTr[rowIndex]['spareName'] = data.spareName;
      this.addTr[rowIndex]['createTime'] = data.createTime;
      this.addTr[rowIndex]['spareModel'] = data.spareModel;
      this.addTr[rowIndex]['spareUnitCode'] = data.spareUnitCode;
      this.addTr[rowIndex]['spareTypeCode'] = data.spareTypeCode;
      this.addTr[rowIndex]['spareNum'] = data.spareNum;
      this.type.forEach((item, j) => {
        if (item.id == that.addTr[rowIndex]['spareTypeCode']) {
          that.addTr[rowIndex]['spareTypeName'] = item.name
        }
      })
      this.unit.forEach((item, j) => {
        if (item.id == that.addTr[rowIndex]['spareUnitCode']) {
          that.addTr[rowIndex]['spareUnitName'] = item.name
        }
      })
    },
    changeInputOut(rowIndex, data) {
      let that = this;
      this.addOut[rowIndex]['spareCode'] = data.spareCode;
      this.addOut[rowIndex]['spareId'] = data.spareId;
      this.addOut[rowIndex]['spareName'] = data.spareName;
      this.addOut[rowIndex]['createTime'] = data.createTime;
      this.addOut[rowIndex]['spareModel'] = data.spareModel;
      this.addOut[rowIndex]['spareUnitCode'] = data.spareUnitCode;
      this.addOut[rowIndex]['spareTypeCode'] = data.spareTypeCode;
      this.addOut[rowIndex]['spareNum'] = data.spareNum;
      this.addOut[rowIndex]['warehouseName'] = data.warehouseName;
      this.addOut[rowIndex]['warehouseId'] = data.warehouseId;
      this.type.forEach((item, j) => {
        if (item.id == that.addOut[rowIndex]['spareTypeCode']) {
          that.addOut[rowIndex]['spareTypeName'] = item.name
        }
      })
      this.unit.forEach((item, j) => {
        if (item.id == that.addOut[rowIndex]['spareUnitCode']) {
          that.addOut[rowIndex]['spareUnitName'] = item.name
        }
      })
    },
    delet(row) {
      this.addTr = this.addTr.filter((value, index, arr) => {
        return row !== index
      })
      this.addOut = this.addOut.filter((value, index, arr) => {
        return row !== index
      })
    },
    inStoreD() {
      let data = {
        "details": this.addTr
      }
      putSpare(data).then(res => {
        if (res.status == 200) {
        this.$router.go(0);
        }
      })
    },
    outStoreD() {
      let data = {
        "details": this.addOut
      }
      outSpare(data).then(res => {
        if (res.status == 200) {
          this.$router.go(0);
        }
      })
    },
    remoteMethod(query) {
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": [
            {
              "paramsKey": "spareName",
              "opCode": "EQUAL",
              "targetCode":query
            }
          ]
        },
        "params": {},
        "page": 1,
        "rows": 1000,
        "sidx": "",
        "sord": "asc"
      }
      getCategory(data).then(res => {
        this.options = res.data;
      })
    },
    remoteMethodOut(query) {
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": []
        },
        "params": {},
        "page": 1,
        "rows": 1000,
        "sidx": "",
        "sord": "asc"
      }
      getInventory(data).then(res => {
        this.optionOut = res.data
      })
    },
    addTbody() {
      this.addTr.push({
        spareId: ''
      })
    },
    addTbodyOut() {
      this.addOut.push({
        spareId: ''
      })
    },
    putin() {
      this.isShow = false;
      this.isShowIn = true;
      this.isShowOut = false;
    },
    outin() {
      this.isShow = false;
      this.isShowIn = false;
      this.isShowOut = true;
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
          name: '备件库存'
        }
      ]
    },
    setSafe(row) {
      this.$prompt('请输入安全库存数量', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
              let data0 = {
                "safeNum": value,
                "details": [{
                  spareId: row.spareId,
                  warehouseId: row.warehouseId
                }]
              }
              getSafe(data0).then(res => {
                this.$message({
                  type: 'success',
                  message: '设置成功'
                });
                this.init()
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });
    },
    init() {
      getDict({
        type: 'spareType'
      }).then(res => {
        this.type = res.dataList
      })
      getDict({
        type: 'spareUnit'
      }).then(res => {
        this.unit = res.dataList
      })
      let data = {
        "conditionConfig": {
          "logic": 1,
          "conditions": []
        },
        "params": {},
        "page": this.pageSize,
        "rows": 8,
        "sidx": "",
        "sord": "asc"
      }
      getInventory(data).then(res => {
        res.data.forEach((item, i) => {
          if (item.safeNum >= item.spareNum) {
            item.aaa = "低于安全库存"
          }
        })
        this.tableData = res.data
        this.totalData=res.page.recordCount
      })
      getPart().then(res => {
        this.partData = res.data
      })
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

    },
    hide() {
      // this.isShow = true;
      // this.isShowIn = false;
      // this.isShowOut = false;
      this.$router.go(0);
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
      getType().then(res => {
        this.typeData = res.data
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
