"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_questionCategory = require("../../stores/questionCategory.js");
if (!Array) {
  const _component_Popup = common_vendor.resolveComponent("Popup");
  _component_Popup();
}
const _sfc_main = {
  __name: "QuestionCategory1",
  emits: ["select"],
  setup(__props, { expose, emit }) {
    const questionCategoryStore = stores_questionCategory.useQuestionCategoryStore();
    const categoryPoupRef = common_vendor.ref();
    const currentCategoryId = common_vendor.ref(0);
    const show = (category) => {
      currentCategoryId.value = category.categoryId;
      categoryPoupRef.value.show();
    };
    const selectCategory = (item) => {
      currentCategoryId.value = item.categoryId;
      emit("select", {
        categoryName: item.categoryName,
        categoryId: item.categoryId + ""
      });
      categoryPoupRef.value.close();
    };
    expose({
      show
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(currentCategoryId.value == 0 ? "active" : ""),
        b: common_vendor.o(($event) => selectCategory({
          categoryId: 0,
          categoryName: "全部分类"
        })),
        c: common_vendor.f(common_vendor.unref(questionCategoryStore).getInfo(), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.categoryName),
            b: common_vendor.n(currentCategoryId.value == item.categoryId ? "active" : ""),
            c: common_vendor.o(($event) => selectCategory(item))
          };
        }),
        d: common_vendor.sr(categoryPoupRef, "5f108c4a-0", {
          "k": "categoryPoupRef"
        }),
        e: common_vendor.p({
          type: "right"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f108c4a"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/question/QuestionCategory1.vue"]]);
wx.createComponent(Component);
