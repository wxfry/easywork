<template>
  <view>
    <view
      class="navbar"
      :style="{ // 自定义高宽+状态栏高度为整个标题栏高度
        height:
          appInfoStore.getInfo().navBarHeight +
          appInfoStore.getInfo().statusBar +
          'px',
          // padding=top用于防止内容遮住状态栏
        'padding-top': appInfoStore.getInfo().statusBar + 'px',
      }"
    >
<!--       以下为上方标题栏内容,分为左中右三部分-->
      <view class="left">
        <view
          class="iconfont icon-back"
          v-if="showLeft"
          @click="leftClick"
        ></view>
        <!--showLeft要下方script中自定义-->
      </view>
      <view class="content">
        <view v-if="title">{{ title }}</view>
        <slot></slot> <!-- 一个插槽-->
      </view>
      <view class="right">
        <slot name="right"></slot><!-- 一个带名字的插槽-->
      </view>
    </view>
    <view
      :style="{
        height:
          appInfoStore.getInfo().navBarHeight +
          appInfoStore.getInfo().statusBar +
          'px',
      }"
    ></view>
  </view>
</template>

<script setup>
import { useAppInfoStore } from "@/stores/appInfo";
const appInfoStore = useAppInfoStore();

const props = defineProps({
  title: {
    type: String,
  },
  showLeft: {
    type: Boolean,
    default: true, // 默认展示
  },
  leftClick: {
    type: Function,
  },
});

const leftClick = () => {
  if (props.leftClick) {
    props.leftClick();
  } else {
    uni.navigateBack();
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background: linear-gradient(to right, #9060df, #6356de);
  //background: linear-gradient(to right, #7d94bd, #2084ff);
  width: 100%;
  position: fixed;
  z-index: 100;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  .left {
    width: 20px;
  }
  .content {
    text-align: center;
    flex: 1;
  }
  .right {
    width: 20px;
  }
}
</style>
