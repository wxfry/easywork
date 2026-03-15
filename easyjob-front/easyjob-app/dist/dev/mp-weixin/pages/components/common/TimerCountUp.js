"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "TimerCountUp",
  setup(__props, { expose }) {
    const totalSeconds = common_vendor.ref(0);
    const seconds = common_vendor.computed(() => {
      return totalSeconds.value % 60;
    });
    const min = common_vendor.computed(() => {
      return parseInt(totalSeconds.value / 60);
    });
    const hour = common_vendor.computed(() => {
      return parseInt(totalSeconds.value / 3600);
    });
    const format = (num) => {
      return num < 10 ? "0" + num : num;
    };
    const timer = common_vendor.ref();
    const start = () => {
      timer.value = setInterval(() => {
        totalSeconds.value++;
      }, 1e3);
    };
    const stop = () => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    };
    expose({
      start,
      stop
    });
    common_vendor.onUnmounted(() => {
      stop();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(format(common_vendor.unref(hour))),
        b: common_vendor.t(format(common_vendor.unref(min))),
        c: common_vendor.t(format(common_vendor.unref(seconds)))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-011d76ed"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/TimerCountUp.vue"]]);
wx.createComponent(Component);
