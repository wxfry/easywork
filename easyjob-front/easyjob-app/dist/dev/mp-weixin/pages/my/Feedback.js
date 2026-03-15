"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  FeedbackEdit();
}
const FeedbackEdit = () => "./FeedBackEdit.js";
const _sfc_main = {
  __name: "Feedback",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.loadFeedback,
        params: {
          pageNo: dataSource.value.pageNo,
          pFeedbackId: 0
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSource.value = result.data;
      console.log("dataSource.value", dataSource.value);
    };
    common_vendor.onShow(() => {
      loadDataList();
    });
    common_vendor.onReachBottom(() => {
    });
    const feedbackEditRef = common_vendor.ref();
    const showEdit = () => {
      feedbackEditRef.value.show({ pFeedbackId: 0 });
    };
    const showReply = (data) => {
      common_vendor.index.navigateTo({
        url: "/pages/my/FeedbackReply?pFeedbackId=" + data.feedbackId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showEdit),
        b: common_vendor.p({
          showLeft: true,
          title: "问题反馈"
        }),
        c: common_vendor.w(({
          data
        }, s0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(data.content),
            b: common_vendor.t(common_vendor.unref(proxy).Utils.dateformat(data.createTime)),
            c: data.status == 1
          }, data.status == 1 ? {} : {}, {
            d: common_vendor.o(($event) => showReply(data)),
            e: i0,
            f: s0
          });
        }, {
          name: "d",
          path: "c",
          vueId: "43cab3b7-1"
        }),
        d: common_vendor.o(loadDataList),
        e: common_vendor.p({
          dataSource: dataSource.value,
          loadStatus: loadStatus.value
        }),
        f: common_vendor.sr(feedbackEditRef, "43cab3b7-2", {
          "k": "feedbackEditRef"
        }),
        g: common_vendor.o(loadDataList)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-43cab3b7"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/Feedback.vue"]]);
wx.createPage(MiniProgramPage);
