"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  _component_Navbar();
}
if (!Math) {
  ExamQuestionItem();
}
const ExamQuestionItem = () => "../exam/ExamQuestionItem.js";
const _sfc_main = {
  __name: "ExamQuestion",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const questionId = common_vendor.ref(null);
    const examQuestion = common_vendor.ref({ questionItemList: [] });
    const getExamQuestion = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getExamQuestionById,
        params: {
          questionId: questionId.value
        }
      });
      if (!result) {
        return;
      }
      examQuestion.value = result.data;
    };
    common_vendor.onLoad((option) => {
      questionId.value = option.questionId;
      getExamQuestion();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: true,
          title: "推荐问题"
        }),
        b: common_vendor.p({
          showAnswer: true,
          data: examQuestion.value,
          showHtml: true
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6d1ad68c"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/carousel/ExamQuestion.vue"]]);
wx.createPage(MiniProgramPage);
