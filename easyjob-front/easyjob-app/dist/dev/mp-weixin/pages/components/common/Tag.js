"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "Tag",
  props: {
    dataList: {
      type: Array,
      default: []
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ["updateData", "clickHandler"],
  setup(__props, { emit }) {
    const props = __props;
    const del = (index) => {
      props.dataList.splice(index, 1);
      emit("updateData");
    };
    const clickHandler = (item) => {
      emit("clickHandler", item);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(__props.dataList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => clickHandler(item))
          }, __props.showClose ? {
            c: common_vendor.o(($event) => del(index))
          } : {});
        }),
        b: __props.showClose,
        c: __props.dataList.length == 0
      }, __props.dataList.length == 0 ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-17f90251"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/Tag.vue"]]);
wx.createComponent(Component);
