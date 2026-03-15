"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "HistoryItem",
  props: {
    data: {
      type: Object
    },
    showDetail: {
      // 这里设置详情页不能继续跳转  列表展示可点击进入详情页,写详情页的时候还会用到
      type: Boolean,
      default: true
    },
    categoryId: {
      type: String
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    const { proxy } = common_vendor.getCurrentInstance();
    const showDetailHandler = (data) => {
      console.log("点击详情页", data);
      if (!props.showDetail) {
        return;
      }
      let url = `/pages/classification/TextDetail?chapter=${data.chapter}&categoryName=${data.categoryName}&textId=${data.textId}`;
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.data.categoryName + " " + __props.data.chapter,
        b: common_vendor.t(common_vendor.unref(proxy).Utils.dateformat(__props.data.createTime)),
        c: common_vendor.t(__props.data.status),
        d: __props.data.status === 0
      }, __props.data.status === 0 ? {} : __props.data.status === 1 ? {} : {}, {
        e: __props.data.status === 1,
        f: common_vendor.o(($event) => showDetailHandler(__props.data))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1ebd055"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/HistoryItem.vue"]]);
wx.createComponent(Component);
