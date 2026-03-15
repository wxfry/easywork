"use strict";
const common_vendor = require("../../../common/vendor.js");
const stores_appInfo = require("../../../stores/appInfo.js");
const _sfc_main = {
  __name: "Navbar",
  props: {
    title: {
      type: String
    },
    showLeft: {
      type: Boolean,
      default: true
      // 默认展示
    },
    leftClick: {
      type: Function
    }
  },
  setup(__props) {
    const props = __props;
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const leftClick = () => {
      if (props.leftClick) {
        props.leftClick();
      } else {
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.showLeft
      }, __props.showLeft ? {
        b: common_vendor.o(leftClick)
      } : {}, {
        c: __props.title
      }, __props.title ? {
        d: common_vendor.t(__props.title)
      } : {}, {
        e: common_vendor.unref(appInfoStore).getInfo().navBarHeight + common_vendor.unref(appInfoStore).getInfo().statusBar + "px",
        f: common_vendor.unref(appInfoStore).getInfo().statusBar + "px",
        g: common_vendor.unref(appInfoStore).getInfo().navBarHeight + common_vendor.unref(appInfoStore).getInfo().statusBar + "px"
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a4f0bb53"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/Navbar.vue"]]);
wx.createComponent(Component);
