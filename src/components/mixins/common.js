/**
 * Created by lixiansky on 2021/9/6
 */
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import moment from "moment";
import parseInt from 'lodash/parseInt';
const common = {
  methods: {
    transformToArrayFormat(childKey='children', nodes){
      if (!nodes) return [];
      let r = [];
      if (isArray(nodes)) {
        for (let i = 0, l = nodes.length; i < l; i++) {
          r.push(nodes[i]);
          if (nodes[i][childKey]) { r = r.concat(this.transformToArrayFormat(childKey, nodes[i][childKey])); }
        }
      } else {
        r.push(nodes);
        if (nodes[childKey]) { r = r.concat(this.transformToArrayFormat(childKey, nodes[childKey])); }
      }
      return r;
    },

    /**
     * 将扁平数据源转为父子层级数据源
     * @param {Array} data 源数据
     * @param {String} primaryIdName 主键属性名称
     * @param {String} parentIdName 父属性名称
     * @return {Array} 子集名称 children
     */
    translateToTreeData(data, primaryIdName, parentIdName){
      if (!data || data.length == 0 || !primaryIdName || !parentIdName) { return []; }

      let tree = [],
        rootIds = [],
        item = data[0],
        primaryKey = item[primaryIdName],
        treeObjs = {},
        parentId,
        parent,
        len = data.length,
        i = 0;

      while (i < len) {
        item = data[i++];
        primaryKey = item[primaryIdName];
        if (isUndefined(treeObjs[primaryKey])) {
          treeObjs[primaryKey] = item;
        } else {
          item = treeObjs[primaryKey];
        }
        parentId = item[parentIdName];

        if (parentId && parentId != '0' && parentId != '-1') {
          parent = treeObjs[parentId];

          if (isUndefined(parent)) {
            for (let n = 0; n < data.length; n++) {
              let temp = data[n];
              if (temp[primaryIdName] == parentId) {
                treeObjs[parentId] = temp;
                parent = treeObjs[parentId];
              }
            }
          }

          if (isUndefined(parent)) {
            rootIds.push(primaryKey);
          } else if (parent.children) {
            parent.children.push(item);
          } else {
            parent.children = [item];
          }
        } else {
          rootIds.push(primaryKey);
        }
      }

      for (i = 0; i < rootIds.length; i++) {
        tree.push(treeObjs[rootIds[i]]);
      }

      return tree;
    },
    // 计算页数
    totalPage(totalRecord, maxResult){
      return parseInt((totalRecord + maxResult - 1) / maxResult);
    }
  },
};

const datePicker = {
  data() {
    return {
      moment: moment,
      pickerOptions: {
        shortcuts: [{
          text: '最近7天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近15天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近90天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  }
};
export {common, datePicker};
