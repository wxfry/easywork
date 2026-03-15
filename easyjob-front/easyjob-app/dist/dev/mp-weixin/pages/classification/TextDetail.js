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
const TextItem = () => "./TextItem.js";
const _sfc_main = {
  __name: "TextDetail",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const chapter = common_vendor.ref("");
    const categoryName = common_vendor.ref("");
    const textId = common_vendor.ref("");
    common_vendor.onLoad((option) => {
      try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.$page.options || {};
        chapter.value = options.chapter;
        categoryName.value = options.categoryName;
        textId.value = options.textId;
        getExamQuestion().catch((error) => {
          console.error("Error in getExamQuestion:", error);
          proxy.Message.error("加载题目失败，请稍后再试");
        });
      } catch (error) {
        console.error("Error in onLoad:", error);
        proxy.Message.error("页面初始化失败，请检查参数");
      }
    });
    const examInfo = common_vendor.ref({});
    const getExamQuestion = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getAppText,
        params: {
          chapter: chapter.value,
          categoryName: categoryName.value,
          textId: textId.value
        }
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
          element.userAnswer = void 0;
        }
        if (element.userAnswer != null && element.questionType == 2) {
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
      console.log("formData.value.questionList", formData.value.questionList);
      currentExamQuestion.value = _questionList[0];
    };
    const pageHeight = common_vendor.computed(() => {
      const { statusBar, navBarHeight, screenHeight } = appInfoStore.getInfo();
      return screenHeight - statusBar - navBarHeight - 50;
    });
    const currentIndex = common_vendor.ref(0);
    const currentExamQuestion = common_vendor.ref({});
    const questionChange = (e) => {
      const { current, source } = e.detail;
      currentIndex.value = current;
      currentExamQuestion.value = formData.value.questionList[current];
    };
    const updateCollectHandler = (haveCollect) => {
      currentExamQuestion.value.haveCollect = haveCollect;
    };
    const formData = common_vendor.ref({
      questionList: []
    });
    const formDataRef = common_vendor.ref();
    const submit = () => {
      formDataRef.value.validate(async (errors, value) => {
        if (errors) {
          const questionItemList = formData.value.questionList;
          for (let i = 0; i < questionItemList.length; i++) {
            const item = questionItemList[i];
            if (item.userAnswer == void 0 || item.userAnswer.length == 0) {
              currentIndex.value = i;
              break;
            }
          }
          return;
        }
        postExam("1");
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
      let params = {
        textId: textId.value
      };
      const appTextQuestionList = [];
      const currentQuestion = formData.value.questionList[currentIndex.value];
      let userAnswer = currentQuestion.userAnswer;
      if (currentQuestion.questionType == 2) {
        userAnswer = userAnswer.sort().join(",");
      }
      appTextQuestionList.push({
        userAnswer,
        questionId: currentQuestion.questionId
      });
      params.appTextQuestionList = appTextQuestionList;
      let result = await proxy.Request({
        url: proxy.Api.postTextQuestion,
        params,
        dataType: "json"
      });
      if (!result) {
        return;
      }
      proxy.Message.success("题目提交成功");
      currentQuestion.answerResult = result.data.answerResult;
      currentQuestion.showAnswer = currentQuestion.answerResult !== 0;
      submitButtonText.value = "下一题";
      getTextQuestion(currentQuestion.questionId);
    };
    const textQuestion = common_vendor.ref({});
    const getTextQuestion = async (questionId) => {
      let result = await proxy.Request({
        url: proxy.Api.getAppTextQuestion,
        params: {
          textId: textId.value,
          questionId
        }
      });
      if (!result) {
        return;
      }
      textQuestion.value = result.data;
      console.log("textQuestion.value", textQuestion.value);
    };
    const postExam = async (remark) => {
      let params = {
        textId: textId.value
      };
      const appTextQuestionList = [];
      const questionList = formData.value.questionList;
      questionList.forEach((item) => {
        let userAnswer = item.userAnswer;
        if (item.questionType == 2) {
          userAnswer = userAnswer.sort().join(",");
        }
        appTextQuestionList.push({
          userAnswer,
          questionId: item.questionId
        });
      });
      params.appTextQuestionList = appTextQuestionList;
      params.remark = remark;
      let result = await proxy.Request({
        url: proxy.Api.postText,
        params,
        dataType: "json"
      });
      if (!result) {
        return;
      }
      proxy.Message.success("练习提交成功");
      getExamQuestion();
    };
    const nextQuestion = () => {
      if (currentIndex.value == formData.value.questionList.length - 2) {
        currentIndex.value++;
        currentExamQuestion.value = formData.value.questionList[currentIndex.value];
        submitButtonText.value = "提交练习";
      } else if (currentIndex.value < formData.value.questionList.length - 1) {
        currentIndex.value++;
        currentExamQuestion.value = formData.value.questionList[currentIndex.value];
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
        a: common_vendor.t(chapter.value),
        b: formData.value.questionList.length > 0
      }, formData.value.questionList.length > 0 ? {
        c: common_vendor.f(formData.value.questionList, (item, index, i0) => {
          return {
            a: "4e5139a7-2-" + i0 + ",4e5139a7-1",
            b: common_vendor.o(($event) => formData.value.questionList[index].userAnswer = $event, index),
            c: common_vendor.p({
              data: item,
              index,
              showAnswer: item.answerResult !== 0,
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
        g: common_vendor.sr(formDataRef, "4e5139a7-1", {
          "k": "formDataRef"
        }),
        h: common_vendor.p({
          modelValue: formData.value
        }),
        i: examInfo.value.status == 0
      }, examInfo.value.status == 0 ? {
        j: common_vendor.t(submitButtonText.value),
        k: common_vendor.o(submitOrNext)
      } : {}, {
        l: examInfo.value.status == 1
      }, examInfo.value.status == 1 ? {
        m: common_vendor.t(examInfo.value.rightCount),
        n: common_vendor.t(examInfo.value.wrongCount)
      } : {}, {
        o: common_vendor.t(currentIndex.value + 1),
        p: common_vendor.t(examInfo.value.totalCount),
        q: common_vendor.o(showQuestionList),
        r: common_vendor.o(updateCollectHandler),
        s: common_vendor.p({
          objectId: currentExamQuestion.value.questionId + "",
          haveCollect: currentExamQuestion.value.haveCollect,
          collectType: 2
        }),
        t: common_vendor.f(formData.value.questionList, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.n(currentIndex.value == index ? "active" : ""),
            c: common_vendor.n(item.userAnswer ? "answered" : ""),
            d: common_vendor.o(($event) => selectQuestion(index))
          };
        }),
        v: common_vendor.unref(popItemWidth) - 20 + "px",
        w: common_vendor.unref(popItemWidth) - 20 + "px",
        x: (common_vendor.unref(popItemWidth) - 20) / 2 + "px",
        y: common_vendor.unref(popItemWidth) + "px",
        z: common_vendor.unref(popItemWidth) + "px",
        A: common_vendor.sr(questionPopupRef, "4e5139a7-4", {
          "k": "questionPopupRef"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4e5139a7"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/TextDetail.vue"]]);
wx.createPage(MiniProgramPage);
