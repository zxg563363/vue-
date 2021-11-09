/**
 * Created by lixiansky on 2021/8/2
 */
import isBoolean from 'lodash/isBoolean';
const request = {
  methods: {
    //错误处理
    errorProcess(data){
      let results = data.data;
      if(results.status && results.status === 200){
        return results;
      }
      throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
    },

    requestProcess(reqPromise){
      return new Promise((resolve, reject) => {
        return reqPromise.then(data=>{
          if(isBoolean(data.data)){
            resolve(data);
            return data;
          }
          let results = data.data;
          if(results.status && results.status === 200){
            resolve(results);
            return results;
          }
          throw new Error(results.error ? ((results.error.errorCode || results.error) + '【' + (results.error.errorMsg || results.msg) + '】'): '未知错误');
        }).catch(error => {
          this.$message.error((error.message || (error.status + ' ' + error.statusText)));
          reject(error);
        });
      });
    },

  },
};

// 变量
const variables = {
  data() {
    return {
      dialogVisible: false,
      entityData: {},
      dataLoading: false,
      // 树形数据
      treeData: [],
      treeDataLoading: false,

      tableData: [],
      tableDataLoading: false,
      pageData: {},
      pageSizes: [5,10,20,30,40,50,100],

      breadcrumbList: [],

      query: {
        key: '',
      }

    };
  },
};
export {request, variables};
