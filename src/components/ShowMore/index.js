/**
 * Created by lixiansky on 2021/9/9
 */
import {request, variables} from '@/components/mixins/request';
import {axiosInstance} from "@/axios/request";
export default {
  name: 'ShowMore',
  mixins: [request, variables],
  data() {
    return {
      height: 64,
      isShowMore: false,
      isExpand: false,
    }
  },
  mounted() {
    // console.log(window.getComputedStyle(this.$refs['contents'],null).getPropertyValue("height"));
    // console.log(.clientHeight);
    this.isShowMore = this.$refs['contents'].clientHeight > this.height;
  },
  methods: {
    expandContent(){
      this.isExpand = !this.isExpand;
    }
  },
  watch: {
    content: {
      handler(newVal, oldVal) {
        newVal && (this.isShowMore = this.$refs['contents'].clientHeight > this.height)
      }
    },
  },
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  }
}
