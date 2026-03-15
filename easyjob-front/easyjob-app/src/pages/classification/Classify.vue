<template>
  <view>
    <Navbar :showLeft="false" title="试题分类"></Navbar>
  </view>
  <view>
    <uni-grid :column="3" :highlight="true" :show-border="false" :square="false">
      <uni-grid-item
          v-for="(item, index) in list"
          :index="index"
          :key="index"
          @click="jump(item)"
      >
        <view class="grid-item-box" style="background-color: #fff">
          <image :src="item.url" class="image" mode="aspectFill" />
          <text class="text">{{ item.text }}</text>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
  <view class="container">
    <view class="scroll-panel" id="scroll-panel">
      <view class="list-box">
        <view class="left">
          <scroll-view scroll-y="true" :style="{ height: scrollHeight + 'px' }" :scroll-into-view="leftIntoView">
            <view
                class="item"
                v-for="(item, index) in leftArray"
                :key="index"
                :class="{ active: index == leftIndex }"
                :id="'left-' + index"
                :data-index="index"
                @tap="leftTap"
            >
              <view class="activelink"></view>
              <text class="item-name">{{ item }}</text>
            </view>
          </scroll-view>
        </view>
        <view class="main">
          <scroll-view scroll-y="true" :style="{ height: scrollHeight + 'px' }" @scroll="mainScroll" :scroll-into-view="scrollInto" scroll-with-animation="true">
            <view class="item main-item" v-for="(item, index) in mainArray" :key="index" :id="'item-' + index">
              <view class="title">
                <view>{{ item.title }}</view>
              </view>
              <view class="goods" v-for="(item2, index2) in item.list" :key="index2">
                <view class="orderlist-list" @click="jumpKu(item2)">
                  <view class="list-right">
                    <view class="list-name">{{ item2.name}}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="fill-last" :style="{ height: fillHeight + 'px' }"></view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
<!--  <NavbarFooter :currentIndex="1" />-->
</template>

<script setup>
import Navbar from "../components/common/Navbar.vue";
import { useBookCategoryStore } from '@/stores/bookCategory'

import { ref, reactive, getCurrentInstance, nextTick, computed, onMounted } from "vue";
const { proxy } = getCurrentInstance();
import { LOCAL_STORAGE_KEY } from "@/utils/Constants.js";
import NavbarFooter from "../components/common/NavbarFooter.vue";

const scrollHeight = ref(400);
const scrollTopSize = ref(0);
const fillHeight = ref(0); // 填充高度，用于最后一项低于滚动区域时使用
const leftArray = ref([]);
const mainArray = ref([]);
const topArr = ref([]);
const leftIndex = ref(0);
const scrollInto = ref('');
const count = ref(5);
const value = ref(4);
const bookCategoryStore = useBookCategoryStore();
console.log('bookCategoryStore', bookCategoryStore.getInfo());
const bookArry = ref([]);

const jump = (item) => {
  if (item.needLogin) {
    const token = uni.getStorageSync(LOCAL_STORAGE_KEY.token.key);
    if (token == "" || token == null) {
      uni.navigateTo({
        url: "/pages/account/LoginAndRegister",
      });
      return;
    }
  }
  if (item.clickFun) {
    item.clickFun();
    return;
  }
  uni.navigateTo({
    url: item.path,
  });
}

const jumpKu = async (item) => {
  if (item.needLogin) {
    const token = uni.getStorageSync(LOCAL_STORAGE_KEY.token.key);
    if (token == "" || token == null) {
      uni.navigateTo({
        url: "/pages/account/LoginAndRegister",
      });
      return;
    }
  }
  if (item.clickFun) {
    item.clickFun();
    return;
  }
  // uni.navigateTo({
  //   // url: "/pages/classification/ClassifyBook",
  //   url: item.path,
  // });
  // 判断 item.name 是否包含 "真题"
  if (item.name && item.name.includes("真题")) {
    try {
      const url = await PastPaperText(item.name);  //使用 await 等待返回结果
      uni.navigateTo({ url });  // 此时 url 才是字符串
    } catch (err) {
      uni.showToast({ title: '获取真题失败', icon: 'none' });
      console.error(err);
    }
  } else {
    uni.navigateTo({ url: item.path });
  }
}

const PastPaperText = async (item) => {
  console.log('item', item);
  let result = await proxy.Request({
    url: proxy.Api.createPostPaperText,
    showLoading: false,
    params: {
      categoryName: item,
      pageNo: 1,
    },
  });
  if (!result) {
    return;
  }
  console.log("createPostPaperText 已执行");
  const url = `/pages/classification/PastPaper?categoryName=${categoryName}&textId=${result.data.textId}`;
  console.log('url', url);
  return url;
};


const list = ref([
  {
    text: "错题集",
    url: "/static/errorBook1.png",
    path: "/pages/my/WrongQuestionList",
    needLogin: true
  },
  {
    text: "背诵收藏",
    url: "/static/collectImg1.png",
    path: "/pages/my/CollectQuestion",
    needLogin: true
  },
  {
    text: "考题收藏",
    url: "/static/note.png",
    path: "/pages/my/CollectExamQuestionList",
    needLogin: true
  },
]);

const dynamicList = ref([]);

const leftIntoView = computed(() => {
  return `left-${leftIndex.value > 3 ? leftIndex.value - 3 : 0}`;
});

const categoryName = ref('');

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initScrollView().then(() => {
        getListData();
      });
    }, 200);
  });
});

const initScrollView = () => {
  return new Promise((resolve, reject) => {
    const view = uni.createSelectorQuery().select('#scroll-panel');
    view.boundingClientRect(res => {
      scrollTopSize.value = res.top;
      scrollHeight.value = res.height;
      nextTick(() => {
        resolve();
      });
    }).exec();
  });
};

