"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  QuestionList();
}
const QuestionList = () => "./QuestionList2.js";
const _sfc_main = {
  __name: "QuestionIndex",
  setup(__props) {
    common_vendor.onReachBottom(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: false
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/question/QuestionIndex.vue"]]);
wx.createPage(MiniProgramPage);
