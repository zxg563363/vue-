/**
 * Created by lixiansky on 2021/10/19
 */
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import Stock from "../index";
import { request, variables } from "@/components/mixins/request";
export default {
  mixins: [request, variables],
  components: { Breadcrumb },
  data() {
    return {
      instance: new Stock(),
      active: "1",
      SecondaryDepartments: [],
      SecondaryDepartment: "",
      StockSecuritys: [],
      loading: false,
      spares: [],
      Equipments: [],
      arr: [],
      fullscreenLoading: false,
      dialogVisible: false,
      update: false,
      totaldata: 0,
      form: {
        //表格数据
        branchId: "", //分公司id
        spareId: "", //备件id
        minimum: "", //下限
        maximum: "" //上限
      },
      spareData: {
        //筛选条件
        branchId: "", //分公司id
        spareId: "", //备件id
        pageNumber: 1, //第几页
        pageSize: 10 //分页大小
      },
      rules: {
        branchId: [
          { required: true, message: "请选择分公司", trigger: "change" }
        ],
        spareId: [{ required: true, message: "请选择备件", trigger: "change" }]
      }
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "备品安全库存" }
    ]);
    this.getSecondaryDepartment();

    // this.spareData=this.SecondaryDepartments[0]
    // searchBranch()
  },
  methods: {
    getSecondaryDepartment() {
      //获取所有二级部门
      this.requestProcess(this.instance.getChildDepartments())
        .then(res => {
          this.SecondaryDepartments = res.data;
        })
        .finally(() => {
          this.spareData.branchId = this.SecondaryDepartments[0].departId;
          this.searchBranch();
        });
    },

    branchId(val) {
      //获取单个公司id
      this.form.branchId = val;
    },

    searchBranch() {
      //获取该公司备品安全库存

      this.fullscreenLoading = true;
      this.requestProcess(this.instance.getStockSecurity(this.spareData))
        .then(res => {
          this.StockSecuritys = res.data;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },

    NewlyAdded() {
      //新增
      //打开对话框
      this.dialogVisible = true;
      this.update = false;
      this.form.minimum = "";
      this.form.maximum = "";
    },

    editSecurity(data) {
      //编辑
      //打开对话框
      this.update = true;
      this.dialogVisible = true;
      this.form = data;
    },

    getEquipmentData() {
      //获取所有设备列表
      this.requestProcess(this.instance.getData(1, 999))
        .then(res => {
          this.Equipments = res.data;
        })
        .finally(() => {});
    },

    addEquipment() {
      //新增设备

      this.$refs["securityForm"].validate(valid => {
        if (valid) {
          this.requestProcess(this.instance.addEquipment(this.form))
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
              }
            })
            .finally(() => {
              this.searchBranch();
              this.dialogVisible = false;
            });
        }
        return false;
      });
    },
    updatePut() {
      //修改设备
      this.requestProcess(this.instance.updateEquipment(this.form))
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
        });
    },

    deleteSecurity(data) {
      //删除设备

      this.$confirm("是否继续删除, ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestProcess(
            this.instance.deleteEquipment(data.branchId, data.spareId)
          )
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.searchBranch();
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

    handleCurrent(val) {
      //获取第val页数据
      this.spareData.pageNumber = val;
      this.searchBranch();
    },
    handleSizeChange(val) {
      //获取val条数据
      this.spareData.pageSize = val;
      this.searchBranch();
    },
    remoteMethod(query) {
      //根据生成输入框模糊查询备件条件
      if (query !== "") {
        this.loading = true;
        this.arr = [
          {
            paramsKey: "spareName",
            opCode: "LIKE",
            targetCode: query
          }
        ];

        this.getSpares();
      } else {
        this.spares = [];
      }
    },

    getSpares(pageNumber = 1, pageSize = 999) {
      //根据输入框模糊查询备件
      let data = {
        conditionConfig: {
          logic: 1,
          conditions: this.arr
        },
        rows: pageSize,
        page: pageNumber,
        sidx: "createTime",
        sord: "desc"
      };
      this.requestProcess(this.instance.getStock(data))
        .then(res => {
          this.spares = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    defectReset() {
      //重置条件

      this.spareData.branchId = "";
      this.spareData.spareId = "";
      this.StockSecuritys = [];
      this.totaldata = 0;
    }
  }
};
