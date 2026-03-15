<template>
  <view class="navbar-footer">
    <view class="tab-bar">
      <view
        v-for="(item, index) in tabBar.list"
        :key="index"
        class="tab-item"
        :class="{ active: currentIndex === index }"
        @click="handleTabClick(index)"
      >
        <view class="iconfont" :style="{ color: currentIndex === index ? tabBar.selectedColor : tabBar.color }">
          {{ currentIndex === index ? item.iconfont.selectedText : item.iconfont.text }}
        </view>
        <view class="text" :style="{ color: currentIndex === index ? tabBar.selectedColor : tabBar.color }">
          {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useAppInfoStore } from "@/stores/appInfo";

const appInfoStore = useAppInfoStore();

// tabBar 配置
const tabBar = {
  color: "#494949",
  selectedColor: "#8f60df",
  backgroundColor: "#fff",
  height: "60px",
  list: [
    {
      pagePath: "pages/Index",
      text: "首页",
      iconfont: {
        text: "\ue674",
        selectedText: "\ue674",
        fontSize: "22px",
        color: "#494949",
        selectedColor: "#8f60df"
      }
    },
    {
      pagePath: "pages/classification/Classify",
      text: "分类",
      iconfont: {
        text: "\ue622",
        selectedText: "\ue622",
        fontSize: "22px",
        color: "#494949",
        selectedColor: "#8f60df"
      }
    },
    {
      pagePath: "pages/exam/ExamIndex",
      text: "在线考试",
      iconfont: {
        text: "\ue671",
        selectedText: "\ue671",
        fontSize: "22px",
        color: "#494949",
        selectedColor: "#8f60df"
      }
    },
    {
      pagePath: "pages/commend/commendIndex",
      text: "学习统计",
      iconfont: {
        text: "\ue86f",
        selectedText: "\ue86f",
        fontSize: "22px",
        color: "#494949",
        selectedColor: "#8f60df"
      }
    },
    {
      pagePath: "pages/my/MyIndex",
      text: "我的",
      iconfont: {
        text: "\ue78b",
        selectedText: "\ue78b",
        fontSize: "22px",
        color: "#494949",
        selectedColor: "#8f60df"
      }
    }
  ]
};

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0
  }
})

// 处理点击事件
const handleTabClick = (index) => {
  uni.navigateTo({
    url: '/' + tabBar.list[index].pagePath
  });
};
</script>

<style lang="scss" scoped>
.navbar-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

  .tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 60px;

    .tab-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &.active {
        color: #8f60df;
      }

      .iconfont {
        font-size: 22px;
      }

      .text {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }
}
</style>