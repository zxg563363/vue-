/**
 * Created by lixiansky on 2021/7/2
 */
import assign from 'lodash/assign';
import Form from '../index';
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        formType: 'inspection',
        remark: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入表单名称', trigger: 'blur'},
          {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
        ],
        formType: [
          {required: true, message: '请输入表单类型', trigger: 'blur'}
        ],
      },
      instance: new Form(),
      vm: {
        isUpdate: (()=>{
          return this.$router.currentRoute.name === 'form_update';
        })(),
        formId: this.$route.params.id,
      }
    };
  },
  components: {},

  mounted() {
    this.vm.isUpdate && (this.getForm());
  },
  methods: {
    goBack(){
      this.$router.push({name: 'form_list'});
    },

    // 保存表单
    saveForm(){
      this.$refs.designForm.validate().then((valid) => {
        // 获取设计的数据
        let _postData = assign({
          formDetails: (()=>{
            return JSON.stringify(this.$refs.makingform.getJSON());
          })()
        },this.ruleForm);
        return this.instance.saveForm(_postData);
      }).then((results)=>{
        this.$message({
          showClose: true,
          message: '保存表单成功！',
          type: 'success',
          onClose:(message)=>{
            this.goBack();
          }
        });
      }).catch(error => {
        // console.log(error);
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 修改表单
    modifyForm(){
      this.$refs.designForm.validate().then((valid) => {
        // 获取设计的数据
        console.log(this.$refs.makingform.getJSON());
        let _postData = assign(this.ruleForm,{
          formDetails: (()=>{
            return JSON.stringify(this.$refs.makingform.getJSON());
          })()
        });
        return this.instance.updateForm(this.vm.formId,_postData);
      }).then((results)=>{
        this.$message({
          showClose: true,
          message: '更新表单成功！',
          type: 'success',
          onClose:(message)=>{
            this.goBack();
          }
        });
      }).catch(error => {
        // console.log(error);
        error && this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    },

    // 获取表单
    getForm(){
      this.instance.getFormDataById(this.$route.params.id).then((results)=>{
        this.ruleForm = results.data;
        let _formJSON = results.data.formDetails ? JSON.parse(results.data.formDetails) : {list:[],config:{labelWidth:100,labelPosition:'right',size: 'small'}};

        this.$refs.makingform.setJSON(_formJSON);
      }).catch(error => {
        // console.log(error);
        this.$message.error((error.message || (error.status + ' ' + error.statusText)));
      });
    }
  }
}
