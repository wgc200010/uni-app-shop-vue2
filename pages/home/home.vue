<template>
  <view>
    <view class="search-box"><my-search @click="gotoSearch"></my-search></view>
    <!-- <my-search :bgcolor="'#000000'" :radiu="10"></my-search> -->
    <!-- <my-search @click="gotoSearch"></my-search> -->
    <!-- <轮播图区域 ,'usp'快速生成-->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_details/goods_details?goods_id=' + item.goods_id"><image :src="item.image_src"></image></navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)"><image :src="item.image_src" class="nav-img"></image></view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item.product_list[0].url">
              <image :src="item2.image_src" mode="widthFix" :style="{ width: item2.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js';
export default {
  mixins: [badgeMix],
  data() {
    return {
      // 轮播图的数据列表
      swiperList: [],
      navList: [],
      floorList: []
    };
  },
  onLoad() {
    //获取轮播图
    this.getSwiperList();
    this.getNavList();
    this.getfloorList();
  },
  methods: {
    async getSwiperList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
      // console.log(res);
      if (res.meta.status !== 200) return uni.$showMsg();
      this.swiperList = res.message;
      uni.$showMsg('请求成功');
    },
    async getNavList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
      // console.log(res);
      this.navList = res.message;
      uni.$showMsg('请求成功');
    },
    navClickHandler(e) {
      // console.log(e);
      if (e.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        });
      }
    },
    async getfloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');
      // console.log(res);
      // 对数据进行处理
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
        });
      });
      this.floorList = res.message;
    },
    gotoSearch() {
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    }
  }
};
</script>

<style lang="scss">
.search-box {
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}
swiper {
  height: 330rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
