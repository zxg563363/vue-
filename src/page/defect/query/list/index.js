/**
 * Created by lixiansky on 2021/9/3
 */
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DepToPerson from "@/components/depToPerson/depToPerson";
import ApprovalProcessNode from "@/components/ApprovalProcessNode/ApprovalProcessNode";
import Defect from "../../index";
import trim from "lodash/trim";
import { request, variables } from "@/components/mixins/request";
import { datePicker } from "@/components/mixins/common";
import {
  equipmentDefect,
  deleteDefect,
  updateDefect,
  viewDefect,
  getWork
} from "../../index";
import { defectType, defectStatus } from "../../mixins";

import Vue from "vue";
export default {
  mixins: [request, variables, datePicker],
  components: { Breadcrumb, DepToPerson, ApprovalProcessNode },
  data() {
    return {
      instance: new Defect(),
      tableData: [],
      totaldata: 0,
      pageNumber: 0,
      pageSize: 10,
      page: 1,
      srcList: [],
      srcListVideo: [],
      centerDialogVisible: false,
      viewClickVisible: false,
      number: 0,
      showEdit: [],
      data: [],
      userinfo: {},
      titleArr: [],
      arr: [],
      statusArr: [],
      imeArr: [],
      statusId: 0,
      imeId: 2,
      enclosureId: "",
      searchData: "",
      imeData: [
        {
          value: "全部",
          id: 2
        },
        {
          value: "未解决",
          id: 0,
          imeCode: "status"
        },
        {
          value: "已解决",
          id: 1,
          imeCode: "status"
        }
      ],
      equipments: [],
      equipId: [{ required: true, message: "请设备", trigger: "change" }],
      equips: []
    };
  },
  mounted() {
    // 组装面包屑
    this.breadcrumbList = this.instance.installBreadcrumbList([
      { name: "缺陷列表" }
    ]);
    this.userinfo = this.$ls.get("userInfo");

    this.getDefect();
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

    formatter(row) {
      return row.address;
    },
    handleCurrent(val) {
      this.page = val;
      this.getDefect(val, this.pageSize);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getDefect(1, val);
    },

    deleteClick(row) {
      //删除缺陷

      this.$confirm("是否继续删除, ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestProcess(deleteDefect(row.id)).then(res => {
            if (res.data === true) {
              this.$message({
                message: "删除成功",
                type: "success"
              });

              this.getDefect();
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

    updateClick(row) {
    
      console.log(row);
      //更新缺陷
      this.requestProcess(updateDefect(row,this.equips.equipName,this.equips.equipCode)).then(res => {
        if (res.data === true) {
          this.$message({
            message: "更新成功",
            type: "success"
          });

          this.viewClickVisible = false;
        

          this.getDefect(this.page, this.pageSize);
        } else {
          this.$message.error("更新失败");
        }
      });
    },

    editClick(row) {
      this.data = row;
      this.viewClickVisible = true;
    },

    viewClick(row) {
      this.enclosureId = row.id;

      this.centerDialogVisible = true;
    },

    viewPicture() {
      this.srcList = [];
      this.srcListVideo = [];
      //打开回调
      this.requestProcess(viewDefect(this.enclosureId)).then(res => {
        res.dataList.forEach(item => {
          const fileExtension = item.src.substring(
            item.src.lastIndexOf(".") + 1
          );
          if (fileExtension === "mp4") {
            this.srcListVideo.push("https://picture.ceiov.com/" + item.src);
          } else {
            this.srcList.push("https://picture.ceiov.com/" + item.src);
          }
        });
      });
    },

    openClick() {
      this.$router.push({ name: "defect_add" }); //缺陷管理-缺陷上传;
    },

    getDefect(pageNumber = 1, pageSize = 10) {
      let data = {
        conditionConfig: {
          logic: 1,
          conditions: this.arr
        },
        params: (imeId => {
          return imeId === 3 ? { searchType: "approval" } : {};
        })(this.imeId),
        rows: pageSize,
        page: pageNumber,
        sidx: "createTime",
        sord: "desc"
      };
      this.requestProcess(getWork(data))
        .then(res => {
          this.tableData = res.dataList;
          this.totaldata = res.page.recordCount;
        })
        .finally(() => {});
    },
    defectSearch() {
      this.titleArr = [];
      if (this.searchData) {
        this.titleArr = [
          {
            paramsKey: "title",
            opCode: "LIKE",
            targetCode: trim(this.searchData)
          }
        ];
      }
      this.arr = this.statusArr.concat(this.imeArr).concat(this.titleArr);
      // console.log(this.arr);
      this.getDefect();
    },
    defectReset() {
      this.arr = [];
      this.getDefect();
      this.statusId = 0;
      this.imeId = 2;
      this.searchData = "";
    },
    changeime(item) {
      this.imeId = item.id;
      this.imeArr = [];
      if (item.id === 2) {
        this.imeArr = [];
      } else {
        this.imeArr.push({
          paramsKey: item.imeCode,
          opCode: "EQUAL",
          targetCode: item.id
        });
      }
      this.arr = this.statusArr.concat(this.imeArr).concat(this.titleArr);
      this.getDefect();
    }
  },
  components: {
    Breadcrumb,
    // 缺陷状态格式化组件
    "defect-Type": {
      mixins: [defectType],
      props: {
        status: {
          type: Number,
          required: true
        }
      },
      render(createElement) {
        return createElement(
          Vue.extend({
            template: (status => {
              return `<el-tag type="${status["type"]}" size="small" :disable-transitions="true">${status.label}</el-tag>`;
            })(this.TypeMap[this.status])
          })
        );
      }
    },
    // 缺陷状态格式化组件
    "defect-status": {
      mixins: [defectStatus],
      props: {
        status: {
          type: Number,
          required: true
        }
      },
      render(createElement) {
        return createElement(
          Vue.extend({
            template: (status => {
              return `<el-tag type="${status["type"]}" size="small" :disable-transitions="true">${status.label}</el-tag>`;
            })(this.statusMap[this.status])
          })
        );
      }
    }
  }
};
