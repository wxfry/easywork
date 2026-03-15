"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ShareItem",
  props: {
    data: {
      type: Object
    },
    showDetail: {
      type: Boolean
    }
  },
  setup(__props) {
    const props = __props;
    const { proxy } = common_vendor.getCurrentInstance();
    const showDetailHandler = (data) => {
      if (!props.showDetail) {
        return;
      }
      let url = `/pages/share/ShareDetail?shareId=${data.shareId}`;
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.data.title,
        b: __props.data.coverType == 2 && __props.showDetail
      }, __props.data.coverType == 2 && __props.showDetail ? {
        c: common_vendor.unref(proxy).Api.domain + common_vendor.unref(proxy).Api.imageUrl + __props.data.coverPath
      } : {}, {
        d: __props.data.coverType == 1 && __props.showDetail
      }, __props.data.coverType == 1 && __props.showDetail ? {
        e: common_vendor.unref(proxy).Api.domain + common_vendor.unref(proxy).Api.imageUrl + __props.data.coverPath
      } : {}, {
        f: common_vendor.t(__props.data.createUserName),
        g: common_vendor.t(common_vendor.unref(proxy).Utils.dateformat(__props.data.createTime)),
        h: common_vendor.t(__props.data.readCount),
        i: common_vendor.o(($event) => showDetailHandler(__props.data))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f2b61a89"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/share/ShareItem.vue"]]);
wx.createComponent(Component);
