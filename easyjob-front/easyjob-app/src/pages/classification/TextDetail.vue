<template>
  <view>
    <Navbar>{{ chapter }}</Navbar>
    <view class="question-list">
      <uni-forms ref="formDataRef" :modelValue="formData">
        <swiper
            v-if="formData.questionList.length > 0"
            :current="currentIndex"
            class="swiper"
            @change="questionChange"
            :style="{ height: pageHeight + 'px' }"
        >
          <swiper-item
              v-for="(item, index) in formData.questionList"
              :key="index"
          >
            <TextItem
                :data="item"
                :index="index"
                :showAnswer="item.answerResult !== 0"
                v-model="formData.questionList[index].userAnswer"
                :showHtml="index == currentIndex"
                :height="pageHeight"
            ></TextItem>
          </swiper-item>
        </swiper>
      </uni-forms>
    </view>

    <Footer
        :objectId="currentExamQuestion.questionId + ''"
        :haveCollect="currentExamQuestion.haveCollect"
        :collectType="2"
        @updateCollect="updateCollectHandler"
    >
      <view class="footer">
        <view class="btn-panel">
          <view class="btn" @click="submitOrNext" v-if="examInfo.status == 0">{{ submitButtonText }}</view>
        </view>
        <template v-if="examInfo.status == 1">
          <view class="iconfont icon-ok">{{ examInfo.rightCount }}</view>
          <view class="iconfont icon-wrong">{{ examInfo.wrongCount }}</view>
        </template>
        <view class="iconfont icon-more" @click="showQuestionList"
        >{{ currentIndex + 1 }}/{{ examInfo.totalCount }}</view
        >
      </view>
    </Footer>

    <Popup ref="questionPopupRef">
      <view class="pop-question-list">
        <view
            class="question-item"
            :style="{ width: popItemWidth + 'px', height: popItemWidth + 'px' }"
            v-for="(item, index) in formData.questionList"
        >
          <view
              :class="[ 'item-inner', currentIndex == index ? 'active' : '', item.userAnswer ? 'answered' : '', ]"
              :style="{ width: popItemWidth - 20 + 'px', height: popItemWidth - 20 + 'px', 'border-radius': (popItemWidth - 20) / 2 + 'px', }"
              @click="selectQuestion(index)"
          >{{ index + 1 }}</view
          >
        </view>
      </view>
    </Popup>
  </view>
</template>

<script setup>
import TextItem from "@/pages/classification/TextItem.vue";
import {onLoad} from "@dcloudio/uni-app";
import {ref, reactive, getCurrentInstance, nextTick, onMounted, computed} from "vue";
import {useAppInfoStore} from "@/stores/appInfo";

const {proxy} = getCurrentInstance();
const appInfoStore = useAppInfoStore();

const chapter = ref('');
const categoryName = ref('');
const textId = ref('');

onLoad((option) => {
  try {
    // 使用 getCurrentPages 获取参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.$page.options || {};
    chapter.value = options.chapter;
    categoryName.value = options.categoryName;
    textId.value = options.textId;

    // 确保异步请求错误被捕获
    getExamQuestion().catch((error) => {
      console.error("Error in getExamQuestion:", error);
      proxy.Message.error("加载题目失败，请稍后再试");
    });
  } catch (error) {
    console.error("Error in onLoad:", error);
    proxy.Message.error("页面初始化失败，请检查参数");
  }
})

const examInfo = ref({});
const getExamQuestion = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getAppText,
    params: {
      chapter: chapter.value,
      categoryName: categoryName.value,
      textId: textId.value,
    },
  });
  if (!result) {
    return;
  }
  examInfo.value = result.data;
  console.log("result.data", result.data);
  formData.value.questionList = result.data.list;

  const _examInfo = result.data;
  const _questionList = result.data.textQuestionList;
  let rightCount = 0;
  _questionList.forEach((element) => {
        if (element.userAnswer == null) {
          element.userAnswer = undefined;
        }
    if (element.userAnswer != null &&element.questionType == 2) {
      element.userAnswer = element.userAnswer.split(",");
    }
    if (element.answerResult == 1) {
      rightCount++;
    }
  });

  _examInfo.totalCount = _questionList.length;
  _examInfo.rightCount = rightCount;
  _examInfo.wrongCount = _questionList.length - rightCount;
  examInfo.value = _examInfo;
  formData.value.questionList = _questionList;
  console.log("formData.value.questionList",formData.value.questionList);
  currentExamQuestion.value = _questionList[0];
};

// 计算swiper高度
const pageHeight = computed(() => {
  const { statusBar, navBarHeight, screenHeight } = appInfoStore.getInfo();
  return screenHeight - statusBar - navBarHeight - 50;
});

const currentIndex = ref(0);
// 选择题目
const currentExamQuestion = ref({});
const questionChange = (e) => {
  const { current, source } = e.detail;
  currentIndex.value = current;
  currentExamQuestion.value = formData.value.questionList[current];
};

