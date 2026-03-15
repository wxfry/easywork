"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "Footer",
  props: {
    haveCollect: {
      type: Boolean,
      default: false
    },
    objectId: {
      type: String
    },
    collectType: {
      type: Number
    }
  },
  emits: ["updateCollect"],
  setup(__props, { emit }) {
    const props = __props;
    const { proxy } = common_vendor.getCurrentInstance();
    const doCollect = async () => {
      let api = proxy.Api.addCollect;
      if (props.haveCollect) {
        api = proxy.Api.cancelCollect;
      }
      let result = await proxy.Request({
        url: api,
        params: {
          objectId: props.objectId,
          collectType: props.collectType
        }
      });
      if (!result) {
        return;
      }
      if (props.haveCollect) {
        proxy.Message.success("取消成功");
      } else {
        proxy.Message.success("收藏成功");
      }
      emit("updateCollect", !props.haveCollect);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(__props.haveCollect ? "collected" : ""),
        b: common_vendor.o(doCollect)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a676f463"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/Footer.vue"]]);
wx.createComponent(Component);
