<template>
  <!-- 最外层的容器 -->
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" />
      <text>全选</text>
    </label>
    <!-- 总价格 -->
    <view class="amount-box">
      合计:
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  computed: {
    ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
    ...mapGetters('m_user', ['addstr']),
    ...mapState('m_user', ['token']),
    ...mapState('m_cart', ['cart']),
    isFullCheck() {
      return this.total === this.checkedCount;
    }
  },
  data() {
    return {
      // 倒计时的秒数
      seconds: 3,
      timer: null
    };
  },
  methods: {
    ...mapMutations('m_cart', ['updateAllGoodsState']),
    ...mapMutations('m_user', ['updateRedirectInfo']),
    changeAllState() {
      // 修改购物车中所有商品的选中状态
      // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
      this.updateAllGoodsState(!this.isFullCheck);
    },
    // 点击了结算按钮
    settlement() {
      // 勾选了要结算的商品
      if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！');
      // 是否选择了收货地址
      if (!this.addstr) return uni.$showMsg('请选择收货地址！');
      //是否登录了
      // if (!this.token) return uni.$showMsg('请先登录！');
      if (!this.token) return this.delayNavigate();
      // 4. 实现微信支付功能
      this.payOrder();
    },
    // 展示倒计时的提示消息
    showTips(n) {
      // 调用 uni.showToast() 方法，展示提示消息
      uni.showToast({
        icon: 'none',
        title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
        mask: true,
        duration: 1500
      });
    },
    delayNavigate() {
      this.seconds = 3;
      this.showTips(this.seconds);
      this.timer = setInterval(() => {
        this.seconds--;
        if (this.seconds <= 0) {
          clearInterval(this.timer);
          uni.switchTab({
            url: '/pages/my/my',
            success: () => {
              this.updateRedirectInfo({
                openType: 'switchTab',
                from: '/pages/cart/cart'
              });
            }
          });
          return;
        }
        this.showTips(this.seconds);
      }, 1000);
    },
    async payOrder() {
      // 1. 创建订单
      // 1.1 组织订单的信息对象
      const orderInfo = {
        order_price: 0.01,
        consignee_addr: this.addstr,
        goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
      };
      const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
      if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！');
      const orderNumber = res.message.order_number;
      console.log(orderNumber);

      // 2. 订单预支付
      // 2.1 发起请求获取订单的支付信息
      const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber });
      // 2.2 预付订单生成失败
      if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！');
      // 2.3 得到订单支付相关的必要参数
      const payInfo = res2.message.pay;

      // 3. 发起微信支付
      // 3.1 调用 uni.requestPayment() 发起微信支付
      const [err, succ] = await uni.requestPayment(payInfo);
      // 3.2 未完成支付
      if (err) return uni.$showMsg('订单未支付！');
      // 3.3 完成了支付，进一步查询支付的结果
      const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber });
      // 3.4 检测到订单未支付
      if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！');
      // 3.5 检测到订单支付完成
      uni.showToast({
        title: '支付完成！',
        icon: 'success'
      });
    }
  }
};
</script>

<style lang="scss">
.my-settle-container {
  /* 底部固定定位 */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  // 将背景色从 cyan 改为 white
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;
  .radio {
    display: flex;
    align-items: center;
  }
  .amount {
    color: #c00000;
  }
  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>
