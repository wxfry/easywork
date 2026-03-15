"use strict";
const common_vendor = require("../common/vendor.js");
const stores_questionCategory = require("../stores/questionCategory.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  (_component_Navbar + _easycom_uni_notice_bar2 + _easycom_uni_grid_item2 + _easycom_uni_grid2)();
}
const _easycom_uni_notice_bar = () => "../node-modules/@dcloudio/uni-ui/lib/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_grid_item = () => "../node-modules/@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../node-modules/@dcloudio/uni-ui/lib/uni-grid/uni-grid.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_grid_item + _easycom_uni_grid + Update + NavbarFooter)();
}
const Update = () => "./components/Update.js";
const NavbarFooter = () => "./components/common/NavbarFooter.js";
const _sfc_main = {
  __name: "Index",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const questionCategoryStore = stores_questionCategory.useQuestionCategoryStore();
    console.log("questionCategoryStore", questionCategoryStore.getInfo());
    const carouselList = common_vendor.ref([]);
    const loadCarouselData = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadCarousel,
        // main.js中引用api
        showLoading: false
      });
      if (!result) {
        return;
      }
      carouselList.value = result.data;
      console.log("carouselList.value======", carouselList.value);
    };
    loadCarouselData();
    const goExam = () => {
      common_vendor.index.switchTab({
        url: "./exam/ExamIndex"
      });
    };
    const swiperJump = (data) => {
      console.log("jumpData=========", data);
      let url = `/pages/share/ShareDetail?shareId=${data.objectId}`;
      if (data.objectType == 1) {
        url = `/pages/question/QuestionDetail?questionId=${data.objectId}`;
      } else if (data.objectType == 2) {
        url = `/pages/carousel/ExamQuestion?questionId=${data.objectId}`;
      } else if (data.objectType == 3) {
        url = `/pages/carousel/WebView?url=${encodeURI(data.outerLink)}`;
      }
      common_vendor.index.navigateTo({
        url
      });
    };
    const goSearch = () => {
      common_vendor.index.navigateTo({
        url: `/pages/search/SearchIndex`
      });
    };
    const goQuestion = (item) => {
      console.log("item", item);
      common_vendor.index.navigateTo({
        url: `/pages/classification/ClassifyList?categoryId=${item.categoryId}&categoryName=${encodeURIComponent(item.categoryName)}`
      });
    };
    const updateRef = common_vendor.ref();
    const checkUpdate = () => {
      common_vendor.nextTick$1(() => {
        common_vendor.onMounted(() => {
          if (updateRef.value) {
            updateRef.value.checkUpdate(false);
          }
        });
      });
    };
    checkUpdate();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: false,
          title: "考研政治刷题复习"
        }),
        b: common_vendor.f(carouselList.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => swiperJump(item), index),
            b: common_vendor.unref(proxy).Api.domain + common_vendor.unref(proxy).Api.imageUrl + item.imgPath,
            c: index
          };
        }),
        c: common_vendor.p({
          ["show-icon"]: true,
          scrollable: true,
          text: "题库持续更新中，意见反馈及版本更新请在个人中心反馈查看。"
        }),
        d: common_vendor.o(goSearch),
        e: common_vendor.o(goExam),
        f: common_vendor.f(common_vendor.unref(questionCategoryStore).getInfo(), (item, index, i0) => {
          return common_vendor.e({
            a: item.iconPath
          }, item.iconPath ? {
            b: common_vendor.unref(proxy).Api.domain + common_vendor.unref(proxy).Api.imageUrl + item.iconPath
          } : {
            c: common_vendor.t(item.categoryName)
          }, {
            d: item.bgColor,
            e: common_vendor.o(($event) => goQuestion(item), index),
            f: index,
            g: "75f76a7e-3-" + i0 + ",75f76a7e-2",
            h: common_vendor.p({
              index
            })
          });
        }),
        g: common_vendor.p({
          column: 3,
          ["show-border"]: false,
          square: false
        }),
        h: common_vendor.sr(updateRef, "75f76a7e-4", {
          "k": "updateRef"
        }),
        i: common_vendor.p({
          currentIndex: 0
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-75f76a7e"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/Index.vue"]]);
wx.createPage(MiniProgramPage);
