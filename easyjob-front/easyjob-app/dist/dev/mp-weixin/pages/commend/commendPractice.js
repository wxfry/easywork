"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_appInfo = require("../../stores/appInfo.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _component_Footer = common_vendor.resolveComponent("Footer");
  const _component_Popup = common_vendor.resolveComponent("Popup");
  (_component_Navbar + _easycom_uni_forms2 + _component_Footer + _component_Popup)();
}
const _easycom_uni_forms = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.js";
if (!Math) {
  (TextItem + _easycom_uni_forms)();
}
const TextItem = () => "../classification/TextItem.js";
const _sfc_main = {
  __name: "commendPractice",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    common_vendor.onLoad(() => {
      getCommend();
    });
    const formData = common_vendor.ref({
      questionList: []
    });
    const commendPractice = common_vendor.ref({});
    const getCommend = async () => {
      console.log("getCommend");
      let result = await proxy.Request({
        // url: proxy.Api.commendPractice,
        url: proxy.Api.calculateTopNUserSimilarity
      });
      if (!result) {
        return;
      }
      commendPractice.value = result.data;
      console.log("commendPractice.value", commendPractice.value);
      formData.value.questionList = result.data.list;
      console.log("formData.value.questionList", formData.value.questionList);
      const _commendPractice = result.data;
      console.log("_commendPractice", _commendPractice);
      const _questionList = result.data.commendQuestionList;
      let rightCount = 0;
      _questionList.forEach((element) => {
        console.log("element", element);
        if (element.userAnswer == null) {
          element.userAnswer = void 0;
        }
        if (element.userAnswer != null && element.questionType == 2) {
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
    };
    const pageHeight = common_vendor.computed(() => {
      const { statusBar, navBarHeight, screenHeight } = appInfoStore.getInfo();
      return screenHeight - statusBar - navBarHeight - 50;
    });
    const currentIndex = common_vendor.ref(0);
    const currentCommendQuestion = common_vendor.ref({});
    const questionChange = (e) => {
      const { current, source } = e.detail;
      currentIndex.value = current;
      currentCommendQuestion.value = formData.value.questionList[current];
      console.log("currentCommendQuestion.value===============", currentCommendQuestion.value);
    };
    const updateCollectHandler = (haveCollect) => {
      currentCommendQuestion.value.haveCollect = haveCollect;
    };
    const formDataRef = common_vendor.ref();
    const submit = () => {
      formDataRef.value.validate(async (errors, values) => {
        if (errors) {
          const questionItemList = formData.value.questionList;
          for (let i = 0; i < questionItemList.length; i++) {
            if (item.userAnswer == void 0 || item.userAnswer.length == 0) {
              currentIndex.value = i;
              break;
            }
          }
          return;
        }
        postPractice();
      });
    };
    const submitButtonText = common_vendor.ref("提交");
    const submitOrNext = () => {
      if (submitButtonText.value === "提交") {
        submitSingleQuestion();
      } else {
        nextQuestion();
      }
    };
    const submitSingleQuestion = async () => {
      let params = {};
      const commentQuestionList = [];
      const currentQuestion = formData.value.questionList[currentIndex.value];
      let userAnswer = currentQuestion.userAnswer;
      if (currentQuestion.questionType == 2) {
        userAnswer = userAnswer.sort().join(",");
      }
      commentQuestionList.push({
        userAnswer,
        questionId: currentQuestion.questionId
      });
      params.commentQuestionList = commentQuestionList;
      let result = await proxy.Request({
        url: proxy.Api.postCommendQuestion,
        params,
        dataType: "json"
      });
      proxy.Message.success("提交成功");
      currentQuestion.answerResult = result.data.answerResult;
      currentQuestion.showAnswer = currentQuestion.answerResult !== 0;
      submitButtonText.value = "下一题";
      getCommendQuestion(currentQuestion.questionId);
    };
    const commentPractice = common_vendor.ref({});
    const getCommendQuestion = async (questionId) => {
      let result = await proxy.Request({
        url: proxy.Api.getCommendPractice,
        params: {
          questionId
        }
      });
      commentPractice.value = result.data;
      console.log("commentPractice.value", commentPractice.value);
    };
    const nextQuestion = () => {
      if (currentIndex.value == formData.value.questionList.length - 2) {
        currentIndex.value++;
        currentCommendQuestion.value = formData.value.questionList[currentIndex.value];
        submitButtonText.value = "提交练习";
      } else if (currentIndex.value < formData.value.questionList.length - 1) {
        currentIndex.value++;
        currentCommendQuestion.value = formData.value.questionList[currentIndex.value];
        submitButtonText.value = "提交";
      } else {
        submit();
        submitButtonText.value = "提交";
      }
    };
    const questionPopupRef = common_vendor.ref();
    const showQuestionList = () => {
      questionPopupRef.value.show();
    };
    const popItemWidth = common_vendor.computed(() => {
      const { screenWidth } = appInfoStore.getInfo();
      return screenWidth / 6;
    });
    const selectQuestion = (index) => {
      currentIndex.value = index;
      questionPopupRef.value.close();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "推荐练习"
        }),
        b: formData.value.questionList.length > 0
      }, formData.value.questionList.length > 0 ? {
        c: common_vendor.f(formData.value.questionList, (item2, index, i0) => {
          return {
            a: "17b7597c-2-" + i0 + ",17b7597c-1",
            b: common_vendor.o(($event) => formData.value.questionList[index].userAnswer = $event, index),
            c: common_vendor.p({
              data: item2,
              index,
              showAnswer: item2.answerResult !== 0,
              showHtml: index == currentIndex.value,
              height: common_vendor.unref(pageHeight),
              modelValue: formData.value.questionList[index].userAnswer
            }),
            d: index
          };
        }),
        d: currentIndex.value,
        e: common_vendor.o(questionChange),
        f: common_vendor.unref(pageHeight) + "px"
      } : {}, {
        g: common_vendor.sr(formDataRef, "17b7597c-1", {
          "k": "formDataRef"
        }),
        h: common_vendor.p({
          modelValue: formData.value
        }),
        i: currentCommendQuestion.value.status == 0
      }, currentCommendQuestion.value.status == 0 ? {
        j: common_vendor.t(submitButtonText.value),
        k: common_vendor.o(submitOrNext)
      } : {}, {
        l: common_vendor.t(currentIndex.value + 1),
        m: common_vendor.t(commendPractice.value.totalCount),
        n: common_vendor.o(showQuestionList),
        o: common_vendor.o(updateCollectHandler),
        p: common_vendor.p({
          objectId: currentCommendQuestion.value.questionId + "",
          haveCollect: currentCommendQuestion.value.haveCollect,
          collectType: 2
        }),
        q: common_vendor.f(formData.value.questionList, (item2, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.n(currentIndex.value == index ? "active" : ""),
            c: common_vendor.n(item2.userAnswer ? "answered" : ""),
            d: common_vendor.o(($event) => selectQuestion(index))
          };
        }),
        r: common_vendor.unref(popItemWidth) - 20 + "px",
        s: common_vendor.unref(popItemWidth) - 20 + "px",
        t: (common_vendor.unref(popItemWidth) - 20) / 2 + "px",
        v: common_vendor.unref(popItemWidth) + "px",
        w: common_vendor.unref(popItemWidth) + "px",
        x: common_vendor.sr(questionPopupRef, "17b7597c-4", {
          "k": "questionPopupRef"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-17b7597c"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/commend/commendPractice.vue"]]);
wx.createPage(MiniProgramPage);
