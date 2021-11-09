<template>
    <div class="repairAdd">
        <el-page-header @back="goBack">
          <template slot="content">
            <div class="el-page-header__content">{{this.isUpdate ? '编辑' : '添加'}}任务计划</div>
            <div style="position: absolute;right: 12px; top: 68px;">
              <el-button type="primary" size="small" @click="buildTask('ruleForm')">
                <i class="el-icon-check"></i>
                <span v-if="!isUpdate">生成计划任务</span>
                <span v-if="isUpdate">保存计划任务</span>
              </el-button>
              <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
            </div>
          </template>
        </el-page-header>
        <el-card shadow="hover" style="margin-top: 12px;">
            <el-row>
              <el-col :span="24">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="220px" class="task-plan-form">
                      <div class="title">第1步：填写基础信息</div>
                      <el-form-item label="设备类型" prop="" v-if="this.pageTitle == '新增'">
                          <span>{{typeName}}</span>
                      </el-form-item>
                      <el-form-item label="计划名称" prop="name">
                          <el-input v-model="ruleForm.name"></el-input>
                      </el-form-item>
                    <el-form-item label="所属班组" prop="teamId">
                      <el-select v-model="ruleForm.teamId" placeholder="请选择班组">
                        <el-option
                          v-for="item in vm.workTeam"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>

                    </el-form-item>
                      <el-form-item label="计划类型" prop="planType">
                          <el-select v-model="ruleForm.planType" placeholder="请选择计划类型">
                            <el-option label="巡检" value="inspection"></el-option>
                            <el-option label="保养" value="maintain"></el-option>
                            <el-option label="点检" value="spotcheck"></el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="备注" prop="desc">
                          <el-input type="textarea" v-model="ruleForm.describe" placeholder="请填写备注"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    :disabled="isDisabled">
                          </el-input>
                      </el-form-item>
                      <div class="title">第2步：设置循环周期、时间点</div>
                      <el-form-item label="循视周期" prop="repeatType">
                          <el-select v-model="ruleForm.repeatType" placeholder="请选择循环周期" @change="reList($event)">
                              <el-option label="天" value="1"></el-option>
                              <el-option label="周" value="2"></el-option>
                              <el-option label="月" value="3"></el-option>
                              <!--<el-option label="年" value="4"></el-option>-->
                          </el-select>
                          <div style="margin-top: 20px;width: 50%;" v-if="ruleForm.repeatType == 2">
                              <el-checkbox-group v-model="ruleForm.repeatScope" size="small">
                                  <el-checkbox :label="1" border>周一</el-checkbox>
                                  <el-checkbox :label="2" border>周二</el-checkbox>
                                  <el-checkbox :label="3" border>周三</el-checkbox>
                                  <el-checkbox :label="4" border>周四</el-checkbox>
                                  <el-checkbox :label="5" border>周五</el-checkbox>
                                  <el-checkbox :label="6" border>周六</el-checkbox>
                                  <el-checkbox :label="7" border>周日</el-checkbox>
                              </el-checkbox-group>
                          </div>
                          <div style="margin-top: 20px;width: 50%;" v-if="ruleForm.repeatType == 3">
                              <el-checkbox-group v-model="ruleForm.repeatScope" size="small">
                                  <el-checkbox v-for="(item,index) in 31" :key="index" :label="index + 1" border>{{index>=9 ? '' : '0'}}{{index + 1}}号</el-checkbox>
                              </el-checkbox-group>
                          </div>
                      </el-form-item>
                      <el-form-item
                              v-for="(item, index) in ruleForm.timeList"
                              :label="'巡检时间点-' + (index + 1)"
                              :key="item.key"
                              :prop="'timeList.' + index + '.value'"
                              :rules="{
                                  required: true, message: '时间点不能为空', trigger: 'blur'
                              }">
                          <el-time-picker
                                  v-model="item.value"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  placeholder="任意时间点">
                          </el-time-picker>
                          <el-button @click="removeTimeList(item,index)" type="danger" plain size="small" style="margin-left: 10px;">移除</el-button>
                      </el-form-item>
                      <el-form-item label="" prop="">
                          <el-button type="primary" plain @click="addTimeList" size="mini">添加时间点</el-button>
                      </el-form-item>

                    <div class="title">第3步：选择业务表单与设备信息</div>
                    <div class="choose-equipment"  v-for="(item, index) in ruleForm.forms" :key="index">
                      <div class="equipment-index">{{(index+1)>9 ? (index+1) : '0'+(index+1)}}</div>
                      <el-form-item label="对应表单"
                                    :prop="'forms[' + index + '].formId'"
                                    :rules="{
                                required: true, message: '对应表单不能为空', trigger: 'blur'
                              }">
                        <el-select v-model="item.formId" placeholder="请选择表单" size="small">
                          <el-option
                            v-for="form in vm.extensionForms"
                            :key="form.id"
                            :label="form.name"
                            :value="form.id">
                          </el-option>
                        </el-select>

                        <el-button  type="danger" size="small" style="margin-left: 10px;" @click="ruleForm.forms.splice(index,1)">移除此项</el-button>
                      </el-form-item>
                      <el-form-item label="设备选择" prop="">
                        <el-row >
                          <el-col :span="6" v-for="(equipment, i) in item.equipments" :key="i">
                            <el-card shadow="hover">
                              <el-row>
                                <!--style="border-right: 1px solid #ebeef5; padding-right: 12px;"-->
                                <el-col :span="24">
                                  <h3>{{equipment.equipmentCode}}</h3>
                                  <div class="op-remove">
                                    <el-link @click="removeEquipment(index,i)" type="danger" title="删除" :underline="false" icon="el-icon-delete"></el-link>
                                  </div>
                                  <el-divider></el-divider>
                                  <h4>名称：<span class="eq-value">{{equipment.equipmentName}}</span></h4>
                                  <el-divider></el-divider>
                                  <h4>类型：<span class="eq-value">{{equipment.equipmentTypeName}}</span></h4>
                                  <!--<el-divider></el-divider>-->
                                  <!--<h4>型号：<span class="eq-value">{{equipment.model}}</span></h4>-->
                                </el-col>
                                <!--<el-col :span="4">-->
                                  <!--<div class="eq-vertical">{{equipment.spaceName}}</div>-->
                                <!--</el-col>-->
                              </el-row>
                            </el-card>
                          </el-col>
                          <el-col :span="6">
                            <div class="add-equipment" @click="addEquipmentToPlan(index)">
                              <div>+</div>
                              <div>添加设备</div>
                            </div>
                          </el-col>
                        </el-row>

                      </el-form-item>
                      <el-divider></el-divider>
                    </div>

                    <el-form-item label="" prop="">
                      <el-button type="primary" plain size="mini" @click="addFormAndEquipment">
                        <i class="el-icon-plus"></i>
                        添加一项
                      </el-button>
                    </el-form-item>

                  </el-form>
              </el-col>
            </el-row>
        </el-card>


      <DeviceListDialog :open="vm.dialogVisible" :confirm="confirmAddEquipment" :cancel="()=>{vm.dialogVisible=false}"></DeviceListDialog>

    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="less">
    .repairAdd{

        .title{
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 20px;
        }
        .tips{
            width: 100px;
            text-align: right;
        }
        .choose-equipment{
          position: relative;
          .equipment-index{
            position: absolute;
            left: 40px;
            top: 40%;
            font-size: 30px;
            font-weight: 600;
            color: #1167fa;
          }

          .add-equipment{
            /*margin-top: 10px;*/
            cursor: pointer;
            height:140px ;
            width: 140px;
            background: #e4e7ed;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color:#909399;
            &>div:first-child{
              font-size: 40px;
            }
            &:hover{
              background:rgba(232,243,253);
              color:#1167fa;
            }

          }
          .el-divider--horizontal{
            margin: 10px 0;
            background-color: #ebeef5;
          }
          .el-card{
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .el-card .el-card__body h4{
            line-height: 24px;
            font-size: 13px;
            .eq-value{
              font-weight: 600;
            }
          }
          .el-card .el-card__body h3{
            line-height: 24px;
            font-size: 14px;
            font-weight: 600;

          }
          .el-card .el-card__body{
            padding: 12px;
          }
          .eq-vertical{
            height: 120px;
            padding-left: 12px;
            display: flex;
            align-items: center;
            line-height: 22px;
            font-size: 13px;
            font-weight: 600;
          }

          .op-remove{
            display: none;
            position: absolute;
            right: 0;
            top:-6px;
          }
          .el-card:hover .op-remove{
            display: block;
          }
        }

    }
</style>
