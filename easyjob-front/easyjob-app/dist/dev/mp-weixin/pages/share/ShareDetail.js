"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_ShowTips = common_vendor.resolveComponent("ShowTips");
  const _component_SlidePage = common_vendor.resolveComponent("SlidePage");
  const _component_Footer = common_vendor.resolveComponent("Footer");
  (_component_Navbar + _component_ShowTips + _component_SlidePage + _component_Footer)();
}
if (!Math) {
  (ShareItem + uvParse)();
}
const uvParse = () => "../components/uv-parse/components/uv-parse/uv-parse.js";
const ShareItem = () => "./ShareItem.js";
const _sfc_main = {
  __name: "ShareDetail",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const currentId = common_vendor.ref();
    const shareData = common_vendor.ref({});
    const nextType = common_vendor.ref(null);
    const loadDetail = async () => {
      let url = proxy.Api.getShareDetailNext;
      let result = await proxy.Request({
        url,
        params: {
          currentId: currentId.value,
          nextType: nextType.value
        }
      });
      if (!result) {
        return;
      }
      shareData.value = result.data;
      currentId.value = result.data.shareId;
    };
    const loadDataNext = (_nextType) => {
      nextType.value = _nextType;
      loadDetail();
    };
    common_vendor.onLoad((option) => {
      currentId.value = option.shareId;
      loadDetail();
    });
    const updateCollect = (_haveCollect) => {
      shareData.value.haveCollect = _haveCollect;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          showLeft: true,
          title: "分享详情"
        }),
        b: common_vendor.p({
          data: shareData.value,
          showDetail: false
        }),
        c: shareData.value.coverType == 1
      }, shareData.value.coverType == 1 ? {
        d: common_vendor.unref(proxy).Api.domain + common_vendor.unref(proxy).Api.imageUrl + shareData.value.coverPath
      } : {}, {
        e: common_vendor.p({
          content: shareData.value.content
        }),
        f: common_vendor.sr("slidPageRef", "82978c41-2"),
        g: common_vendor.o(loadDataNext),
        h: common_vendor.p({
          showFooter: true
        }),
        i: common_vendor.o(updateCollect),
        j: common_vendor.p({
          objectId: shareData.value.shareId + "",
          collectType: 0,
          haveCollect: shareData.value.haveCollect
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-82978c41"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/share/ShareDetail.vue"]]);
wx.createPage(MiniProgramPage);
