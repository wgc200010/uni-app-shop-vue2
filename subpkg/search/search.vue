<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none" v-model="shuru"></uni-search-bar>
    </view>
    <!-- 列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchList" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods_name">{{ item.goods_name }}</view>
        <uni-icons class="goods_icon" type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-if="searchList.length === 0">
      <!-- 历史标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <view class="history-list"><uni-tag :text="item" v-for="(item, id) in histories" :key="id" @click="gotoGoodsList(item)"></uni-tag></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 延时器的 timerId
      timer: null,
      // 搜索关键词
      kw: '',
      //双向绑定，将历史标签填入input
      shuru: '',
      searchList: [],
      // 搜索记录，初始假数据
      historyList: ['a', 'app', 'apple']
    };
  },
  onLoad() {
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
  },
  methods: {
    input(e) {
      // 清除 timer 对应的延时器
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 如果 500 毫秒内，没有触发
        this.kw = e; //kw关键词，搜索用
        console.log(this.kw);
        this.getsearchList();
      }, 500);
    },
    async getsearchList() {
      if (this.kw === '') {
        this.searchList = [];
        return;
      }
      const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw });
      if (res.meta.status !== 200) return uni.$showMsg();
      console.log(res);
      this.searchList = res.message;
      this.saveSearchHistory(this.kw);
    },
    saveSearchHistory() {
      // this.historyList.push(thiskw);
      const set = new Set(this.historyList);
      set.delete(this.kw);
      set.add(this.kw);
      console.log(set);
      this.historyList = Array.from(set);
      // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
      uni.setStorageSync('kw', JSON.stringify(this.historyList));
    },
    gotoDetail(item) {
      // console.log(item);
      uni.navigateTo({
        url: '/subpkg/goods_details/goods_details?goods_id=' + item
      });
    },
    cleanHistory() {
      this.historyList = [];
      uni.setStorageSync('kw', '[]');
    },
    gotoGoodsList(item) {
      // uni.navigateTo({
      //   url: '/subpkg/goods_list/goods_list?query=' + item
      // });
      this.shuru = item;
      console.log(item);
    }
  },
  computed: {
    histories() {
      return [...this.historyList].reverse();
    }
  }
};
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods_name {
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      //  ... 代替溢出
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
