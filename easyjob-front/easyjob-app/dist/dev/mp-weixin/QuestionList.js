"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  (QuestionItem + QuestionCategory)();
}
const QuestionCategory = () => "./pages/question/QuestionCategory1.js";
const QuestionItem = () => "./pages/question/QuestionItem.js";
const _sfc_main = {
  __name: "QuestionList",
  props: {
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const categoryInfo = common_vendor.ref({
      categoryId: "0",
      categoryName: "全部分类"
    });
    const dataSrouce = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.loadQuestion,
        showLoading: false,
        params: {
          categoryId: categoryInfo.value.categoryId,
          pageNo: dataSrouce.value.pageNo || 1
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSrouce.value = result.data;
    };
    loadDataList();
    const questionCategoryRef = common_vendor.ref();
    const showCategory = () => {
      questionCategoryRef.value.show(categoryInfo.value);
    };
    const selectCategory = (category) => {
      categoryInfo.value = Object.assign({}, category);
      loadDataList();
    };
    common_vendor.onLoad((options) => {
      if (Object.keys(options).length > 0) {
        let { categoryId, categoryName } = options;
        categoryName = decodeURIComponent(categoryName);
        categoryInfo.value = {
          categoryId,
          categoryName
        };
      }
      loadDataList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showCategory),
        b: common_vendor.p({
          showLeft: __props.showLeft,
          title: categoryInfo.value.categoryName
        }),
        c: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "c3973b29-2-" + i0 + ",c3973b29-1",
            b: common_vendor.p({
              data,
              categoryId: categoryInfo.value.categoryId,
              showDetail: true
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "c",
          vueId: "c3973b29-1"
        }),
        d: common_vendor.o(loadDataList),
        e: common_vendor.p({
          dataSource: dataSrouce.value,
          loadStatus: loadStatus.value
        }),
        f: common_vendor.sr(questionCategoryRef, "c3973b29-3", {
          "k": "questionCategoryRef"
        }),
        g: common_vendor.o(selectCategory)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c3973b29"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/question/QuestionList.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
