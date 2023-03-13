<template>
  <view class="my-search-container" :style="{ 'background-color': bgcolor }" @click="searchBoxHandler">
    <!-- 使用 view 组件模拟 input 输入框的样式 -->
    <view class="my-search-box" :style="{ 'border-radius': radiu + 'px' }">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    bgcolor: {
      type: String,
      default: '#3299cc'
    },
    radiu: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {};
  },
  methods: {
    searchBoxHandler() {
      // 触发外界通过 @click 绑定的 click 事件处理函数
      this.$emit('click');
    }
  }
};
</script>
<style lang="scss">
.my-search-container {
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.my-search-box {
  height: 36px;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>
