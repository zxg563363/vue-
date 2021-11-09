export default {
    data() {
        return {
            formName:'',
            imageUrl:'',
        }
    },
    mounted() {
        document.getElementsByClassName('el-footer')[0].innerHTML = '';
    },
    methods: {
        handleSubmit () {
            const json = this.$refs.makingform.getJSON();
            console.log(json) //这个就是生成的表单数据，可以直接给后台或者直接拿过来生成表单
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
