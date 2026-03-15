"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  ShareItem();
}
const ShareItem = () => "./ShareItem.js";
const _sfc_main = {
  __name: "ShareIndex",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.loadShareInfo,
        params: {
          pageNo: dataSource.value.pageNo
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
          showLeft: false,
          title: "经验分享"
        }),
        b: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "f69796a7-2-" + i0 + ",f69796a7-1",
            b: common_vendor.p({
              data,
              showDetail: true
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "b",
          vueId: "f69796a7-1"
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f69796a7"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/share/ShareIndex.vue"]]);
wx.createPage(MiniProgramPage);
