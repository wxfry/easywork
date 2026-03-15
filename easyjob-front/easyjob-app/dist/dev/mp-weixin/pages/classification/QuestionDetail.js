"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_ShowTips = common_vendor.resolveComponent("ShowTips");
  const _component_SlidePage = common_vendor.resolveComponent("SlidePage");
  const _component_Footer = common_vendor.resolveComponent("Footer");
  (_component_ShowTips + _component_SlidePage + _component_Footer)();
}
if (!Math) {
  (Navbar + QuestionItem + uvParse)();
}
const uvParse = () => "../components/uv-parse/components/uv-parse/uv-parse.js";
const QuestionItem = () => "./QuestionItem.js";
const Navbar = () => "../components/common/Navbar.js";
const _sfc_main = {
  __name: "QuestionDetail",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    common_vendor.ref();
    const loadDataNext = (_nextType) => {
      nextType.value = _nextType;
      loadDetail();
    };
    const questionData = common_vendor.ref({});
    const currentId = common_vendor.ref();
    const categoryId = common_vendor.ref();
    const nextType = common_vendor.ref(null);
    const loadDetail = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getQuestionDetailNext,
        // url: proxy.Api.getTextQuestion,
        params: {
          currentId: currentId.value,
          categoryId: categoryId.value || "",
          nextType: nextType.value
        }
      });
      if (!result) {
        return;
      }
      questionData.value = result.data;
      currentId.value = result.data.questionId;
    };
    console.log("questionData", questionData);
    common_vendor.onLoad((option) => {
      currentId.value = option.questionId;
      categoryId.value = option.categoryId;
      nextType.value = null;
      loadDetail();
    });
    const updateCollect = (haveCollect) => {
      questionData.value.haveCollect = haveCollect;
    };
    const readMode = common_vendor.ref(common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.readMode.key) || "0");
    const changeMode = () => {
      const _readMode = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.readMode.key);
      if (_readMode == "" || _readMode == "0") {
        common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.readMode.key, "1");
        readMode.value = "1";
      } else {
        common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.readMode.key, "0");
        readMode.value = "0";
      }
      showAnswer.value = false;
    };
    const showAnswer = common_vendor.ref(false);
    const showAnswerHandler = () => {
      showAnswer.value = true;
    };
    const containerStyle = common_vendor.ref(
      "word-wrap:break-word;word-break:normal;word-break:break-all;"
    );
    const route = common_vendor.useRoute();
    const chapter = common_vendor.ref("");
    const categoryName = common_vendor.ref("");
    common_vendor.onMounted(() => {
      console.log("route.query", route.query);
      chapter.value = route.query.chapter;
      categoryName.value = route.query.categoryName;
      console.log("Received chapter:", chapter.value);
      console.log("Received categoryName:", categoryName.value);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(chapter.value),
        b: common_vendor.p({
          data: questionData.value,
          showDetail: false
        }),
        c: questionData.value.question
      }, questionData.value.question ? {
        d: common_vendor.p({
          content: questionData.value.question,
          ["container-style"]: containerStyle.value
        })
      } : {}, {
        e: readMode.value === "1" || readMode.value === "0" && showAnswer.value
      }, readMode.value === "1" || readMode.value === "0" && showAnswer.value ? common_vendor.e({
        f: questionData.value.answerAnalysis
      }, questionData.value.answerAnalysis ? {
        g: common_vendor.p({
          content: questionData.value.answerAnalysis,
          ["container-style"]: containerStyle.value
        })
      } : {}) : {}, {
        h: common_vendor.o(loadDataNext),
        i: common_vendor.t(readMode.value == "0" ? "背题模式" : "阅读模式"),
        j: common_vendor.o(changeMode),
        k: readMode.value === "0"
      }, readMode.value === "0" ? {
        l: common_vendor.o(showAnswerHandler)
      } : {}, {
        m: common_vendor.o(updateCollect),
        n: common_vendor.p({
          objectId: questionData.value.questionId + "",
          collectType: 1,
          haveCollect: questionData.value.haveCollect
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-29d1cba4"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/QuestionDetail.vue"]]);
wx.createPage(MiniProgramPage);
