<template>
  <view>
    <Navbar title="推荐练习"></Navbar>

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
        :objectId="currentCommendQuestion.questionId + ''"
        :haveCollect="currentCommendQuestion.haveCollect"
        :collectType="2"
        @updateCollect="updateCollectHandler"
    >
      <view class="footer">
        <view class="btn-panel">
          <view class="btn" @click="submitOrNext" v-if="currentCommendQuestion.status == 0">{{ submitButtonText }}</view>
        </view>
        <view class="iconfont icon-more" @click="showQuestionList"
        >{{ currentIndex + 1 }}/{{ commendPractice.totalCount }}</view
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
import {ref, onMounted, nextTick, getCurrentInstance, reactive, toRaw, computed} from 'vue';
import TextItem from "@/pages/classification/TextItem.vue";
import {onLoad} from "@dcloudio/uni-app";
import {useAppInfoStore} from "@/stores/appInfo";

const { proxy } = getCurrentInstance();
const appInfoStore = useAppInfoStore();

onLoad(() => {
  getCommend();
})

const formData = ref({
  questionList: [],
});
const commendPractice = ref({});
const getCommend = async () => {
  console.log('getCommend');
  let result = await proxy.Request({
    // url: proxy.Api.commendPractice,
    url: proxy.Api.calculateTopNUserSimilarity,
  });
  if (!result) {
    return;
  }
  commendPractice.value = result.data;
  console.log('commendPractice.value', commendPractice.value);
  formData.value.questionList = result.data.list;
  console.log('formData.value.questionList', formData.value.questionList)

  const _commendPractice = result.data;
  console.log('_commendPractice', _commendPractice);
  const _questionList = result.data.commendQuestionList;
  let rightCount = 0;
  _questionList.forEach((element) => {
    console.log('element', element);
    if (element.userAnswer == null) {
      element.userAnswer = undefined;
    }
    if (element.userAnswer != null &&element.questionType == 2) {
      element.userAnswer = element.userAnswer.split(",");
    }
    element.answerResult = 0;
    if (element.answerResult == 1) {
      rightCount++;
    }
  });
  _commendPractice.totalCount = _questionList.length;
  _commendPractice.rightCount = rightCount;
  _commendPractice.wrongCount = _questionList.length - rightCount;
  commendPractice.value = _commendPractice;
  formData.value.questionList = _questionList;
  currentCommendQuestion.value = _questionList[0];
}

// 计算swiper的高度
const pageHeight = computed(() => {
  const { statusBar, navBarHeight, screenHeight } = appInfoStore.getInfo();
  return screenHeight - statusBar - navBarHeight - 50;
});

const currentIndex = ref(0);
// 选择题目
const currentCommendQuestion = ref({});
const questionChange = (e) => {
  const { current, source } = e.detail;
  currentIndex.value = current;
  currentCommendQuestion.value = formData.value.questionList[current];
  console.log('currentCommendQuestion.value===============', currentCommendQuestion.value);
};
// 收藏
const updateCollectHandler = (haveCollect) => {
  currentCommendQuestion.value.haveCollect = haveCollect;
};

// 提交练习
const formDataRef = ref();

const submit = () => {
  formDataRef.value.validate(async ( errors, values ) => {
    if (errors) {
      //  定位到没有选择的题目
      const questionItemList = formData.value.questionList;
      for (let i = 0; i < questionItemList.length; i++) {
        if (item.userAnswer == undefined || item.userAnswer.length == 0) {
          currentIndex.value = i;
          break;
        }
      }
      return;
    }
    postPractice();
  })
};

const submitButtonText = ref('提交');

const submitOrNext = () => {
  if (submitButtonText.value === '提交') {
    submitSingleQuestion();
    // postQuestionRef.value.show();
  } else {
    nextQuestion();
  }
};

const submitSingleQuestion = async () => {
  let params = {

  };
  const commentQuestionList = [];
  const currentQuestion = formData.value.questionList[currentIndex.value];
  let userAnswer = currentQuestion.userAnswer;
  if (currentQuestion.questionType == 2) {
    userAnswer = userAnswer.sort().join(",");
  }
  commentQuestionList.push({
    userAnswer: userAnswer,
    questionId: currentQuestion.questionId,
  });
  params.commentQuestionList = commentQuestionList;
  let result = await proxy.Request({
    url: proxy.Api.postCommendQuestion,
    params: params,
    dataType: "json",
  });
  if (!result) {
    result;
  }
  proxy.Message.success("提交成功");
  currentQuestion.answerResult = result.data.answerResult;
  currentQuestion.showAnswer = currentQuestion.answerResult !== 0;
  submitButtonText.value = '下一题';
  getCommendQuestion(currentQuestion.questionId);
};

const commentPractice = ref({});
const getCommendQuestion = async (questionId) => {
  let result = await proxy.Request({
    url: proxy.Api.getCommendPractice,
    params: {
      questionId: questionId,
    },
  });
  if (!result) {
    result;
  }
  commentPractice.value = result.data;
  console.log('commentPractice.value', commentPractice.value);
};

const postExam = async () => {
  let params = {

  };
  const commentQuestionList = [];
  const questionList = formData.value.questionList;
  questionList.forEach((item) => {
    let userAnswer = item.userAnswer;
    if (item.questionType == 2) {
      userAnswer = userAnswer.sort().join(",");
    }
    commentQuestionList.push({
      userAnswer: userAnswer,
      questionId: item.questionId,
    });
  });

  params.commentQuestionList = commentQuestionList;
  let result = await proxy.Request({
    url: proxy.Api.postCommend,
    params: params,
    dataType: "json",
  });
  if (!result) {
    result;
  }
  proxy.Message.success("推荐练习提交成功");
  // 获取问题
  getCommend();
}

const nextQuestion = () => {
  if (currentIndex.value == formData.value.questionList.length - 2) {
    currentIndex.value++;
    currentCommendQuestion.value = formData.value.questionList[currentIndex.value];
    submitButtonText.value = '提交练习';
  } else if (currentIndex.value < formData.value.questionList.length - 1) {
    currentIndex.value++;
    currentCommendQuestion.value = formData.value.questionList[currentIndex.value];
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