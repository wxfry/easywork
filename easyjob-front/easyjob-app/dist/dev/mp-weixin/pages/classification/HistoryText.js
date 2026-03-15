"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  (QuestionItem + QuestionCategory)();
}
const QuestionCategory = () => "./HistoryCategory.js";
const QuestionItem = () => "./HistoryItem.js";
const _sfc_main = {
  __name: "HistoryText",
  props: {
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const statusInfo = common_vendor.ref({
      status: "0",
      statusName: "未完成"
    });
    const dataSrouce = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.getTextHistory,
        showLoading: false,
        params: {
          // categoryId: categoryInfo.value.categoryId,
          status: statusInfo.value.status,
          pageNo: dataSrouce.value.pageNo || 1
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSrouce.value = result.data;
    };
    const historyCategoryRef = common_vendor.ref();
    const showHistoryCategory = () => {
      historyCategoryRef.value.show(statusInfo.value);
    };
    const selectHistoryCategory = (status) => {
      statusInfo.value = Object.assign({}, status);
      loadDataList();
    };
    common_vendor.onLoad((options) => {
      if (Object.keys(options).length > 0) {
        let { status } = options;
        statusInfo.value = {
          status,
          statusName: status === "0" ? "未完成" : "已完成"
        };
      }
      loadDataList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showHistoryCategory),
        b: common_vendor.p({
          showLeft: __props.showLeft,
          title: "练习历史"
        }),
        c: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "d8b638c8-2-" + i0 + ",d8b638c8-1",
            b: common_vendor.p({
              data,
              status: statusInfo.value.status,
              showDetail: true
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "c",
          vueId: "d8b638c8-1"
        }),
        d: common_vendor.o(loadDataList),
        e: common_vendor.p({
          dataSource: dataSrouce.value,
          loadStatus: loadStatus.value
        }),
        f: common_vendor.sr(historyCategoryRef, "d8b638c8-3", {
          "k": "historyCategoryRef"
        }),
        g: common_vendor.o(selectHistoryCategory)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d8b638c8"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/HistoryText.vue"]]);
wx.createComponent(Component);
