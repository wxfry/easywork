"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "WrongQuestionItem",
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
    }
  },
  setup(__props) {
    const props = __props;
    const showDetailHandler = (data) => {
      if (!props.showDetail) {
        return;
      }
      let url = `/pages/my/WrongExamQuestion?questionId=${data.questionId}`;
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: __props.data.title,
        b: common_vendor.o(($event) => showDetailHandler(__props.data))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9a04121f"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/WrongQuestionItem.vue"]]);
wx.createComponent(Component);
