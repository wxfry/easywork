"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
const _sfc_main = {
  __name: "DataList",
  props: {
    dataSource: {
      type: Object
    },
    loadStatus: {
      type: String,
      default: "more"
      //“more”  loading  noMore
    }
  },
  emits: ["loadData"],
  setup(__props, { emit }) {
    const props = __props;
    const _loadStatus = common_vendor.computed(() => {
      if (props.loadStatus == "more" && props.dataSource.pageTotal == props.dataSource.pageNo) {
        return "noMore";
      }
      return props.loadStatus;
    });
    const dataList = common_vendor.ref([]);
    common_vendor.onReachBottom(() => {
      if (_loadStatus.value == "loading" || props.dataSource.pageNo >= props.dataSource.pageTotal) {
        return;
      }
      props.dataSource.pageNo += 1;
      emit("loadData");
    });
    common_vendor.onPullDownRefresh(() => {
      props.dataSource.pageNo = 1;
      dataList.value = [];
      emit("loadData");
    });
    common_vendor.watch(
      () => props.dataSource.list,
      (newVal, oldVal) => {
        if (newVal) {
          if (props.dataSource.pageNo == null || props.dataSource.pageNo == 1) {
            dataList.value = newVal;
            return;
          }
          dataList.value = dataList.value.concat(newVal);
        }
      },
      { immediate: true, deep: true }
    );
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: "d-" + i0,
            b: common_vendor.r("d", {
              data: item,
              index: index + (__props.dataSource.pageNo - 1) * __props.dataSource.pageSize
            }, i0)
          };
        }),
        b: common_vendor.p({
          iconType: "circle",
          status: common_vendor.unref(_loadStatus)
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/DataList.vue"]]);
wx.createComponent(Component);
