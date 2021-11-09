/**
 * Created by lixiansky on 2021/9/3
 */
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DepToPerson from "@/components/depToPerson/depToPerson";
import ApprovalProcessNode from "@/components/ApprovalProcessNode/ApprovalProcessNode";
import Defect from "../index";
import { request, variables } from "@/components/mixins/request";
import { datePicker } from "@/components/mixins/common";
import { searchSupplier, deleteSupplier } from "../index";
import trim from "lodash/trim";
export default {
  mixins: [request, variables, datePicker],
  components: { Breadcrumb, DepToPerson, ApprovalProcessNode },
  data() {
    return {
      instance: new Defect(),
      tableData: [],
      arr: [],
      totaldata: 0,
      pageNumber: 0,
      pageSize: 10,
      page: 1,
      searchData: "",
      titleArr: [],
      arr: [],
      statusArr: [],
      imeArr: [],
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "缺陷列表" }
    ]);
    this.getSupplier();
  },

  methods: {
    supplierSearch() {
      this.titleArr = [];
      if (this.searchData) {
        this.titleArr = [
          {
            paramsKey: "supplierName",
            opCode: "LIKE",
            targetCode: trim(this.searchData)
          }
        ];
      }
      this.arr = this.statusArr.concat(this.imeArr).concat(this.titleArr);
      // console.log(this.arr);
      this.getSupplier();
    },

    supplierReset() {
      this.arr = [];
      this.searchData = "";
      this.getSupplier();
    
     
    },
    getSupplier(pageNumber = 1, pageSize = 10) {
      let data = {
        conditionConfig: {
          logic: 1,
          conditions: this.arr
        },

        rows: pageSize,
        page: pageNumber,
        sidx: "",
        sord: "asc"
      };
      this.requestProcess(searchSupplier(data))
        .then(res => {
          console.log(res);
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {});
    },
    handleCurrent(val) {
      this.page = val;
      this.getSupplier(val, this.pageSize);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getSupplier(1, val);
    },
    editClick(row) {
      this.$router.push({ name: "supplier_add", params: { row: row } });
    },
    deleteClick(row) {
      //删除缺陷

      this.$confirm("是否继续删除, ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestProcess(deleteSupplier(row.id)).then(res => {
           
            if (res.data === true) {
              this.$message({
                message: "删除成功",
                type: "success"
              });

              this.getSupplier();
              this.page = 1;
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    openClick() {
      this.$router.push({ name: "supplier_add" }); //缺陷管理-缺陷上传;
    },

    checkClick(row) {
      this.$router.push({
        name: "supplier_add",
        params: { row: row, check: true }
      });
    }
  }
};
