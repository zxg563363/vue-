/**
 * Created by lixiansky on 2021/10/27
 */
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import purchaseManage from "../index";
import { request, variables } from "@/components/mixins/request";
export default {
  mixins: [request, variables],
  components: { Breadcrumb },
  data() {
    return {
      instance: new purchaseManage(),
      suppliers: [], //供应商数据
      spares: [], //备件数据
      dialogVisible: false, //对话框
      loading: false, //加载中
      update: false, //更新判断
      totaldata: 0,

      form: {
        //表格数据
        supplierId: "", //供应商id
        spareId: "", //备件id
        unitPrice: "" //价格
      },
      page: {
        pageNumber: 1,
        pageSize: 10
      },
      id: "",
      supplierArr: [], //供应商查询条件
      spareArr: [], //备件查询条件
      rules: {
        supplierId: [
          { required: true, message: "请选择供应商", trigger: "change" }
        ],
        spareId: [{ required: true, message: "请选择备件", trigger: "change" }]
      }
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "协议价" }
    ]);
  },
  methods: {
    SupplierCondition(val) {
      //供应商名称模糊查询条件
      if (val !== "") {
        this.loading = true;
        this.supplierArr = [
          {
            paramsKey: "supplierName",
            opCode: "LIKE",
            targetCode: val
          }
        ];

        this.getSuppliers();
      } else {
        this.spares = [];
      }
    },
    SpareCondition(val) {
      //供应商名称模糊查询条件
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
    getSuppliers(pageNumber = 1, pageSize = 999) {
      //根据条件查询供货商
      let data = {
        conditionConfig: {
          logic: 1,
          conditions: this.supplierArr
        },
        rows: pageSize,
        page: pageNumber,
        sidx: "createTime",
        sord: "desc"
      };
      this.requestProcess(this.instance.getSuppliers(data))
        .then(res => {
          this.suppliers = res.data;
        
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getSpares(pageNumber = 1, pageSize = 999) {
      //根据条件查询供货商下的备件
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
          console.log(res);
          this.spares = res.data;
          
        })
        .finally(() => {
          this.loading = false;
        });

      console.log("@");
    },

    NewlyAdded() {
      //新增
      //打开对话框
      this.dialogVisible = true;
      this.update = false;
    },
    spareData() {
      //根据查询供货商备件
      this.requestProcess(this.instance.spareData(this.form.supplierId))
        .then(res => {
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    detailsData() {
      //根据条件查询指定备件
      this.requestProcess(this.instance.getspareData(this.form.spareId))
        .then(res => {
          console.log(res);
          this.tableData = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addSpare() {
      //新增设备

      this.$refs["securityForm"].validate(valid => {
        if (valid) {
          this.requestProcess(this.instance.addSpare(this.form))
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
              }
            })
            .finally(() => {
              this.spareData();
              this.dialogVisible = false;
            });
        }
        return false;
      });
    },
    editAgreement(data) {
      //编辑
      //打开对话框
      console.log(data);
      this.update = true;
      this.dialogVisible = true;
      this.form.spareId = data.spareName;
      this.form.unitPrice = data.unitPrice;
      this.id = data.id;
    },

    updateSpare() {
      //修改备件
      this.requestProcess(this.instance.updateSpare(this.form, this.id))
        .then(res => {
          if (res.data) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        })
        .finally(() => {
          this.dialogVisible = false;
          this.spareData();
        });
    },

    deleteAgreement(data) {
      //删除设备

      this.$confirm("是否继续删除, ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestProcess(
            this.instance.deleteAgreement(this.form.supplierId, data.id)
          )
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.spareData();
              }
            })
            .finally(() => {
              this.dialogVisible = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    defectReset() {
      //重置条件

      this.form.supplierId = "";
      this.form.spareId = "";
      this.tableData = [];
    },

    handleCurrent(val) {
      //获取第val页数据
      this.page.pageNumber = val;
      this.getSuppliers();
    },
    handleSizeChange(val) {
      //获取val条数据
      this.page.pageSize = val;
      this.getSuppliers();
    }
  }
};
