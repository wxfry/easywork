"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  QuestionItem();
}
const QuestionItem = () => "../classification/QuestionItem.js";
const _sfc_main = {
  __name: "CollectQuestion",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.myCollect,
        params: {
          pageNo: dataSource.value.pageNo,
          collectType: 1
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSource.value = result.data;
    };
    common_vendor.onLoad(() => {
      loadDataList();
    });
    common_vendor.onReachBottom(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: true,
          title: "我收藏的背诵题目"
        }),
        b: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "e462248c-2-" + i0 + ",e462248c-1",
            b: common_vendor.p({
              data
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "b",
          vueId: "e462248c-1"
        }),
        c: common_vendor.o(loadDataList),
        d: common_vendor.p({
          dataSource: dataSource.value,
          loadStatus: loadStatus.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e462248c"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/CollectQuestion.vue"]]);
wx.createPage(MiniProgramPage);
