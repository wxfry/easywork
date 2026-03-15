"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Popup = common_vendor.resolveComponent("Popup");
  _component_Popup();
}
const _sfc_main = {
  __name: "HistoryCategory",
  emits: ["select"],
  setup(__props, { expose, emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataSource = common_vendor.ref({});
    const loadDataList = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getTextHistory,
        showLoading: false
      });
      if (!result) {
        return;
      }
      dataSource.value = result.data;
    };
    loadDataList();
    const categoryPoupRef = common_vendor.ref();
    const statusInfo = common_vendor.ref(["全部分类", "未完成", "已完成"]);
    const currentStatus = common_vendor.ref(0);
    const show = (status) => {
      currentStatus.value = status;
      categoryPoupRef.value.show();
    };
    const selectStatus = (item) => {
      currentStatus.value = item.valueOf();
      emit("select", {
        status: item.valueOf()
      });
      categoryPoupRef.value.close();
    };
    expose({
      show
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(statusInfo.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.valueOf()),
            b: common_vendor.n(currentStatus.value == item.valueOf() ? "active" : ""),
            c: common_vendor.o(($event) => selectStatus(item))
          };
        }),
        b: common_vendor.sr(categoryPoupRef, "7781c51c-0", {
          "k": "categoryPoupRef"
        }),
        c: common_vendor.p({
          type: "right"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7781c51c"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/HistoryCategory.vue"]]);
wx.createComponent(Component);
