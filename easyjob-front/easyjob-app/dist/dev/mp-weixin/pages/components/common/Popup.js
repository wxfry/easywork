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
  __name: "Popup",
  props: {
    type: {
      type: String,
      default: "bottom"
    }
  },
  setup(__props, { expose }) {
    const props = __props;
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const paddingTop = common_vendor.computed(() => {
      if (props.type == "bottom") {
        return 0;
      } else {
        const { statusBar, navBarHeight } = appInfoStore.getInfo();
        return statusBar + navBarHeight;
      }
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
      return {
        a: common_vendor.unref(paddingTop) + "px",
        b: common_vendor.sr(popupRef, "6d826013-0", {
          "k": "popupRef"
        }),
        c: common_vendor.p({
          type: __props.type,
          ["background-color"]: "#fff"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/Popup.vue"]]);
wx.createComponent(Component);
