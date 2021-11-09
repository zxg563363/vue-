const Department = () => import("@/page/systemManage/department/department.vue");  //系统管理-部门
const Station = () => import("@/page/systemManage/station/station.vue");  //系统管理-岗位
const DeviceList = () => import("@/page/deviceManage/deviceList/deviceList.vue");  //设备管理-设备列表
const DeviceType = () => import("@/page/deviceManage/deviceType/deviceType.vue");  //设备管理-设备类型
const DeviceScape = () => import("@/page/deviceManage/deviceScape/deviceScape.vue");
const Account = () => import("@/page/systemManage/account/account.vue");  //系统管理-个人设置
const Company = () => import("@/page/systemManage/info/company/company.vue");  //系统管理-基础信息-企业管理
const SpareConfig = () => import("@/page/deviceManage/spareConfig/spareConfig.vue");//设备管理-备件选项配置
const SparePart = () => import("@/page/deviceManage/sparePart/sparePart.vue");//设备管理-仓库配置
const Inventory = () => import("@/page/deviceManage/inventory/inventory.vue");
const Record = () => import("@/page/deviceManage/record/record.vue");
const RepairAdd = () => import("@/page/taskManage/repair/add/add.vue");//任务管理-新建维修表单
const OperateJournal = () => import("@/page/systemManage/operateJournal/operateJournal.vue");//系统管理-操作日志
const Service = () => import("@/page/systemManage/devops/service/service.vue");
const PersonTeam = () => import("@/page/dispatch/personTeam/personTeam.vue");  //调度指挥 人员班组管理
const Workadd = () => import("@/page/workManage/add/add.vue");//工单管理-新建工单
const Workorder = () => import("@/page/workManage/workorder/workorder.vue");//工单管理-新建工单
const Worklist = () => import("@/page/workManage/workadd/workadd.vue");//工单管理-新建工单
const Process = () => import("@/page/systemManage/process/process.vue");//系统管理-流程定制
const Rules = () => import("@/page/workManage/devops/rules/rules.vue");//系统管理-流程定制
const Index = () => import('@/page/dashboard/dashboard.vue');

// 任务服务
import TaskService from '@/page/taskService/index';

// 表单管理
import Form from '@/page/formManage/index';
// 备品
import SpareParts from '@/page/spareParts/index';

// 任务计划
import Task from '@/page/taskManage/index';

// 工单管理
import WorkOrder from '@/page/workManage/index';

// 电源管理
import Power from '@/page/powerManage/index';

// 系统管理
import System from '@/page/systemManage/index';

// 设备管理
import Device from '@/page/deviceManage/index';

// 停送电管理
import PowerSwitch from '@/page/power/index';
// 缺陷管理
import Defect from '@/page/defect/index';

// 库存管理
import Stock from '@/page/stock/index';

