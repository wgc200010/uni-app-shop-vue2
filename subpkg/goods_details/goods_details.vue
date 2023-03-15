<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" indicator-color="#000000" indicator-active-color="#ffffff" :autoplay="true" :interval="2000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i"><image :src="item.pics_big" v-if="item.pics_big" @click="preview(i)"></image></swiper-item>
    </swiper>
    <!-- 商品信息 -->
    <view class="goods-info-box">
      <view class="price" v-if="goods_info.goods_name">￥{{ goods_info.goods_price }}</view>
      <!-- 主体 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{ goods_info.goods_name }}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 购物车，或购买 -->
    <!-- ：fill椭圆形按钮 -->
    <view class="goods_nav"><uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" /></view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapState('m_cart', []),
    ...mapGetters('m_cart', ['total'])
  },
  watch: {
    total: {
      handler(newVal) {
        const findResult = this.options.find(x => x.text === '购物车');
        if (findResult) {
          findResult.info = newVal;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      goods_info: {},
      // 左侧按钮组的配置对象
      options: [
        {
          icon: 'shop',
          text: '店铺',
          infoBackground: '#007aff',
          infoColor: 'red'
        },
        {
          icon: 'cart',
          text: '购物车',
          info: 0
        }
      ],
      // 右侧按钮组的配置对象
      buttonGroup: [
        {
          text: '加入购物车',
          backgroundColor: '#ff0000',
          color: '#fff'
        },
        {
          text: '立即购买',
          backgroundColor: '#ffa200',
          color: '#fff'
        }
      ]
    };
  },
  onLoad(options) {
    // 获取商品 Id
    const goods_id = options.goods_id;
    this.getGoodsDetail(goods_id);
  },
  methods: {
    ...mapMutations('m_cart', ['addToCart']),
    async getGoodsDetail(goods_id) {
      const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id });
      // console.log(res);
      if (res.meta.status !== 200) return uni.$showMsg();
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ');
      // console.log(res.message.goods_introduce);
      // 后缀改成jpg
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg');
      // 为 data 中的数据赋值
      this.goods_info = res.message;
    },
    // 实现轮播图的预览效果
    preview(i) {
      uni.previewImage({
        // 索引
        current: i,
        urls: this.goods_info.pics.map(x => x.pics_big)
      });
    },
    // 左侧按钮的点击事件处理函数
    onClick(e) {
      console.log(e);
      if (e.content.text === '购物车') {
        // 切换到购物车页面
        uni.switchTab({
          url: '/pages/cart/cart'
        });
      }
    },
    buttonClick(e) {
      if (e.content.text === '加入购物车') {
        const goods = {
          goods_id: this.goods_info.goods_id, // 商品的Id
          goods_name: this.goods_info.goods_name, // 商品的名称
          goods_price: this.goods_info.goods_price, // 商品的价格
          goods_count: 1, // 商品的数量
          goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
          goods_state: true // 商品的勾选状态
        };
        this.addToCart(goods);
      }
    }
  }
};
</script>

<style lang="scss">
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods-detail-container {
  padding-bottom: 50px;
}
.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
