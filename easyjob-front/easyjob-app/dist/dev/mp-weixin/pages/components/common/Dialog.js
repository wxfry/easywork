"use strict";
const common_vendor = require("../../../common/vendor.js");
const stores_appInfo = require("../../../stores/appInfo.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "Dialog",
  props: {
    styleBg: {
      type: String
    },
    styleBorder: {
      type: String
    },
    title: {
      type: String
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    cancelFun: {
      type: Function
    },
    okText: {
      type: String,
      default: "确定"
    },
    okFun: {
      type: Function
    }
  },
  setup(__props, { expose }) {
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const screen = common_vendor.computed(() => {
      const { screenWidth, screenHeight } = appInfoStore.getInfo();
      return {
        screenWidth,
        screenHeight: screenHeight * 0.8
      };
    });
    const popupRef = common_vendor.ref();
    const show = () => {
      popupRef.value.open();
    };
    const close = () => {
      popupRef.value.close();
    };
    expose({
      show,
      close
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.title
      }, __props.title ? {
        b: common_vendor.t(__props.title)
      } : {}, {
        c: common_vendor.unref(screen).screenHeight + "px",
        d: __props.showCancel || __props.okFun
      }, __props.showCancel || __props.okFun ? common_vendor.e({
        e: __props.showCancel
      }, __props.showCancel ? {
        f: common_vendor.t(__props.cancelText),
        g: common_vendor.o(close)
      } : {}, {
        h: common_vendor.t(__props.okText),
        i: common_vendor.o((...args) => __props.okFun && __props.okFun(...args))
      }) : {}, {
        j: common_vendor.unref(screen).screenWidth * 0.85 + "px",
        k: __props.styleBg ? __props.styleBg : "",
        l: __props.styleBorder ? __props.styleBorder : "",
        m: common_vendor.sr(popupRef, "9ca4aa40-0", {
          "k": "popupRef"
        }),
        n: common_vendor.p({
          ["is-mask-click"]: false,
          type: "center"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9ca4aa40"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/Dialog.vue"]]);
wx.createComponent(Component);
