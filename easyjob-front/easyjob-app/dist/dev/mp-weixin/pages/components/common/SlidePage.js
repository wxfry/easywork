"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_Constants = require("../../../utils/Constants.js");
const stores_appInfo = require("../../../stores/appInfo.js");
const _sfc_main = {
  __name: "SlidePage",
  emits: ["loadData"],
  setup(__props, { emit }) {
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const { screenHeight, statusBar, navBarHeight } = appInfoStore.getInfo();
    const paddingBottom = 50;
    const contentHeight = common_vendor.computed(() => {
      const show = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.show_notice_bar.key);
      let tipsHeight = 0;
      if (show === "") {
        tipsHeight = 42;
      }
      return screenHeight - statusBar - navBarHeight - 50 - tipsHeight;
    });
    const nextType = common_vendor.ref(null);
    const startX = common_vendor.ref();
    const startY = common_vendor.ref();
    const touchstart = (e) => {
      const touch = e.changedTouches[0];
      startX.value = touch.clientX;
      startY.value = touch.clientY;
    };
    const touchend = (e) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const moveX = endX - startX.value;
      const moveY = endY - startY.value;
      const absMovex = Math.abs(moveX);
      if (absMovex < 60 || absMovex == 0 || moveY > 50) {
        return;
      }
      if (moveX < 0) {
        nextType.value = 1;
      }
      if (moveX > 0) {
        nextType.value = -1;
      }
      startX.value = 0;
      startY.value = 0;
      emit("loadData", nextType.value);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(contentHeight) + "px",
        b: paddingBottom + "px",
        c: common_vendor.o(touchstart),
        d: common_vendor.o(touchend)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-03b808bc"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/SlidePage.vue"]]);
wx.createComponent(Component);
