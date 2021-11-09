/**
 * Created by lixiansky on 2021/9/3
 */
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DepToPerson from "@/components/depToPerson/depToPerson";
import ApprovalProcessNode from "@/components/ApprovalProcessNode/ApprovalProcessNode";
import Defect from "../index";
import { request, variables } from "@/components/mixins/request";
import { datePicker } from "@/components/mixins/common";
import { addDefect, equipmentDefect } from "../index";
export default {
  mixins: [request, variables, datePicker],
  components: { DepToPerson, ApprovalProcessNode },
  data() {
    return {
      instance: new Defect(),
      form: {
        title: "",
        equipCode: "",
        equipName: "",
        status: "0",
        type: "0",
        remark: ""
      },
      files: [],
      fullscreenLoading: false,
      equipments: [],
      equipId: [{ required: true, message: "请设备", trigger: "change" }],
      equips: []
    };
  },
  mounted() {
    // 组装面包屑

    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "缺陷上报" }
    ]);

    this.requestProcess(
      //获取设备
      equipmentDefect(1, 9999, {
        conditionConfig: {
          conditions: [
            {
              opCode: "LIKE",
              paramsKey: "equipName",
              targetCode: ""
            }
          ],
          logic: 1
        }
      })
    )
      .then(res => {
        this.equipments = res.data;
      })
      .finally(() => {});
  },

  methods: {
    AddSelectDept(val) {
      this.equips = val ? this.equipments.find(ele => ele.id === val) : [];
    },

    postDefect() {
      //上传缺陷
      if (this.form.title === "") {
        this.$message({
          message: "请输入缺陷标题",
          type: "warning"
        });
        return;
      }
      if (this.equips.length === 0) {
        this.$message({
          message: "请选择设备",
          type: "warning"
        });
        return;
      }
      this.fullscreenLoading = true;
      var formData = new FormData();
      formData.append("title", this.form.title);
      formData.append("equipId", this.equipId);
      formData.append("equipCode", this.equips.equipCode);
      formData.append("equipName", this.equips.equipName);
      formData.append("status", this.form.status);
      formData.append("type", this.form.type);
      formData.append("remark", this.form.remark);
      this.files.forEach(file => {
        formData.append("files", file.raw);
      });
      formData.append("files", this.files);
      this.requestProcess(addDefect(formData))
        .then(res => {
          if (res.data) {
            this.$message({
              message: "上传成功,返回缺陷列表",
              type: "success"
            });
            this.$router.push({ name: "defect_list" }); //缺陷管理-缺陷列表);
          }
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },

    handleRemove(file) {
      this.files = this.files.filter(t => t.name != file.raw.name);
    },

    handlechange(file) {
      this.files.push(file);
    },
    backPage() {
      this.$router.go(-1); //返回上一层
    }
  }
};