// 供货管理（供应商端）
import Supply from '@/page/supply/index';
// 采购管理
import Purchase from '@/page/purchase/index';
export default [
    {
      path: "/index",
      name: "index",
      component: Index,
    },
    // { path: "/createForm", name: "自定义表单", component: CreateForm, },
    { path: "/systemManage/department", name: "system_department", component: Department, },
    { path: "/systemManage/account", name: "system_personal", component: Account, },
    { path: "/systemManage/station", name: "system_station", component: Station, },
    { path: "/systemManage/info/company", name: "system_company", component: Company},
    { path: "/systemManage/operateJournal", name: "system_operation", component: OperateJournal},
    { path: "/taskManage/repair/add", name: "task_plan_repair_add", component: RepairAdd},
    { path: "/dispatch/personTeam", name: "system_team", component: PersonTeam},
    { path: "/systemManage/devops/service", name: "service_log", component: Service},
    { path: "/workManage/add/:logId", name: "work_add", component: Workadd},
    { path: "/workManage/workorder", alias: '/workorder/list', name: "work_order", component: Workorder},
    { path: "/deviceManage/deviceList", name: "device_list", component: DeviceList},
    { path: "/deviceManage/deviceType", name: "device_type", component: DeviceType},
    { path: "/deviceManage/deviceScape", name: "device_space", component: DeviceScape},
    { path: "/deviceManage/spareConfig", name: "device_config", component: SpareConfig},
    { path: "/deviceManage/sparePart", name: "device_part", component: SparePart},
    { path: "/deviceManage/inventory", name: "device_inventory", component: Inventory},
    { path: "/deviceManage/record", name: "device_record", component: Record},
    { path: "/workManage/workadd", alias: '/workorder/add', name: "work_list", component: Worklist},
    { path: "/workManage/devops/rules", name: "work_rules", component: Rules},
    { path: "/systemManage/process", name: "sys_process", component: Process},

    ///-------------------------------------以下是重构----------------------------------------
    // 任务服务模块
    {
        name: 'tasks_service',
        path: '/tasks/service',
        component: {
          template: '<router-view name="tasks_service"></router-view>'
        },
        children: ((taskService)=>{
          return taskService.routers;
        })(new TaskService()),
    },

  // 表单管理模块
    {
      name: 'form',
      path: '/form',
      component: {
        template: '<router-view name="form_manage"></router-view>'
      },
      children: ((form)=>{
        return form.routers;
      })(new Form()),
    },
    // 备品管理
    {
      name: 'spare',
      path: '/spare',
      component: {
        template: '<router-view name="spare_manage"></router-view>'
      },
      children: ((spareParts)=>{
        return spareParts.routers;
      })(new SpareParts()),
    },

    // 任务计划
    {
      name: 'task',
      path: '/task',
      component: {
        template: '<router-view name="task_manage"></router-view>'
      },
      children: ((task)=>{
        return task.routers;
      })(new Task()),
    },

    // 工单管理
    {
      name: 'workOrder',
      path: '/workorder',
      component: {
        template: '<router-view :key="$route.path" name="workOrder_manage" v-if="isRouterAlive"></router-view>',
        provide(){
          return {
            reload: this.reload,
          }
        },
        data(){
          return {
            isRouterAlive: true,
          }
        },
        methods: {
          reload(){
            this.isRouterAlive = false;
            this.$nextTick(()=>{
              this.isRouterAlive = true;
            })
          }
        },

      },
      children: ((workOrder)=>{
        return workOrder.routers;
      })(new WorkOrder()),

    },

    // 电源管理
  {
    name: 'power',
    path: '/power',
    component: {
      template: '<router-view name="power_manage"></router-view>'
    },
    children: ((power)=>{
      return power.routers;
    })(new Power()),
  },

  // 系统管理
  {
    name: 'system',
    path: '/system',
    component: {
      template: '<router-view name="system_manage"></router-view>'
    },
    children: ((system)=>{
      return system.routers;
    })(new System()),
  },

  // 设备管理
  {
    name: 'device',
    path: '/device',
    component: {
      template: '<router-view name="device_manage"></router-view>'
    },
    children: ((device)=>{
      return device.routers;
    })(new Device()),
  },

  // 停送电审批
  {
    name: 'power-switch',
    path: '/power-switch',
    component: {
      template: '<router-view name="power-switch_manage"></router-view>'
    },
    children: ((power)=>{
      return power.routers;
    })(new PowerSwitch()),
  },

  // 库存管理
  {
    name: 'stock',
    path: '/stock',
    component: {
      template: '<router-view name="stock_manage"></router-view>'
    },
    children: ((stock)=>{
      return stock.routers;
    })(new Stock()),
  },

  // 供货管理
  {
    name: 'supply',
    path: '/supply',
    component: {
      template: '<router-view name="supply_manage"></router-view>'
    },
    children: ((supply)=>{
      return supply.routers;
    })(new Supply()),
  },
  // 设备缺陷
  {
    name: 'defect',
    path: '/defect',
    component: {
      template: '<router-view name="defect_manage"></router-view>'
    },
    children: ((defect)=>{
     
      return defect.routers;
    })(new Defect()),
  },
  // 采购管理
  {
    name: 'purchase',
    path: '/purchase',
    component: {
      template: '<router-view name="purchase_manage"></router-view>'
    },
    children: ((purchase)=>{
     
      return purchase.routers;
    })(new Purchase()),
  },

  ///-------------------------------------重构结束----------------------------------------
]
