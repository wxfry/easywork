<template>
  <view class="question-item" @click="showDetailHandler(data)">
    <view class="title-info">
      <text class="title">
<!--        <rich-text :nodes="data.title"></rich-text>-->
        <rich-text :nodes="data.categoryName + ' ' + data.chapter"></rich-text>
<!--        这个用rich-text是因为首页点击搜索也是该页面,且关键字变红.否则无法变红-->
      </text>
    </view>

    <view class="question-info"><!-- 这里是上传者及发布时间,格式调整过,适配不同大小的手机屏幕 -->
      <view class="user-info">
        <text class="iconfont icon-use icon-data"></text>
        <text class="dot"></text>
        <text>{{ proxy.Utils.dateformat(data.createTime) }}</text> <!-- 这里是日期格式化,只截取日期,去掉时分秒 -->
        <text>{{ data.status }}</text>
      </view>
      <view>
        <text v-if="data.status === 0">未完成</text>
        <text v-else-if="data.status === 1">已完成</text>
        <text v-else>未知状态</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
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
  status: {
    type: String,
  }
});

const showDetailHandler = (data) => { // 点击进入详情页
  console.log("点击详情页",data);
  if (!props.showDetail) {
    return;
  }
  // let url = `/pages/question/QuestionDetail?questionId=${
  //   data.questionId
  // }&categoryId=${props.categoryId || ""}`;
  // let url = `/pages/classification/TextDetail?chapter=${data.chapter}&categoryName=${data.categoryName}`
  let url = `/pages/classification/TextDetail?chapter=${data.chapter}&categoryName=${data.categoryName}&textId=${data.textId}`
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
