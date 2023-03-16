<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">不登就走开...</view>
  </view>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  computed: {
    ...mapState('m_user', ['redirectInfo'])
  },
  methods: {
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
    getUserProfile() {
      uni.getUserProfile({
        desc: '请求授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: res => {
          // console.log(res);
          this.updateUserInfo(res.userInfo);
          console.log(res.userInfo);
          this.getToken(res);
        },
        fail: res => {
          return uni.$showMsg('已取消登录授权');
        }
      });
    },
    async getToken(info) {
      // console.log(info);
      const [err, res] = await uni.login().catch(err => err);
      // 判断是否 uni.login() 调用失败
      if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！');
      const query = {
        code: res.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      };
      const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
      // console.log(loginResult);
      this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'); //在判断登录之前设置假token
      // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！');
      // this.updateToken(loginResult.message.token);
      this.navigateBack();
    },
    // 返回登录之前的页面
    navigateBack() {
      if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
        uni.switchTab({
          url: this.redirectInfo.from,
          complete: () => {
            this.updateRedirectInfo(null);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  position: relative;
  overflow: hidden;
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: #f8f8f8;
    border-radius: 100%;
    transform: translateY(50%);
  }

  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #86c082;
  }

  .tips-text {
    font-size: 20px;
    color: black;
  }
}
</style>
