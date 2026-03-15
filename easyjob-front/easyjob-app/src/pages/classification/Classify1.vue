<template>
  <view>
    <Navbar :showLeft="false" title="试题分类"></Navbar>
  </view>
  <view>
    <uni-grid :column="3" :highlight="true" @change="change">
      <uni-grid-item v-for="(item, index) in 3" :index="index" :key="index">
        <view class="grid-item-box" style="background-color: #fff;">
          <uni-icons type="image" :size="40" color="#777" />
          <text class="text">分类</text>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
  <view class="container">
    <view class="fication-search">
      <input type="text" value="" placeholder="请输入您要搜索的内容"/><image class="search-icon" src="" mode=""></image>
    </view>
    <!-- 滚动区域 -->
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
                <view class="orderlist-list">
                  <view class="list-left">
                    <image src="" mode=""></image>
                  </view>
                  <view class="list-right">
                    <view class="list-name">香辣火锅</view>
                    <view class="list-ping">
                      <u-rate :count="count" active-color="#FFB800" inactive-color="#E0E0E0" size='32' v-model="value"></u-rate>
                      <text>{{4.8}}分</text>
                    </view>
                    <view class="list-meuns"><text>销量{{99}}+</text><text>配送费￥{{3}}</text><text>距离{{1.2}}km</text></view>
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

</template>

<script setup>
import { ref, computed, onMounted, nextTick }  from "vue";
import Navbar from "../components/common/Navbar.vue";

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

const leftIntoView = computed(() => {
  return `left-${leftIndex.value > 3 ? leftIndex.value - 3 : 0}`;
});

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
      const left = [];
      const main = [];

      for (let i = 0; i < 12; i++) {
        left.push(`${i + 1}类商品`);

        const list = [];
        let r = Math.floor(Math.random() * 10);
        r = r < 1 ? 3 : r;
        for (let j = 0; j < r; j++) {
          list.push(j);
        }
        main.push({
          title: `第${i + 1}类商品标题`,
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

    const last = res[res.length - 1].height;
    if (last - 20 < scrollHeight.value) {
      fillHeight.value = scrollHeight.value - last + 20;
    }
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


// 宫格组件

</script>
<!--// import { onLoad } from "@dcloudio/uni-app";-->
<!--// import {ref, reactive, getCurrentInstance, nextTick} from "vue";-->
<!--// const { proxy } = getCurrentInstance();-->
<!--//-->
<!--// const props = defineProps({-->
<!--//   showLeft: {-->
<!--//     type: Boolean,-->
<!--//     default: true-->
<!--//   }-->
<!--// })-->

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

  // & > view {
  //     width: 100%;
  // }

  .scroll-panel {
    flex-grow: 1;
    height: 0;
    overflow: hidden;
  }


}
.fication-search{
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
.fication-search input{
  padding-left: 24rpx;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #B5B5B5;
}
.fication-search input::-webkit-input-placeholder{
  color:red!important;
}

.search-icon{
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
          // border-top: #d6d6d6 solid 1px;
          width: 620upx;
          position: absolute;
          top: 0px;
          right: 0;
          transform: scaleY(0.5); /* 1px像素 */
        }
      }
      .item-name{
        padding-left: 32rpx;
      }
      &.active {
        color: #F7433D;
        background-color: #fff;
      }
      &.active .activelink{
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
.orderlist-list{
  width: 526rpx;
  height: 200rpx;
  background: #FFFFFF;
  margin: 0 auto;
  display: flex;
  border-bottom: 2rpx solid #F5F6F7;
  // border-radius: 8px 8px 8px 8px;
}
.list-left{
  margin: 24rpx;
  width: 152rpx;
  height: 152rpx;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
}
.list-left image{
  width: 100%;
  height: 100%;
}
.list-right{
  flex: 1;
  display: flex;
  flex-direction: column;
}
.list-name{
  margin-top: 24rpx;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 19px;
}
.list-ping{
  margin: 20rpx 0;
  display: flex;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFB800;

}
.list-ping text{
  margin-left: 6rpx;
}
.list-meuns{
  margin-bottom: 28rpx;
  font-size: 12px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #999999;
}
</style>

