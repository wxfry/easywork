"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  _component_Navbar();
}
if (!Math) {
  FeedbackEdit();
}
const FeedbackEdit = () => "./FeedBackEdit.js";
const _sfc_main = {
  __name: "FeedbackReply",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const pFeedbackId = common_vendor.ref(0);
    const dataList = common_vendor.ref([]);
    const loadDataList = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadFeedbackReply,
        params: {
          pFeedbackId: pFeedbackId.value
        }
      });
      if (!result) {
        return;
      }
      dataList.value = result.data;
    };
    common_vendor.onLoad((option) => {
      pFeedbackId.value = option.pFeedbackId;
      loadDataList();
    });
    const feedbackEditRef = common_vendor.ref();
    const showEdit = () => {
      feedbackEditRef.value.show({ pFeedbackId: pFeedbackId.value });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(showEdit),
        b: common_vendor.p({
          showLeft: true,
          title: "问题反馈"
        }),
        c: common_vendor.f(dataList.value, (data, k0, i0) => {
          return common_vendor.e({
            a: data.sendType == 0
          }, data.sendType == 0 ? {
            b: common_vendor.t(data.createTime),
            c: common_vendor.t(data.content)
          } : {
            d: common_vendor.t(data.createTime),
            e: common_vendor.t(data.content)
          });
        }),
        d: dataList.value.length == 0
      }, dataList.value.length == 0 ? {} : {}, {
        e: common_vendor.sr(feedbackEditRef, "99cf92f9-1", {
          "k": "feedbackEditRef"
        }),
        f: common_vendor.o(loadDataList)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-99cf92f9"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/FeedbackReply.vue"]]);
wx.createPage(MiniProgramPage);
