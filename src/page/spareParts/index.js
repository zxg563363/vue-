/**
 * Created by lixiansky on 2021/7/5
 */
import assign from 'lodash/assign';
import request,{axiosInstance} from "@/axios/request";
import Base from "../../apps";
export default class SpareParts extends Base{
  constructor() {
    super();

    this.breadcrumbList = [
      {
        path: '/',
        name: '首页'
      },
      {
        name: '库存管理'
      }
    ];

    // 此模块的子路由
    this.routers = [
      {
        path: "list",
        name: "spare_list",
        meta: {
          title: '备品列表',
          keepAlive: true
        },
        components: {
          // 父级路由名称
          spare_manage: () => {
            // 注意是：/* webpackChunkName: "Test" */ "../views/Test/Test.vue" 中间有空格
            return import(/* webpackChunkName: "spare_parts_list" */ "./list/list.vue");
          },
        },
      },
    ];
  }

  getData(page,rows,params) {
    return axiosInstance({
      url: '/api-capital/spare/search',
      method: 'post',
      data:((_params)=>{
        return assign({
          sidx: "createTime",
          sord: "desc",
          "page":page,rows,
        },_params)
      })((params ? params : {})),
    })
  }

  // 获取备品信息数据
  getSpareTreeData(){
    return axiosInstance({
      url: '/api-capital/spare/type/tree',
      method: 'get',
      params:{
        validity: 1,
      },
    })
  }

  // 保存备件类型信息
  saveSpareType(data){
    return request({
      url: '/api-capital/spare/type',
      method: 'post',
      data:data,
    })
  }

  updateSpareType(data){
    return request({
      url: '/api-capital/spare/type',
      method: 'patch',
      data:data,
    })
  }

  saveSpare(data){
    return request({
      url: '/api-capital/spare',
      method: 'post',
      data:data,
    })
  }

  updateSpare(data){
    return request({
      url: '/api-capital/spare',
      method: 'Patch',
      data:data,
    });
  }

  // 根据类型数据字典
  getDictByType(type){
    return axiosInstance({
      url: '/api-global/sys/dict',
      method: 'get',
      params:{
        type
      },
    })
  }

  // 查询设备类型
  getEquipmentTypeTree(){
    return axiosInstance({
      url: '/api-capital/equipment/type',
      method: 'get',
      params:{},
    });
  }

  // 移除设备类型
  removeSpareTypeById(id){
    return request({
      url: '/api-capital/spare/type/'+id,
      method: 'delete',
      params:{},
    });
  }

  // 移除备品备件
  removeSpareById(id){
    return request({
      url: '/api-capital/spare/'+id,
      method: 'delete',
      params:{},
    });
  }

  // 获取备品备件
  getSpareById(id){
    return axiosInstance({
      url: '/api-capital/spare/'+id,
      method: 'get',
      params:{},
    });
  }

  // 改变备件的状态
  changeStatus(id,status){
    return request({
      url: '/api-capital/spare/'+id+'/'+status,
      method: 'patch',
      data: {},
    });
  }
}
