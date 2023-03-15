<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <my-address></my-address>
    <!--标题 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 买的东西 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item :rightOptions="rightOptions" @click="swipeActionClickHandler(goods)">
          <my-goods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算 -->
    <my-settle></my-settle>
    <!-- 空白购物车区域 -->
  </view>
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState, mapMutations } from 'vuex';
export default {
  mixins: [badgeMix],
  computed: {
    ...mapState('m_cart', ['cart'])
  },
  data() {
    return {
      rightOptions: [
        {
          text: '删除',
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }
      ]
    };
  },
  onShow() {
    if (this.total != 0) this.setBadge();
  },
  methods: {
    ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
    radioChangeHandler(e) {
      // console.log(e);
      this.updateGoodsState(e);
    },
    // 商品的数量发生了变化
    numberChangeHandler(e) {
      console.log(e);
      this.updateGoodsCount(e);
    },
    // 点击了滑动操作按钮
    swipeActionClickHandler(goods) {
      console.log(goods);
      this.removeGoodsById(goods.goods_id);
    }
  }
};
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  background-color: #ffffff;

  .empty-img {
    width: 290px;
    height: 290px;
  }

  .tip-text {
    font-size: 30px;
    color: gray;
    margin-top: 55px;
    margin-bottom: 20px;
  }
}
</style>
