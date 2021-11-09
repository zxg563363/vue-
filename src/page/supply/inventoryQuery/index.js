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
      spare: [],
      branch: [],
      spares: [], //备件数据
      sparesTotal: [], //备件数据
      spareData: {
        //表格数据
        branchIds: [], //分公司id
        spareIds: [], //备件id
        page: {
          orderBy: "",
          sord: "",
          pageNumber: 1,
          pageSize: 10
        }
      },
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
      loading: false, //加载中
      spareArr: [],
      branchArr: [],
      SecondaryDepartments: [],
      totaldata: 0
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "实时库存查询" }
    ]);
    this.getSecondaryDepartment();
    this.totalSpares();
  },

  methods: {
    totalSpares(branchId) {
     //根据条件查询指定备件
     if (branchId == "" || branchId == undefined) {
      this.spareDataTotal.branchIds = [];
    } else {
      this.spareDataTotal.branchIds = [branchId];
    }
      this.requestProcess(this.instance.getspareData(this.spareDataTotal))
        .then(res => {
          this.sparesTotal = res.data;
          
        })
        .finally(() => {
        
        });
    },

    getSecondaryDepartment() {
      //获取所有二级部门
      this.requestProcess(this.instance.getChildDepartments())
        .then(res => {
          this.SecondaryDepartments = res.data;
        })
        .finally(() => {
          this.searchBranch();
        });
    },

    SpareCondition(val) {
      //备件模糊查询条件
      if (val !== "") {
        // this.spares = val ? this.tableData.match(ele => ele.spareName === val) : [];
        this.spares = this.sparesTotal.filter(
          item => item.spareName.indexOf(val) > -1
        );
      } else {
      }
   
    },

    // getSpares(pageNumber = 1, pageSize = 999) {
    //   //根据条件查询分公司下的备件
    //   let data = {
    //     conditionConfig: {
    //       logic: 1,
    //       conditions: this.spareArr
    //     },
    //     rows: pageSize,
    //     page: pageNumber,
    //     sidx: "createTime",
    //     sord: "desc"
    //   };
    //   this.requestProcess(this.instance.getSpares(data))
    //     .then(res => {
    //       this.spares = res.data;
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // },

    detailsData(val) {
      //根据条件查询指定备件
      if (val == "" || val == undefined) {
        this.spareData.spareIds = [];
      } else {
        this.spareData.spareIds = [val];
      }

      this.requestProcess(this.instance.getspareData(this.spareData))
        .then(res => {
         
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {});
    },

    searchBranch(val) {
      //获取该公司备品安全库存
      if (val == "" || val == undefined) {
        this.spareData.branchIds = [];
      } else {
        this.spareData.branchIds = [val];
      }

      this.fullscreenLoading = true;
      this.requestProcess(this.instance.getspareData(this.spareData))
        .then(res => {
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {
          this.fullscreenLoading = false;
          this.totalSpares(val);
          
        });
    },
    handleCurrent(val) {
      //获取第val页数据
      this.spareData.page.pageNumber = val;
      this.searchBranch();
    },
    handleSizeChange(val) {
      //获取val条数据
      this.spareData.page.pageSize = val;
      this.searchBranch();
    },
    apply(row){
      this.$router.push({name: 'supply_apply',params:{row:JSON.stringify(row)}});
    }
  }
};
