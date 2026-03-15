"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "WebView",
  setup(__props) {
    const url = common_vendor.ref();
    common_vendor.onLoad((option) => {
      url.value = option.url;
    });
    return (_ctx, _cache) => {
      return {
        a: url.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/carousel/WebView.vue"]]);
wx.createPage(MiniProgramPage);
