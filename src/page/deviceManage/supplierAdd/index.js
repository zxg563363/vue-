/**
 * Created by lixiansky on 2021/9/3
 */

import DepToPerson from "@/components/depToPerson/depToPerson";
import ApprovalProcessNode from "@/components/ApprovalProcessNode/ApprovalProcessNode";
import { request, variables } from "@/components/mixins/request";
import { datePicker } from "@/components/mixins/common";
import {
  addSupplier,
  updateSupplier,
  searchParts,
  addParts,
  getData,
  updateParts,
  deleteParts
} from "../index";
export default {
  mixins: [request, variables, datePicker],
  components: { DepToPerson, ApprovalProcessNode },
  data() {
    return {
      form: {
        id: "",
        supplierName: "",
        supplierNickName: "",
        supplierNumber: "",
        purchasingContent: "",
        supplierGrade: "",
        supplierAccountId: "",
        supplierAccountName: "",
        supplierLinkUser: "",
        supplierLinkPhone: ""
      },
      fullscreenLoading: false,
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" }
        ]
      },

      row: (() => {
        return this.$router.history.current.params["row"];
      })(),
      check: (() => {
        return this.$router.history.current.params["check"];
      })(),
      establish: true,
      modify: false,
      tableData: [],
      PartsList: [],

      viewClickVisible: false,
      data: {
        supplierId: "",
        id: "",
        unitPrice: ""
      },
      edit: false
    };
  },
  mounted() {
    this.judgeSupplier();
    this.getParts();
    this.getTableData(1, 999);
  },

  methods: {
    postSupplier() {
      //添加供应商

      this.$refs.Form.validate(valid => {
        console.log(valid);
        if (valid) {
          this.fullscreenLoading = true;
          this.requestProcess(addSupplier(this.form))
            .then(res => {
              console.log(res.data);
              if (res.data) {
                this.$message({
                  message: "上传成功,返回供应商列表",
                  type: "success"
                });
                this.$router.push({ name: "supplier_list" }); //返回供应商列表);
              }
            })
            .finally(() => {
              this.fullscreenLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    backPage() {
      //返回上一层
      this.$router.go(-1);
    },

    judgeSupplier() {
      //判断查看、修改、添加
      console.log(this.check);

      if (this.row) {
        this.form = this.row;
        if (this.check) {
          this.establish = false;
          this.modify = false;
        } else {
          this.establish = false;
          this.modify = true;
        }
      } else {
        //添加
        this.establish = true;
        this.modify = false;
      }
    },

    putSupplier() {
      //修改供应商
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true;

          this.requestProcess(updateSupplier(this.form))
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({ name: "supplier_list" }); //返回供应商列表);
              }
            })
            .finally(() => {
              this.fullscreenLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    getParts() {
      //获取备件列表
      this.requestProcess(searchParts(this.form.id))
        .then(res => {
          this.tableData = res.dataList;
          console.log("@" + this.tableData);
        })
        .finally(() => {});
    },
    openParts() {
      //打开备件框添加备件
      this.viewClickVisible = true;
      this.edit = false;
    },
    editClick(row) {
      //打开备件框更新备件
      this.viewClickVisible = true;
      this.edit = true;
      this.data.supplierId = this.form.id;
      this.data.id = row.id;
      this.data.unitPrice = row.unitPrice;
    },

    postParts() {
      //添加备件
      this.data.supplierId = this.form.id;
      this.requestProcess(addParts(this.data))
        .then(res => {
          if (res.data) {
            this.$message({
              message: "上传成功",
              type: "success"
            });
            this.getParts();
          }
        })
        .finally(() => {
          this.viewClickVisible = false;
        });
    },

    putParts() {
      //更新备件
      this.data.supplierId = this.form.id;
      this.requestProcess(updateParts(this.data))
        .then(res => {
          if (res.data) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.getParts();
          }
        })
        .finally(() => {
          this.viewClickVisible = false;
        });
    },

    deleteClick(row) {
      //删除备件
      this.data.supplierId = this.form.id;
      this.data.id = row.id;
      this.data.unitPrice = row.unitPrice;
      this.$confirm("是否继续删除, ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestProcess(deleteParts(this.data))
            .then(res => {
              if (res.data) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getParts();
              }
            })
            .finally(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    getTableData(pageNumber, pageSize) {
      //添加备件

      this.requestProcess(getData(pageNumber, pageSize))
        .then(res => {
          this.PartsList = res.data;
          console.log("@" + this.PartsList);
        })
        .finally(() => {
          //打开备件框
        });
    }
  }
};
