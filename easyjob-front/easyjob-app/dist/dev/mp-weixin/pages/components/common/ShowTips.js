"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_Constants = require("../../../utils/Constants.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  _easycom_uni_notice_bar2();
}
const _easycom_uni_notice_bar = () => "../../../node-modules/@dcloudio/uni-ui/lib/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  _easycom_uni_notice_bar();
}
const _sfc_main = {
  __name: "ShowTips",
  setup(__props) {
    const showNotice = common_vendor.computed(() => {
      const show = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.show_notice_bar.key);
      return show === "" ? true : show;
    });
    const closeNotice = () => {
      common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.show_notice_bar.key, false);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(showNotice)
      }, common_vendor.unref(showNotice) ? {
        b: common_vendor.o(closeNotice),
        c: common_vendor.p({
          ["show-icon"]: true,
          text: "左右滑动可以切换上、下一页",
          showClose: true
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-600c49d0"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/ShowTips.vue"]]);
wx.createComponent(Component);
