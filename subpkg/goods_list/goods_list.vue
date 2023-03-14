<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)"><my-goods :goods="goods"></my-goods></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 请求参数对象
      queryObj: {
        // 关键词
        query: '',
        // Id
        cid: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      // 总数量
      total: 0,
      isloading: false
    };
  },
  onLoad(options) {
    // 将页面参数转存到 this.queryObj 对象中
    this.queryObj.query = options.query || '';
    this.queryObj.cid = options.cid || '';
    // 调用获取商品列表数据的方法
    this.getGoodsList();
  },
  methods: {
    async getGoodsList(cb) {
      this.isloading = true;
      const { data: res } = await uni.$http.get('/api/public/v1/goods/search');
      // 结束后关闭节流阀
      this.isloading = false;
      cb && cb();
      if (res.meta.status !== 200) return uni.$showMsg();
      // console.log(res);
      // this.goodsList = res.message.goods;
      this.total = res.message.total;
      // 进行新旧数据的拼接
      this.goodsList = [...this.goodsList, ...res.message.goods];
    },
    gotoDetail(goods) {
      console.log(goods);
      uni.navigateTo({
        url: '/subpkg/goods_details/goods_details?doods_id=' + goods.goods_id
      });
    }
  },
  onPullDownRefresh() {
    this.queryObj.pagenum = 1;
    this.total = 0;
    this.isloading = false;
    this.goodsList = [];
    this.getGoodsList(() => uni.stopPullDownRefresh());
  },
  // 触底的事件
  onReachBottom() {
    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('已到底部！');
    if (this.isloading == true) return;
    // 让页码值自增 +1
    this.queryObj.pagenum += 1;
    // 重新获取列表数据
    this.getGoodsList();
  }
};
</script>

<style lang="scss"></style>
