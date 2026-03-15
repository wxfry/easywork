"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_bookCategory = require("../../stores/bookCategory.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  _component_Navbar();
}
if (!Math) {
  QuestionCategory();
}
const QuestionCategory = () => "../question/QuestionCategory1.js";
const _sfc_main = {
  __name: "ClassifyList",
  props: {
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const bookCategoryStore = stores_bookCategory.useBookCategoryStore();
    console.log("bookCategoryStore", bookCategoryStore.getInfo());
    const mainArray = common_vendor.ref([]);
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
        // url: proxy.Api.loadClassify,
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
      console.log("dataSource.value======", dataSrouce.value);
    };
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
      getListData();
    });
    const getListData = () => {
      console.log("getListData开始运行");
      return new Promise((resolve, reject) => {
        common_vendor.index.showLoading();
        setTimeout(() => {
          const main = [];
          const list = [];
          console.log("即将运行for循环");
          for (let i = 0; i < bookCategoryStore.getInfo().length; i++) {
            console.log("bookCategoryStore.getInfo()[i].pId", bookCategoryStore.getInfo()[i].pId);
            console.log("categoryInfo.value.categoryId", categoryInfo.value.categoryId);
            if (bookCategoryStore.getInfo()[i].pId == categoryInfo.value.categoryId) {
              list.push({
                name: bookCategoryStore.getInfo()[i].categoryName,
                path: `/pages/classification/ClassifyBook?id=${bookCategoryStore.getInfo()[i].categoryName}`
              });
            }
          }
          console.log("list", list);
          main.push({
            title: `${categoryInfo.value.categoryName}`,
            list
          });
          console.log("main", main);
          resolve({ main });
        }, 1e3);
      }).then((res) => {
        console.log("-----------请求接口返回数据示例-------------");
        console.log(res);
        common_vendor.index.hideLoading();
        mainArray.value = res.main;
        console.log("mainArray.value", mainArray.value);
      });
    };
    const jumpKu = (item) => {
      if (item.needLogin) {
        const token = common_vendor.index.getStorageSync(LOCAL_STORAGE_KEY.token.key);
        if (token == "" || token == null) {
          common_vendor.index.navigateTo({
            url: "/pages/account/LoginAndRegister"
          });
          return;
        }
      }
      if (item.clickFun) {
        item.clickFun();
        return;
      }
      common_vendor.index.navigateTo({
        // url: "/pages/classification/ClassifyBook",
        url: item.path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(showCategory),
        b: common_vendor.p({
          showLeft: __props.showLeft,
          title: categoryInfo.value.categoryName
        }),
        c: common_vendor.f(mainArray.value, (item, index, i0) => {
          return {
            a: common_vendor.f(item.list, (subItem, subIndex, i1) => {
              return {
                a: common_vendor.t(subItem.name),
                b: common_vendor.o(($event) => jumpKu(subItem), subIndex),
                c: subIndex
              };
            }),
            b: index
          };
        }),
        d: common_vendor.sr(questionCategoryRef, "8c00e589-1", {
          "k": "questionCategoryRef"
        }),
        e: common_vendor.o(selectCategory)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8c00e589"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/ClassifyList.vue"]]);
wx.createPage(MiniProgramPage);
