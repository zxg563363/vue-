import { datailCatalogs } from "@/axios/systemManage/service";
import { getScape } from "@/axios/deviceManage/deviceScape";
import { addWork, getWork, getDefine } from "@/axios/workManage/workadd";
import WorkOrder from "../index";
import DepToPerson from "@/components/depToPerson/depToPerson";
import { request } from "@/components/mixins/request";
export default {
  mixins: [request],
  components: {
    DepToPerson
  },
  data() {
    return {
      fileList: [],
      define: [],
      breadcrumbList: [],
      spaceData: [],
      equitData: [],
      addData: {
        source: "巡检",
        urgency: "一般",
        extension: {
          formData: {},
          formFields: {}
        },
        sourceType: 1,
        receiverId: "",
        receiverName: ""
      },
      spaceProps: {
        label: "spaceName"
      },
      isShowSpace: false,
      file: "",
      dataurl: "",
      filesArr: [],
      images: [],
      value: "",
      logId: (() => {
        return this.$router.history.current.params["logId"];
      })(),
      extension: "",
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        contactName: [
          { required: true, message: "请填写联系人", trigger: "blur" }
        ],
        contactMobile: [
          {
            required: false,
            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            message: "请填写正确的联系方式",
            trigger: "blur"
          }
        ],
        useWorkFlowId: []
      },
      instance: new WorkOrder(),
      vm: {
        isChooseDevice: false,
        // 是否修改
        isUpdate: (uuId => {
          return !!uuId;
        })(this.$router.history.current.params["uuId"]),
        uuId: (uuId => {
          return uuId;
        })(this.$router.history.current.params["uuId"]),
        dataLoading: false,

        isShowDepPerson: false
      }
    };
  },
  mounted() {
    // 新增
    this.vm.isUpdate
      ? this.getWorkOrder()
      : ((this.vm.dataLoading = true), this.init());
  },
  methods: {
    handleRemove(file) {
      this.filesArr = this.filesArr.filter(t => t.name != file.raw.name);
    
    },
    handlechange(file) {
      this.filesArr.push(file.raw);
      console.log(this.filesArr);
    },
    getUsers(data, item) {
      if (data["userIdArr"].length > 0) {
        this.addData.receiverId = data["userIdArr"][0];
        this.addData.receiverName = item["userNameArr"][0];
      }
      this.vm.isShowDepPerson = false;
    },
    changeEquit(item) {
      this.addData.pointName = item.equipName;
      this.addData.pointId = item.id;
    },

    // 获取工单详细
    getWorkOrder() {
      this.vm.dataLoading = true;
      this.instance
        .getWorkOrderByuuId(this.vm.uuId)
        .then(res => {
          // console.log(res);
          this.addData = res.data;
          this.logId = res.data["catalogId"];
          this.init();
        })
        .catch(error => {
          // console.log(error);
          error &&
            this.$message.error(
              error.message || error.status + " " + error.statusText
            );
        })
        .finally(() => {
          this.vm.dataLoading = false;
        });
    },

    // 保存工单
    postWork() {
      // console.log(this.$refs.workorderForm);

      this.$refs.workorderForm
        .validate()
        .then(valid => {
          // console.log(valid);
          return this.addData.approvalModel != 0
            ? this.$refs.approvalForm.validate().then(approvalValid => {
                return valid && approvalValid;
              })
            : valid;
        })
        .then(res => {
          if (res) {
            this.vm.dataLoading = true;
            let _process = this.$refs.makingformcheck
              ? this.$refs.makingformcheck.getData().then(data => {
                  this.addData.extension.formData = data;
                  this.addData.extension.formFields = this.extension;
                  return this.addData;
                })
              : new Promise(resolve => {
                  this.addData.extension.formData = {};
                  this.addData.extension.formFields = { list: [], config: {} };
                  resolve(this.addData);
                });
            return _process.then(res => {
              let formData = new FormData();
              formData.append("formData", window.JSON.stringify(this.addData));
              this.filesArr.forEach(file => {
                formData.append("file", file);
              });
              return addWork(formData);
            });
          }
          return false;
        })
        .then(res => {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
            onClose: message => {}
          });
          this.$router.push({
            name: "workOrder_detail",
            params: { uuId: res.data.uuId }
          });
        })
        .catch(error => {
          // console.log(error);
          error &&
            this.$message.error(
              error.message || error.status + " " + error.statusText
            );
        })
        .finally(() => {
          this.vm.dataLoading = false;
        });
    },

    //编辑工单
    updateWorkOrder() {
      this.$refs.workorderForm
        .validate()
        .then(valid => {
          this.vm.dataLoading = true;
          return this.$refs.makingformcheck.getData().then(data => {
            this.addData.extension.formData = data;
            this.addData.extension.formFields = this.extension;
            let formData = new FormData();
            formData.append("formData", window.JSON.stringify(this.addData));
            this.filesArr.forEach(file => {
              formData.append("file", file);
            });
            return this.instance.updateWorkOrder(formData);
          });
        })
        .then(res => {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
            onClose: message => {}
          });
          this.$router.push({
            name: "workOrder_detail",
            params: { uuId: this.vm.uuId }
          });
        })
        .catch(error => {
          // console.log(error);
          error &&
            this.$message.error(
              error.message || error.status + " " + error.statusText
            );
        })
        .finally(() => {
          this.vm.dataLoading = false;
        });
    },

    init() {
      // 根据id获取服务目录
      datailCatalogs(this.logId)
        .then(res => {
          this.addData.catalogId = res.data.id;
          this.addData.catalogName = res.data.catalogName;
          this.addData.approvalModel = res.data.approvalModel;
          this.vm.isChooseDevice = !!res.data.assignPoint;
          if (res.data.approvalModel != 0) {
            let data = {
              conditionConfig: {
                logic: 1,
                conditions: []
              },
              page: 1,
              rows: 999,
              sidx: "",
              sord: "asc"
            };
            getDefine(data).then(res => {
              this.define = res.data;
            });
          }

          this.extension = JSON.parse(res.data.extension);
          this.isInit = false;

          // 获取空间数据
          return this.getSpaceData();
        })
        .then(res => {
          if (res) {
            this.addData.equipName = res.data[0].equipName;
            this.addData.equipId = res.data[0].equipId;
            this.value = this.addData.equipName;
          }
        })
        .catch(error => {
          this.$message.error(
            error.message || error.status + " " + error.statusText
          );
        })
        .finally(() => {
          this.vm.dataLoading = false;
        });
    },

    // 获取空间数据
    getSpaceData() {
      // 获取空间
      return getScape()
        .then(res => {
          let list = {
            conditionConfig: {
              logic: 1,
              conditions: []
            },
            params: {
              typeId: "",
              spaceId: res.data[0].id
            },
            page: 1,
            rows: 10,
            sidx: "",
            sord: "asc"
          };
          this.spaceData = res.data;
          this.addData.zoneName = res.data[0].spaceName;
          this.addData.zoneId = res.data[0].id;
          // 判断是否需要选择设备
          return this.vm.isChooseDevice ? this.instance.getDevice(list) : false;
        })
        .then(res => {
          this.equitData = res.data;
          return res;
        });
    },

    // 返回处理逻辑
    backPage() {
      this.$router.push(
        (routerName => {
          return routerName === "workOrder_update"
            ? { name: "workOrder_detail", params: { uuId: this.vm.uuId } }
            : { name: "work_list" };
        })(this.$router.history.current.name)
      );
    },
    changeSelect() {
      this.isShowSpace = true;
    },
    hideParentClick(e) {
      var isOther =
        e.relatedTarget == null ||
        e.relatedTarget.closest("div.el-tree") == null ||
        e.relatedTarget.closest("div.el-tree").id != "floatTree";

      if (isOther) {
        this.isShowSpace = false;
      } else {
        e.target.focus();
      }
    },
    selectSpace(spaceIds) {
      let _space = this.$refs["selectSpace"].getCheckedNodes()[0];

      this.selectClass({ spaceName: _space["label"], id: _space["value"] });
    },
    selectClass(data) {
      this.addData.zoneName = data.spaceName;
      this.addData.zoneId = data.id;
      let params = {
        conditionConfig: {
          logic: 1,
          conditions: []
        },
        params: {
          typeId: "",
          spaceId: data.id
        },
        page: 1,
        rows: 10,
        sidx: "",
        sord: "asc"
      };
      this.instance.getDevice(params).then(res => {
        if (res.data.length != 0) {
          this.equitData = res.data;
          this.addData.pointName = res.data[0].equipName;
          this.value = this.addData.pointName;
          this.addData.pointId = res.data[0].id;
        }
      });
    },
    deleteimg(index) {
      this.filesArr.splice(index, 1);
      this.images.splice(index, 1);
    },
    change(e) {
      let files = e.target.files;
      console.log(files);
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      // if (this.images.length + files.length > this.maxCount) {
      //   Toast('最多只能上传' + this.maxCount + '张图片！');
      //   return;
      // }
      let reader;
      let file;
      let images = this.images;
      for (let i = 0; i < files.length; i++) {
        file = files[i];
        this.filesArr.push(file);
        console.log(this.filesArr);
        reader = new FileReader();
        // if (file.size > self.maxSize) {
        //   Toast('图片太大，不允许上传！');
        //   continue;
        // }
        reader.onload = e => {
          let img = new Image();
          img.onload = function() {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let w = 100;
            let h = 100;
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = canvas.toDataURL("image/png");
            images.push(base64);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
