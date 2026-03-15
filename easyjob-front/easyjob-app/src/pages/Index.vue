<template>
  <Navbar :showLeft="false" title="考研政治刷题复习"></Navbar>
  <view class="content">
    <view class="uni-margin-wrap">
      <swiper class="swiper-box" indicator-dots autoplay="true">
        <swiper-item v-for="(item, index) in carouselList" :key="index">
          <view class="swiper-item">
            <image
              @click="swiperJump(item)"
              :src="proxy.Api.domain + proxy.Api.imageUrl + item.imgPath"
              mode="aspectFill"
              :style="{ width: '100%' }"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <uni-notice-bar show-icon scrollable
                    text="题库持续更新中，意见反馈及版本更新请在个人中心反馈查看。" />

    <view class="quick-list"> <!--轮播图下方两个方框-->
      <view class="quick-item search" @click="goSearch">
        <view class="title">搜索入口</view>
        <view class="summary">支持通过关键词搜索</view>
        <view class="btn">去搜索</view>
      </view>
      <view class="quick-item interview" @click="goExam">
        <view class="title">在线考试</view>
        <view class="summary">考考你学的怎么样了</view>
        <view class="btn">去考试</view>
      </view>
    </view>
    <view class="category-title">精选题集</view>
    <view class="category-list">
      <uni-grid :column="3" :show-border="false" :square="false">
        <uni-grid-item
          v-for="(item, index) in questionCategoryStore.getInfo()"
          :index="index"
          :key="index"
        >
          <view class="category-item">
            <view
              class="category-item-inner"
              :style="{ background: item.bgColor }"
              @click="goQuestion(item)"
            >
              <image
                v-if="item.iconPath"
                :style="{ width: '100%', height: '100px' }"
                :src="proxy.Api.domain + proxy.Api.imageUrl + item.iconPath"
                mode="aspectFill"
              ></image>
              <view v-else>{{ item.categoryName }}</view>
            </view>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <Update ref="updateRef"></Update>
  </view>
<!--  <NavbarFooter :currentIndex="0" />-->
</template>

<script setup>
import Update from "@/pages/components/Update.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
const { proxy } = getCurrentInstance();

import { useQuestionCategoryStore } from "@/stores/questionCategory";
import NavbarFooter from "./components/common/NavbarFooter.vue";
const questionCategoryStore = useQuestionCategoryStore();
console.log("questionCategoryStore", questionCategoryStore.getInfo());

const carouselList = ref([]);

const loadCarouselData = async () => {
  let result = await proxy.Request({
    url: proxy.Api.loadCarousel, // main.js中引用api
    showLoading: false,
  });
  if (!result) {
    return;
  }
  carouselList.value = result.data;
  console.log("carouselList.value======", carouselList.value);
};

loadCarouselData();
// 以下为首页点击跳转
const goExam = () => { // 首页点击跳转
  uni.switchTab({
    url: "./exam/ExamIndex",
  });
};

const swiperJump = (data) => {
  console.log("jumpData=========", data);
  let url = `/pages/share/ShareDetail?shareId=${data.objectId}`;
  if (data.objectType == 1) {
    url = `/pages/question/QuestionDetail?questionId=${data.objectId}`;
  } else if (data.objectType == 2) {
    url = `/pages/carousel/ExamQuestion?questionId=${data.objectId}`;
  } else if (data.objectType == 3) { // 轮播图这里单独写一个页面
    url = `/pages/carousel/WebView?url=${encodeURI(data.outerLink)}`;
  }
  uni.navigateTo({
    url: url,
  });
};

const goSearch = () => {
  uni.navigateTo({
    url: `/pages/search/SearchIndex`,
  });
};

const goQuestion = (item) => {
  console.log("item", item);
  uni.navigateTo({
    url: `/pages/classification/ClassifyList?categoryId=${
      item.categoryId
    }&categoryName=${encodeURIComponent(item.categoryName)}`,
  });
};

const updateRef = ref();
const checkUpdate = () => {

  // 页面加载完成后检查更新
  onMounted(() => {
    nextTick(() => {
      if (updateRef.value) {
        updateRef.value.checkUpdate(false);
      }
    });
  });
};
checkUpdate();
</script>

<style lang="scss" scoped>
.top {
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #9005fa;
  height: 40px;

  .logo {
    color: #fff;
    font-size: 20px;
  }

  .search {
    font-size: 25px;
    color: #fff;
  }
}

.uni-margin-wrap {
  width: 100%;
  background: #e0e0e0;
  .swiper-box {
    height: 200px;
  }
  .swiper-item {
    justify-content: center;
    align-items: center;
    display: flex;
    height: 200px;
  }
}

.quick-list {
  display: flex;
  margin-top: 20px;

  .quick-item {
    width: 100%;
    margin: 0px 5px;
    border-radius: 5px;
    padding: 15px;
    color: #fff;

    .title {
      font-weight: bold;
    }

    .summary {
      font-size: 14px;
      margin-top: 2px;
    }

    .btn {
      margin-top: 10px;
      float: left;
      font-size: 12px;
      border-radius: 5px;
      padding: 4px 10px 4px 10px;
    }
  }

  .search {
    background: #6663cd;

    .btn {
      background: #8891ed;
    }
  }

  .interview {
    background: #aa6bd9;
    .btn {
      background: #874ec1;
    }
  }
}

.category-title {
  margin-top: 20px;
  padding-left: 10px;
  font-weight: bolder;
  color: #464646;
}
.category-list {
  margin-top: 10px;
  overflow: hidden;
  padding: 0px 5px 10px 5px;
  .category-item {
    padding: 3px;
    .category-item-inner {
      height: 100px;
      border-radius: 5px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      overflow: hidden;
    }
  }
}
</style>
