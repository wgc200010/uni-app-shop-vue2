import {
  mapGetters
} from 'vuex'

//  mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    // 监听 total 值的变化
    total() {
      this.setBadge()
    },
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    if (this.total != 0)
      this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
      })
    },
  },
}
