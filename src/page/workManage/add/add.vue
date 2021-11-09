<template>
  <el-row class="workadd">
    <el-col :span="24" class="addType">
      <el-page-header @back="backPage">
        <template slot="content">
          <div class="el-page-header__content">
            {{ vm.isUpdate ? "编辑" : "新建" }}工单
          </div>
          <div style="position: absolute; right: 0px; top: 0">
            <el-button
              v-if="!vm.isUpdate"
              type="primary"
              size="small"
              @click="postWork"
            >
              <i class="el-icon-check"></i>
              立即创建
            </el-button>

            <el-button v-if="vm.isUpdate" size="small" @click="getWorkOrder">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
            <el-button
              v-if="vm.isUpdate"
              :loading="vm.dataLoading"
              type="primary"
              size="small"
              @click="updateWorkOrder"
            >
              <i class="el-icon-check"></i>
              确定保存
            </el-button>
          </div>
        </template>
      </el-page-header>
      <div class="widget-box" style="margin-top: 12px">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333">基本信息</h5>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <el-form
              ref="workorderForm"
              :model="addData"
              label-suffix="："
              v-loading="vm.dataLoading"
              :rules="rules"
              size="small"
              style="width: 800px; margin: 0 auto"
              label-width="100px"
            >
              <el-form-item label="工单类型">
                <span style="font-weight: bold">{{ addData.catalogName }}</span>
              </el-form-item>
              <el-form-item label="工单编号">
                <span v-if="!vm.isUpdate" style="font-weight: bold"
                  >工单编号将在信息成功创建后由系统生成</span
                >
                <span v-else style="font-weight: bold">{{ addData.uuId }}</span>
              </el-form-item>
              <el-form-item label="工单标题" prop="title">
                <el-input
                  v-model="addData.title"
                  placeholder="一个好的标题，对解决问题是有很大帮助的"
                  maxlength="100"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="来源">
                <el-radio-group v-model="addData.source">
                  <el-radio-button label="巡检"></el-radio-button>
                  <el-radio-button label="告警"></el-radio-button>
                  <el-radio-button label="其他"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="优先级">
                <el-radio-group v-model="addData.urgency">
                  <el-radio-button label="一般"></el-radio-button>
                  <el-radio-button label="低"></el-radio-button>
                  <el-radio-button label="高"></el-radio-button>
                  <el-radio-button label="紧急"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="空间选择">
                <el-cascader
                  v-model="addData.zoneId"
                  style="width: 60%"
                  :options="spaceData"
                  @change="selectSpace"
                  ref="selectSpace"
                  :props="{
                    checkStrictly: true,
                    label: 'spaceName',
                    value: 'id',
                  }"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item v-if="vm.isChooseDevice" label="设备选择">
                <el-select
                  v-model="value"
                  @change="changeEquit"
                  value-key="id"
                  clearable
                  style="width: 60%"
                >
                  <el-option
                    v-for="(item, i) in equitData"
                    :key="item.id"
                    :label="item.equipName + '（' + item.equipCode + '）'"
                    :value="item"
                    no-data-text="暂无设备"
                  >
                    <span style="float: left">{{ item.equipName }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.equipCode }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人" prop="contactName">
                <el-input
                  v-model="addData.contactName"
                  placeholder="联系人姓名"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="contactMobile">
                <el-input
                  v-model="addData.contactMobile"
                  maxlength="11"
                  placeholder="手机号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="情况说明">
                <el-input
                  v-model="addData.description"
                  placeholder="详细的描述，问题解决的更快呦~"
                  maxlength="500"
                  show-word-limit
                  type="textarea"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action=""
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  :on-change="handlechange"
                  
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                  
                </el-upload>
              </el-form-item>
              <el-form-item label="处理人">
                <el-button
                  v-if="!addData.receiverId"
                  @click="
                    () => {
                      vm.isShowDepPerson = true;
                    }
                  "
                  type="text"
                  class="f-s-13"
                  ><i class="el-icon-circle-plus-outline"></i>
                  添加处理人</el-button
                >
                <el-tag
                  v-else
                  size="mini"
                  closable
                  :disable-transitions="true"
                  @close="
                    () => {
                      (addData.receiverId = ''), (addData.receiverName = '');
                    }
                  "
                >
                  {{ addData.receiverName }}
                </el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="widget-box" v-if="addData.approvalModel != 0 && !vm.isUpdate">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333">审批流程信息</h5>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <el-form
              ref="approvalForm"
              :model="addData"
              label-suffix="："
              size="small"
              style="width: 800px; margin: 0 auto"
              label-width="100px"
            >
              <el-form-item
                v-if="addData.approvalModel == 2"
                label="审批流程"
                prop="useWorkFlowId"
                :rules="{
                  required: true,
                  message: '审批流程不能为空',
                  trigger: 'blur',
                }"
              >
                <el-select v-model="addData.useWorkFlowId" clearable>
                  <el-option
                    v-for="(item, i) in define"
                    :key="i"
                    :label="item.workflowName"
                    :value="item.workflowId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-if="addData.approvalModel == 1"
                label="审批流程"
                prop="useWorkFlowId"
                clearable
              >
                <el-select v-model="addData.useWorkFlowId">
                  <el-option
                    v-for="(item, i) in define"
                    :key="i"
                    :label="item.workflowName"
                    :value="item.workflowId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="widget-box">
        <div class="widget-header">
          <h5 class="widget-title" style="color: #333333">表单扩展内容</h5>
        </div>
        <div class="widget-body">
          <div class="widget-main">
            <fm-generate-form
              v-if="extension"
              :data="extension"
              :value="addData.extension.formData"
              style="width: 800px; margin: 0 auto"
              ref="makingformcheck"
            >
            </fm-generate-form>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div style="width: 600px; margin: 0 auto">
        <el-button
          v-if="!vm.isUpdate"
          type="primary"
          size="small"
          @click="postWork"
        >
          <i class="el-icon-check"></i>
          立即创建
        </el-button>
        <el-button
          v-if="vm.isUpdate"
          :loading="vm.dataLoading"
          type="primary"
          size="small"
          @click="updateWorkOrder"
        >
          <i class="el-icon-check"></i>
          确定保存
        </el-button>
        <el-button size="small" @click="backPage"> 返回 </el-button>
      </div>
    </el-col>
    <!--选择处理人-->
    <dep-to-person
      :opens="vm.isShowDepPerson"
      :multi-select="false"
      :father-data="[]"
      @dialogOpen="
        (res) => {
          vm.isShowDepPerson = res;
        }
      "
      @personParams="getUsers"
    ></dep-to-person>
  </el-row>
</template>

<script src="./add.js"></script>
<style scoped lang="less" src="./add.less"></style>
