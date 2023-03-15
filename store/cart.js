export default {
  namespaced: true,
  //  state 数据
  state: () => ({ // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      // 查看是否存在，不存在返回undefined
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if (!findResult) {
        // 为undefined,则直接 push
        state.cart.push(goods)
      } else {
        // 存在。增加数量
        findResult.goods_count++
      }
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      //如果存在
      if (findResult) {
        findResult.goods_state = goods.goods_state
        //保存本地
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤,选择出正确的id
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },

  // 模块的 getters 属性
  getters: {
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 商品的总价
    checkedGoodsAmount(state) {
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        .toFixed(2)
    }
  },
}
