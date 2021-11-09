/**
 * Created by lixiansky on 2021/10/20
 */
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import Supply from "../index";
import { request, variables } from "@/components/mixins/request";
export default {
  mixins: [request, variables],
  components: { Breadcrumb },
  data() {
    return {
      instance: new Supply(),
      spares: [], //备件数据
      spareDataTotal: {
        //备件总数
        branchIds: [], //分公司id
        spareIds: [], //备件id

        page: {
          orderBy: "",
          sord: "",
          pageNumber: 1,
          pageSize: 1000
        }
      },

      spareData: {
        supplierDescription: "", //描述
        receivingPartyId: "", //收货方id ，也就是对应分公司id
        planDetails: [
          // 需要补货的备件
          {
            spareId: "", //备件id
            spareName: "", // 相关基础信息
            spareCode: "", // 相关基础信息
            spareTypeCode: null, // 相关基础信息
            spareTypeName: null, // 相关基础信息
            spareModel: "", // 相关基础信息
            spareUnitCode: null, // 相关基础信息
            spareUnitName: null, // 相关基础信息
            planNum: 0, // 计划补货数量
            shippedNum: 0, // 发货数量
            price: 0 // 单价
          }
        ]
      },
      tableData: [],
      SecondaryDepartments: [],
      spareArr: [],
      loading: false, //加载中

      condition: {
        startTime: "",
        endTime: "",
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      dialogVisible: false,
      modifyVisible: false,

      totaldata: 0,
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "补货申请" }
    ]);
    this.getSecondaryDepartment();
    this.fillData();
    this.getSupply();
  },
  methods: {
    fillData() {
      //默认填充数据;
      if (this.$route.params.row) {
        let detail = JSON.parse(decodeURIComponent(this.$route.params.row));

        this.spareData.supplierDescription = "测试";
        this.spareData.receivingPartyId = detail.branchId;
        this.spareData.planDetails[0].spareId = detail.spareId;
        this.spareData.planDetails[0].spareName = detail.spareName;
        this.spareData.planDetails[0].spareCode = detail.spareCode;
        this.spareData.planDetails[0].spareModel = detail.spareModel;
      }
    },

    SpareCondition(val) {
      //备件模糊查询条件
      if (val !== "") {
        this.loading = true;
        this.spareArr = [
          {
            paramsKey: "spareName",
            opCode: "LIKE",
            targetCode: val
          }
        ];
        this.getSpares();
      } else {
        this.spares = [];
      }
    },

    getSpares(pageNumber = 1, pageSize = 999) {
      //查询所有备件

      let data = {
        conditionConfig: {
          logic: 1,
          conditions: this.spareArr
        },
        rows: pageSize,
        page: pageNumber,
        sidx: "createTime",
        sord: "desc"
      };
      this.requestProcess(this.instance.getSpares(data))
        .then(res => {
          this.spares = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    apply(row) {
      this.dialogVisible = true;
    },

    getSecondaryDepartment() {
      //获取所有二级部门
      this.requestProcess(this.instance.getChildDepartments())
        .then(res => {
          this.SecondaryDepartments = res.data;
        })
        .finally(() => {});
    },

     // 添加补货明细
     addziduan() {
       // 向表格数组中数据添加一行
       this.spareData.planDetails.push({

         spareName: "", //备件名称
         spareCode: "", //备件编号
         spareModel: "", //备件型号
         spareNum: "", //备件数量
         Visible: false
       });
     },

     // 删除按钮
     deleteit(row) {
       this.spareData.splice(row.index, 1);
     },
      //保存

     save(row) {

       row.Visible = true;
     },

    searchBranch(branchId) {
      this.spareData.receivingPartyId = branchId;
    },

    searchSpare(val) {

      let [index, spareId] = val.split(",");
      if (spareId == "" || spareId == undefined) {
        this.spareDataTotal.spareIds = [];
      } else {
        this.spareDataTotal.spareIds = [spareId];
      }
      this.requestProcess(this.instance.getspareData(this.spareDataTotal))
        .then(res => {
          this.spareData.planDetails[index].spareId = res.data[0].spareId;
          this.spareData.planDetails[index].spareName = res.data[0].spareName;
          this.spareData.planDetails[index].spareCode = res.data[0].spareCode;
          this.spareData.planDetails[index].spareModel = res.data[0].spareModel;

        })
        .finally(() => {});
    },

     edit(row) {
       //编辑
       row.Visible = false;
     },

    getSupply() {
      //查询补货计划
      this.requestProcess(this.instance.getSupply(this.condition))
        .then(res => {
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {});
    },

    openSupply() {
      // 新增补货计划
      this.dialogVisible = true;
    },
    postSupply(){

      this.requestProcess(this.instance.postSupply(this.spareData))
         .then(res => {
           console.log("测试输出" + JSON.stringify(res));
         })
         .finally(() => {
          this.dialogVisible = false;
         });
    },
    handleCurrent(val) {
      //获取第val页数据
      this.spareData.page.pageNumber = val;
      this.getSupply();
    },
    handleSizeChange(val) {
      //获取val条数据
      this.spareData.page.pageSize = val;
      this.getSupply();
    },

    modify(row) {
      //获取val条数据
      row.id = this.spareData.receivingPartyId;
      this.modifyVisible = true;
    },

    putModify() {



      this.requestProcess(this.instance.postSupply(this.spareData.receivingPartyId,this.spareData.supplierDescription))
      .then(res => {
        console.log("测试输出" + JSON.stringify(res));
      })
      .finally(() => {
       this.dialogVisible = false;
      });

    },

  }
};