const getListData = () => {
  return new Promise((resolve, reject) => {
    uni.showLoading();
    setTimeout(() => {
      const left = ["肖系列", "涛系列", "腿系列", "其他", "历年真题"];
      const leftId = ["10000", "10001", "10002", "10003", "10004"];
      const main = [];
      for (let i = 0; i < left.length; i++) {
        const list = [];

        for (let k = 0; k < bookCategoryStore.getInfo().length; k++) {
          if (bookCategoryStore.getInfo()[k].pId == leftId[i]) {
            list.push({
              name: bookCategoryStore.getInfo()[k].categoryName,
              path: `/pages/classification/ClassifyBook?id=${bookCategoryStore.getInfo()[k].categoryName}`
            });
          }
        }
        main.push({
          title: `${left[i]}`,
          list
        });
      }
      resolve({ left, main });
    }, 1000);
  }).then(res => {
    console.log('-----------请求接口返回数据示例-------------');
    console.log(res);

    uni.hideLoading();
    leftArray.value = res.left;
    mainArray.value = res.main;

    nextTick(() => {
      getElementTop();
    });
  });
};

const getElementTop = () => {
  return new Promise((resolve, reject) => {
    const view = uni.createSelectorQuery().selectAll('.main-item');
    view.boundingClientRect(data => {
      resolve(data);
    }).exec();
  }).then(res => {
    const topArr = res.map(item => {
      return item.top - scrollTopSize.value; /* 减去滚动容器距离顶部的距离 */
    });
    topArr.value = topArr;

    const lastItem = res[res.length - 1];
    if (lastItem && lastItem.height) {
      const last = lastItem.height;
      if (last - 20 < scrollHeight.value) {
        fillHeight.value = scrollHeight.value - last + 20;
      }
    } else {
      console.warn('Last item or its height is undefined');
    }
  }).catch(error => {
    console.error('Error in getElementTop:', error);
  });
};

const mainScroll = (e) => {
  const top = e.detail.scrollTop;
  let index = 0;
  for (let i = topArr.value.length - 1; i >= 0; i--) {
    if (top + 2 >= topArr.value[i]) {
      index = i;
      break;
    }
  }
  leftIndex.value = index < 0 ? 0 : index;
};

const leftTap = (e) => {
  const index = e.currentTarget.dataset.index;
  scrollInto.value = `item-${index}`;
};

const change = (e) => {
  const { index } = e.detail;
  if (list.value[index].badge) {
    list.value[index].badge++;
  }
};

</script>

<style lang="scss">
page,
.container {
  width: 100vw;
  height: 100%;
}
/* 容器 */
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  .scroll-panel {
    flex-grow: 1;
    height: 0;
    overflow: hidden;
  }
}

.fication-search {
  width: 686rpx;
  height: 64rpx;
  margin: 12rpx auto;
  background: #F5F6F7;
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.fication-search input {
  padding-left: 24rpx;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #B5B5B5;
}

.fication-search input::-webkit-input-placeholder {
  color: red !important;
}

.search-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 30rpx;
}

.list-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  font-size: 28rpx;

  .left {
    width: 196rpx;
    background: #F5F6F7;
    line-height: 112rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    font-family: PingFang SC-Medium, PingFang SC;

    .item {
      position: relative;
      display: flex;

      &:not(:first-child) {
        margin-top: 1px;

        &::after {
          content: '';
          display: block;
          height: 0;
          width: 620upx;
          position: absolute;
          top: 0px;
          right: 0;
          transform: scaleY(0.5); /* 1px像素 */
        }
      }

      .item-name {
        padding-left: 32rpx;
      }

      &.active {
        color: #F7433D;
        background-color: #fff;
      }

      &.active .activelink {
        width: 8rpx;
        height: 48rpx;
        margin-top: 32rpx;
        padding-left: 0;
        background-color: #F7433D;
        border-radius: 2px 2px 2px 2px;
      }
    }

    .fill-last {
      height: 0;
      width: 100%;
      background: none;
    }
  }

  .title {
    line-height: 64rpx;
    font-size: 16px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #000000;
    padding: 8rpx 0;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 19;
  }
}

.orderlist-list {
  width: 526rpx;
  //height: 200rpx;
  height: 80rpx;
  background: #FFFFFF;
  margin: 0 auto;
  display: flex;
  border-bottom: 2rpx solid #F5F6F7;
}

.list-left {
  margin: 24rpx;
  width: 152rpx;
  height: 152rpx;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
}

.list-left image {
  width: 100%;
  height: 100%;
}

.list-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-name {
  margin-top: 24rpx;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 19px;
}

.list-ping {
  margin: 20rpx 0;
  display: flex;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFB800;
}

.list-ping text {
  margin-left: 6rpx;
}

.list-meuns {
  margin-bottom: 28rpx;
  font-size: 12px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #999999;
}


// 宫格
.image {
  width: 40px;
  height: 40px;
}

.text {
  font-size: 14px;
  margin-top: 5px;
}

.example-body {
  // display: block;
}

.grid-dynamic-box {
  margin-bottom: 15px;
}

.grid-item-box {
  flex: 1;
  // position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}

.grid-item-box-row {
  flex: 1;
  // position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}

.grid-dot {
  position: absolute;
  top: 5px;
  right: 15px;
}

.swiper {
  height: 420px;
}

@media screen and (min-width: 768px) and (max-width: 1425px) {
  .swiper {
    height: 630px;
  }
}

@media screen and (min-width: 1425px) {
  .swiper {
    height: 830px;
  }
}
</style>
