<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <!-- 改变搜索框背景 -->
    <!-- <my-search :bgcolor="'#000000'" :radiu="10"></my-search> -->
    <my-search @click="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动 -->
      <scroll-view scroll-y="true" class="left-scroll-view" :style="{ height: wh + 'px' }">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{ item.cat_name }}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{ height: wh + 'px' }" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon.replace('dev', 'web')" mode="widthFix"></image>
              <!-- 文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js';
export default {
  mixins: [badgeMix],
  data() {
    return {
      // 当前设备可用高度
      wh: 0,
      cateList: [],
      active: 0,
      cateLevel2: [],
      scrollTop: 0
    };
  },
  onLoad() {
    const sysinfo = uni.getSystemInfoSync();
    // console.log(sysinfo);
    // this.wh = sysinfo.windowHeight;
    // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度i
    this.wh = sysinfo.windowHeight - 50;
    this.getcateList();
  },
  methods: {
    async getcateList() {
      const { data: res } = await uni.$http.get('/api/public/v1/categories');
      if (res.meta.status !== 200) return uni.$showMsg();
      console.log(res.message[0]);
      this.cateList = res.message;
      this.cateLevel2 = res.message[0].children;
    },
    activeChanged(i) {
      this.active = i;
      this.cateLevel2 = this.cateList[i].children;
      // 让 scrollTop 的值在 0 与 1 之间切换
      this.scrollTop = this.scrollTop === 0 ? 1 : 0;
    },
    // 三级
    gotoGoodsList(item3) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
      });
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
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      background-color: #f7f7f7;
      line-height: 60px;
      text-align: center;
      font-size: 12px;
      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;
        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
}
</style>
