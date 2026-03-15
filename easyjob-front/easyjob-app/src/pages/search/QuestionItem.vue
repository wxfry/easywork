<template>
  <view class="question-item" @click="showDetailHandler(data)">
    <view class="title-info">
      <text class="title">
        <rich-text :nodes="data.title"></rich-text>
        <!--        这个用rich-text是因为首页点击搜索也是该页面,且关键字变红.否则无法变红-->
      </text>
    </view>

  </view>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  data: {
    type: Object,
  },
  showDetail: { // 这里设置详情页不能继续跳转  列表展示可点击进入详情页,写详情页的时候还会用到
    type: Boolean,
    default: true,
  },
  categoryId: {
    type: String,
  },
});

const showDetailHandler = (data) => { // 点击进入详情页
  console.log("data===========", data);
  if (!props.showDetail) {
    return;
  }
  let url = `/pages/search/Questions?questionId=${
      data.questionId
  }&keyword=${
    data.keyword
  }`;
  uni.navigateTo({
    url: url,
  });
};
</script>

<style lang="scss" scoped>
.question-item {
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 5px solid #ececec;
  .title-info {
    color: #414141;
    font-size: 16px;
    font-weight: bold;
  }
  .difficulty {
    margin-top: 10px;
  }
  .question-info {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #aaaaaa;
    .user-info {
      .dot {
        display: inline-block;
        width: 3px;
        height: 3px;
        background-color: #919191;
        border-radius: 50%;
        vertical-align: middle;
        margin: 0px 5px;
      }
    }
  }
}
</style>
