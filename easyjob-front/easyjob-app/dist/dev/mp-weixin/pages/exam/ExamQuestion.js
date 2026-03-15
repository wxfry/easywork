"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
const stores_appInfo = require("../../stores/appInfo.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _component_Footer = common_vendor.resolveComponent("Footer");
  const _component_Dialog = common_vendor.resolveComponent("Dialog");
  const _component_Popup = common_vendor.resolveComponent("Popup");
  (_component_Navbar + _easycom_uni_forms2 + _component_Footer + _component_Dialog + _component_Popup)();
}
const _easycom_uni_forms = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.js";
if (!Math) {
  (TimerCountUp + ExamQuestionItem + _easycom_uni_forms + ExamPostModel)();
}
const ExamQuestionItem = () => "./ExamQuestionItem.js";
const ExamPostModel = () => "./ExamPostModel.js";
const TimerCountUp = () => "../components/common/TimerCountUp.js";
const _sfc_main = {
  __name: "ExamQuestion",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const examId = common_vendor.ref();
    common_vendor.onLoad((option) => {
      examId.value = option.examId;
      getExamQuestion();
    });
    const examInfo = common_vendor.ref({});
    const startExamRef = common_vendor.ref();
    const getExamQuestion = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getExamQuestion,
        params: {
          examId: examId.value
        }
      });
      if (!result) {
        return;
      }
      const _examInfo = result.data;
      const _questionList = result.data.examQuestionList;
      let rightCount = 0;
      let examAnswerLocal = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.exam_answer.key);
      _questionList.forEach((element) => {
        if (_examInfo.status == 0) {
          element.userAnswer = void 0;
          if (examAnswerLocal !== "") {
            const examAnswer = examAnswerLocal[_examInfo.examId];
            if (examAnswer != null) {
              element.userAnswer = examAnswer[element.questionId];
            }
          }
        } else if (_examInfo.status == 1 && element.questionType == 2) {
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
      currentExamQuestion.value = _questionList[0];
      if (result.data.status == 0) {
        startExamRef.value.show();
      }
    };
    const timerCountUpRef = common_vendor.ref();
    const startExam = async () => {
      let result = await proxy.Request({
        url: proxy.Api.startExam,
        params: {
          examId: examId.value
        }
      });
      if (!result) {
        return;
      }
      startExamRef.value.close();
      timerCountUpRef.value.start();
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
    const postExamRef = common_vendor.ref();
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
        postExamRef.value.show();
      });
    };
    const postExam = async (remark) => {
      let params = {
        examId: examId.value
      };
      const appExamQuestionList = [];
      const questionList = formData.value.questionList;
      questionList.forEach((item) => {
        let userAnswer = item.userAnswer;
        if (item.questionType == 2) {
          userAnswer = userAnswer.sort().join(",");
        }
        appExamQuestionList.push({
          userAnswer,
          questionId: item.questionId
        });
      });
      params.appExamQuestionList = appExamQuestionList;
      params.remark = remark;
      let result = await proxy.Request({
        url: proxy.Api.postExam,
        params,
        dataType: "json"
      });
      if (!result) {
        return;
      }
      proxy.Message.success("考试提交成功");
      postExamRef.value.close();
      timerCountUpRef.value.stop();
      getExamQuestion();
    };
    const back = () => {
      common_vendor.index.navigateBack();
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
        a: examInfo.value.status == 0
      }, examInfo.value.status == 0 ? {
        b: common_vendor.sr(timerCountUpRef, "764fe1bd-1,764fe1bd-0", {
          "k": "timerCountUpRef"
        })
      } : {
        c: common_vendor.t(examInfo.value.useTimeMin)
      }, {
        d: common_vendor.p({
          showLeft: false
        }),
        e: common_vendor.f(formData.value.questionList, (item, index, i0) => {
          return {
            a: "764fe1bd-3-" + i0 + ",764fe1bd-2",
            b: common_vendor.o(($event) => formData.value.questionList[index].userAnswer = $event, index),
            c: common_vendor.p({
              data: item,
              index,
              showAnswer: examInfo.value.status == 1,
              showHtml: index == currentIndex.value,
              height: common_vendor.unref(pageHeight),
              modelValue: formData.value.questionList[index].userAnswer
            }),
            d: index
          };
        }),
        f: currentIndex.value,
        g: common_vendor.o(questionChange),
        h: common_vendor.unref(pageHeight) + "px",
        i: common_vendor.sr(formDataRef, "764fe1bd-2", {
          "k": "formDataRef"
        }),
        j: common_vendor.p({
          modelValue: formData.value
        }),
        k: examInfo.value.status == 0
      }, examInfo.value.status == 0 ? {
        l: common_vendor.o(submit)
      } : {
        m: common_vendor.o(back)
      }, {
        n: examInfo.value.status == 1
      }, examInfo.value.status == 1 ? {
        o: common_vendor.t(examInfo.value.rightCount),
        p: common_vendor.t(examInfo.value.wrongCount)
      } : {}, {
        q: common_vendor.t(currentIndex.value + 1),
        r: common_vendor.t(examInfo.value.totalCount),
        s: common_vendor.o(showQuestionList),
        t: common_vendor.o(updateCollectHandler),
        v: common_vendor.p({
          objectId: currentExamQuestion.value.questionId + "",
          haveCollect: currentExamQuestion.value.haveCollect,
          collectType: 2
        }),
        w: common_vendor.t(examInfo.value.examQuestionList.length),
        x: common_vendor.sr(startExamRef, "764fe1bd-5", {
          "k": "startExamRef"
        }),
        y: common_vendor.p({
          title: "开始考试",
          showCancel: false,
          okFun: startExam,
          okText: "开始答题"
        }),
        z: common_vendor.sr(postExamRef, "764fe1bd-6", {
          "k": "postExamRef"
        }),
        A: common_vendor.o(postExam),
        B: common_vendor.f(formData.value.questionList, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.n(currentIndex.value == index ? "active" : ""),
            c: common_vendor.n(item.userAnswer ? "answered" : ""),
            d: common_vendor.o(($event) => selectQuestion(index))
          };
        }),
        C: common_vendor.unref(popItemWidth) - 20 + "px",
        D: common_vendor.unref(popItemWidth) - 20 + "px",
        E: (common_vendor.unref(popItemWidth) - 20) / 2 + "px",
        F: common_vendor.unref(popItemWidth) + "px",
        G: common_vendor.unref(popItemWidth) + "px",
        H: common_vendor.sr(questionPopupRef, "764fe1bd-7", {
          "k": "questionPopupRef"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-764fe1bd"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/exam/ExamQuestion.vue"]]);
wx.createPage(MiniProgramPage);