const updateCollectHandler = (haveCollect) => {
  currentExamQuestion.value.haveCollect = haveCollect;
};

// 提交考试
const formData = ref({
  questionList: [],
});
const formDataRef = ref();

const submit = () => {
  formDataRef.value.validate(async (errors, value) => {
    if (errors) {
      //定位到没有选择的选项题目
      const questionItemList = formData.value.questionList;
      for (let i = 0; i < questionItemList.length; i++) {
        const item = questionItemList[i];
        if (item.userAnswer == undefined || item.userAnswer.length == 0) {
          currentIndex.value = i;
          break;
        }
      }
      return;
    }
    submitSingleQuestion();
    postExam('1');
  });
};

const submitButtonText = ref('提交');

const submitOrNext = () => {
  if (submitButtonText.value === '提交') {
    submitSingleQuestion();
  } else {
    nextQuestion();
  }
};

const submitSingleQuestion = async () => {
  let params = {
    textId: textId.value,
  };
  const appTextQuestionList = [];
  const currentQuestion = formData.value.questionList[currentIndex.value];
  let userAnswer = currentQuestion.userAnswer;
  if (currentQuestion.questionType == 2) {
    userAnswer = userAnswer.sort().join(",");
  }
  appTextQuestionList.push({
    userAnswer: userAnswer,
    questionId: currentQuestion.questionId,
    chapter: chapter.value,
    categoryName: categoryName.value,
  });
  params.appTextQuestionList = appTextQuestionList;
  let result = await proxy.Request({
    url: proxy.Api.postTextQuestion,
    params: params,
    dataType: "json",
  });
  if (!result) {
    return;
  }
  proxy.Message.success("题目提交成功");
  currentQuestion.answerResult = result.data.answerResult;
  // 更新题目状态以显示答案和解析
  currentQuestion.showAnswer = currentQuestion.answerResult !== 0;
  submitButtonText.value = '下一题';
  // getExamQuestion();
  // 获取当前题目信息
  getTextQuestion(currentQuestion.questionId);
};


const textQuestion = ref({});
const getTextQuestion = async (questionId) => {
  let result = await proxy.Request({
    url: proxy.Api.getAppTextQuestion,
    params: {
      textId: textId.value,
      questionId: questionId,
    },
  });
  if (!result) {
    return;
  }
  textQuestion.value = result.data;
  console.log("textQuestion.value", textQuestion.value);
};

const postExam = async (remark) => {
  let params = {
    textId: textId.value,
  };
  const appTextQuestionList = [];
  const questionList = formData.value.questionList;
  questionList.forEach((item) => {
    let userAnswer = item.userAnswer;
    if (item.questionType == 2) {
      userAnswer = userAnswer.sort().join(",");
    }
    appTextQuestionList.push({
      userAnswer: userAnswer,
      questionId: item.questionId,
      chapter: chapter.value,
      categoryName: categoryName.value,
    });
  });

  params.appTextQuestionList = appTextQuestionList;
  params.remark = remark;
  let result = await proxy.Request({
    url: proxy.Api.postText,
    params: params,
    dataType: "json",
  });
  if (!result) {
    return;
  }
  proxy.Message.success("练习提交成功");
  //获取问题
  getExamQuestion();
};

const nextQuestion = () => {
  if (currentIndex.value == formData.value.questionList.length - 2) {
    currentIndex.value++;
    currentExamQuestion.value = formData.value.questionList[currentIndex.value];
    submitButtonText.value = '提交练习';
  } else if (currentIndex.value < formData.value.questionList.length - 1) {
    currentIndex.value++;
    currentExamQuestion.value = formData.value.questionList[currentIndex.value];
    submitButtonText.value = '提交';
  } else {
    submit();
    submitButtonText.value = '提交';
  }
};

const questionPopupRef = ref();
const showQuestionList = () => {
  questionPopupRef.value.show();
};

const popItemWidth = computed(() => {
  const { screenWidth } = appInfoStore.getInfo();
  return screenWidth / 6;
});

const selectQuestion = (index) => {
  currentIndex.value = index;
  questionPopupRef.value.close();
};
</script>

<style lang="scss" scoped>
.question-total {
  text-align: center;

  .count {
    color: #7500fb;
    font-weight: bolder;
    font-size: 30px;
  }
}

.footer {
  display: flex;
  align-items: center;

  .btn-panel {
    flex: 1;
    color: #fff;
    background: #8f60df;
    text-align: center;
    border-radius: 5px;
    line-height: 40px;
    width: 120px;
    margin: 0px 10px;
  }

  .iconfont {
    color: #848484;

    &::before {
      margin-right: 3px;
      font-size: 20px;
    }
  }

  .icon-collect {
    width: 20px;
  }

  .collected {
    color: #fb2e2e;
  }

  .icon-ok {
    color: #07b107;
    width: 50px;
  }

  .icon-wrong {
    color: #fb2e2e;
    width: 50px;
  }

  .icon-more {
    color: #8f60df;
    width: 70px;
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
</style>