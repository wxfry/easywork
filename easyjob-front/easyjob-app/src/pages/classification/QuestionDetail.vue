<template>
  <view>
    <Navbar>{{ chapter }}</Navbar>
    <ShowTips></ShowTips>
    <SlidePage @loadData="loadDataNext">
      <view class="question-detail">
        <view class="title-info">
          <QuestionItem :data="questionData" :showDetail="false"></QuestionItem>
        </view>

        <view class="question" v-if="questionData.question">
          <view class="question-title">问题描述</view>
          <uvParse
            class="rich-text"
            :content="questionData.question"
            :container-style="containerStyle"
          ></uvParse>

        </view>
        <view class="line"></view>
        <view
          class="question-content"
          v-if="readMode === '1' || (readMode === '0' && showAnswer)"
        >
          <view class="title">-<text class="inner">问题解析</text>-</view>
          <uvParse
            class="rich-text"
            :content="questionData.answerAnalysis"
            v-if="questionData.answerAnalysis"
            :container-style="containerStyle"
          ></uvParse>
        </view>
      </view>
    </SlidePage>


    <Footer
      :objectId="questionData.questionId + ''"
      :collectType="1"
      @updateCollect="updateCollect"
      :haveCollect="questionData.haveCollect"
    >
      <view class="page-op">
        <view class="btn btn-mode" @click="changeMode">
          <text>{{ readMode == "0" ? "背题模式" : "阅读模式" }}</text>
          <text class="iconfont icon-exchange"></text>
        </view>
        <view
          class="btn show-answer"
          v-if="readMode === '0'"
          @click="showAnswerHandler"
          >查看答案</view
        >
      </view>

    </Footer>
  </view>
</template>

<script setup>
import uvParse from "@/pages/components/uv-parse/components/uv-parse/uv-parse.vue";
import QuestionItem from "@/pages/classification/QuestionItem.vue";
import { LOCAL_STORAGE_KEY } from "@/utils/Constants.js";

import { onLoad } from "@dcloudio/uni-app";
import {ref, reactive, getCurrentInstance, nextTick, onMounted, computed} from "vue";
import Navbar from "../components/common/Navbar.vue";
const { proxy } = getCurrentInstance();

const questionPopupRef = ref();
const showQuestionList = () => {
  questionPopupRef.value.show();
};

const selectQuestion = (index) => {
  currentIndex.value = index;
  questionPopupRef.value.close();
};

const loadDataNext = (_nextType) => {
  nextType.value = _nextType;
  loadDetail();
};

const questionData = ref({});
const currentId = ref();
const categoryId = ref();
const nextType = ref(null);

const loadDetail = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getQuestionDetailNext,
    // url: proxy.Api.getTextQuestion,
    params: {
      currentId: currentId.value,
      categoryId: categoryId.value || "",
      nextType: nextType.value,
    },
  });
  if (!result) {
    return;
  }
  questionData.value = result.data;
  currentId.value = result.data.questionId;
};
console.log("questionData", questionData);


onLoad((option) => {
  currentId.value = option.questionId;
  categoryId.value = option.categoryId;
  nextType.value = null;
  loadDetail();
});

const updateCollect = (haveCollect) => {
  questionData.value.haveCollect = haveCollect;
};

const readMode = ref(uni.getStorageSync(LOCAL_STORAGE_KEY.readMode.key) || "0"); //1 背题模式，展示答案  0:阅读模式，手动展示答案
const changeMode = () => {
  const _readMode = uni.getStorageSync(LOCAL_STORAGE_KEY.readMode.key);
  if (_readMode == "" || _readMode == "0") {
    uni.setStorageSync(LOCAL_STORAGE_KEY.readMode.key, "1");
    readMode.value = "1";
  } else {
    uni.setStorageSync(LOCAL_STORAGE_KEY.readMode.key, "0");
    readMode.value = "0";
  }
  showAnswer.value = false;
};

const showAnswer = ref(false);
const showAnswerHandler = () => {
  showAnswer.value = true;
};

const containerStyle = ref(
  "word-wrap:break-word;word-break:normal;word-break:break-all;"
);

import { useRoute } from 'vue-router';
const route = useRoute();
const chapter = ref('');
const categoryName = ref('');
onMounted(() => {
  console.log("route.query", route.query);
  chapter.value = route.query.chapter;
  categoryName.value = route.query.categoryName;
  console.log('Received chapter:', chapter.value);
  console.log('Received categoryName:', categoryName.value);
});



</script>

<style lang="scss" scoped>
//该代码设置类名为 .rich-text 的元素及其所有子元素的文本保留空白符和换行符，确保内容按原始格式显示。
//.rich-text {
//  :deep * {
//    white-space: pre-wrap !important;
//  }
//}

.question-detail {
  .question {
    padding: 10px;
    .question-title {
      font-weight: bold;
      font-size: 13px;
      line-height: 30px;
      color: #797878;
    }
    .detail {
      margin-top: 10px;
    }
  }
  .question-content {
    padding: 10px;
    font-size: 16px;
    .title {
      text-align: center;
      color: #767575;
      margin: 5px 0px 10px;
      .inner {
        font-weight: bolder;
        color: #1f282e;
      }
    }
  }
}

.page-op {
  display: flex;
  flex: 1;
  justify-content: space-around;
  font-size: 14px;
  .btn {
    width: 100%;
    margin: 0px 5px;
    padding: 8px 0px;
    color: #fff;
    border-radius: 5px;
    text-align: center;
  }
  .btn-mode {
    background: #6663cd;
    .iconfont {
      color: #fff;
      font-size: 14px;
      margin-left: 2px;
    }
  }
  .show-answer {
    background: #aa6bd9;
  }
}

.pop-question-list {
  max-height: calc(100vh - 200px);
  display: flex;
  flex-wrap: wrap;
  .question-item {
    padding: 10px;
    .item-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ddd;
    }
    .active {
      color: #fff;
      background: #2caff6;
    }
    .answered {
      border: 1px solid #2caff6;
    }
  }
}

.iconfont {
  color: #848484;
  &::before {
    margin-right: 3px;
    font-size: 20px;
  }
}
.icon-more {
  display: flex;
  align-items: center;
  color: #8f60df;
  width: 70px;
}
</style>
