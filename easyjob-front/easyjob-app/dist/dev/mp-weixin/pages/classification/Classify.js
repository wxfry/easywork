"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_bookCategory = require("../../stores/bookCategory.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  (_easycom_uni_grid_item2 + _easycom_uni_grid2)();
}
const _easycom_uni_grid_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-grid/uni-grid.js";
if (!Math) {
  (Navbar + _easycom_uni_grid_item + _easycom_uni_grid + NavbarFooter)();
}
const Navbar = () => "../components/common/Navbar.js";
const NavbarFooter = () => "../components/common/NavbarFooter.js";
const _sfc_main = {
  __name: "Classify",
  setup(__props) {
    const scrollHeight = common_vendor.ref(400);
    const scrollTopSize = common_vendor.ref(0);
    const fillHeight = common_vendor.ref(0);
    const leftArray = common_vendor.ref([]);
    const mainArray = common_vendor.ref([]);
    const topArr = common_vendor.ref([]);
    const leftIndex = common_vendor.ref(0);
    const scrollInto = common_vendor.ref("");
    common_vendor.ref(5);
    common_vendor.ref(4);
    const bookCategoryStore = stores_bookCategory.useBookCategoryStore();
    console.log("bookCategoryStore", bookCategoryStore.getInfo());
    common_vendor.ref([]);
    const jump = (item) => {
      if (item.needLogin) {
        const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
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
        url: item.path
      });
    };
    const jumpKu = (item) => {
      if (item.needLogin) {
        const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
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
    const list = common_vendor.ref([
      {
        text: "错题集",
        url: "/static/errorBook1.png",
        path: "/pages/my/WrongQuestionList",
        needLogin: true
      },
      {
        text: "背诵收藏",
        url: "/static/collectImg1.png",
        path: "/pages/my/CollectQuestion",
        needLogin: true
      },
      {
        text: "考题收藏",
        url: "/static/note.png",
        path: "/pages/my/CollectExamQuestionList",
        needLogin: true
      }
    ]);
    common_vendor.ref([]);
    const leftIntoView = common_vendor.computed(() => {
      return `left-${leftIndex.value > 3 ? leftIndex.value - 3 : 0}`;
    });
    common_vendor.ref("");
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        setTimeout(() => {
          initScrollView().then(() => {
            getListData();
          });
        }, 200);
      });
    });
    const initScrollView = () => {
      return new Promise((resolve, reject) => {
        const view = common_vendor.index.createSelectorQuery().select("#scroll-panel");
        view.boundingClientRect((res) => {
          scrollTopSize.value = res.top;
          scrollHeight.value = res.height;
          common_vendor.nextTick$1(() => {
            resolve();
          });
        }).exec();
      });
    };
    const getListData = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.showLoading();
        setTimeout(() => {
          const left = ["肖系列", "涛系列", "腿系列", "其他", "历年真题"];
          const leftId = ["10000", "10001", "10002", "10003", "10004"];
          const main = [];
          for (let i = 0; i < left.length; i++) {
            const list2 = [];
            for (let k = 0; k < bookCategoryStore.getInfo().length; k++) {
              if (bookCategoryStore.getInfo()[k].pId == leftId[i]) {
                list2.push({
                  name: bookCategoryStore.getInfo()[k].categoryName,
                  path: `/pages/classification/ClassifyBook?id=${bookCategoryStore.getInfo()[k].categoryName}`
                });
              }
            }
            main.push({
              title: `${left[i]}`,
              list: list2
            });
          }
          resolve({ left, main });
        }, 1e3);
      }).then((res) => {
        console.log("-----------请求接口返回数据示例-------------");
        console.log(res);
        common_vendor.index.hideLoading();
        leftArray.value = res.left;
        mainArray.value = res.main;
        common_vendor.nextTick$1(() => {
          getElementTop();
        });
      });
    };
    const getElementTop = () => {
      return new Promise((resolve, reject) => {
        const view = common_vendor.index.createSelectorQuery().selectAll(".main-item");
        view.boundingClientRect((data) => {
          resolve(data);
        }).exec();
      }).then((res) => {
        const topArr2 = res.map((item) => {
          return item.top - scrollTopSize.value;
        });
        topArr2.value = topArr2;
        const lastItem = res[res.length - 1];
        if (lastItem && lastItem.height) {
          const last = lastItem.height;
          if (last - 20 < scrollHeight.value) {
            fillHeight.value = scrollHeight.value - last + 20;
          }
        } else {
          console.warn("Last item or its height is undefined");
        }
      }).catch((error) => {
        console.error("Error in getElementTop:", error);
      });
    };
    const mainScroll = (e) => {
      const top = e.detail.scrollTop;
      let index = 0;
      for (let i = topArr.value.length - 1; i >= 0; i--) {
        if (top + 2 >= topArr.value[i]) {
          index = i;
          break;
        }
      }
      leftIndex.value = index < 0 ? 0 : index;
    };
    const leftTap = (e) => {
      const index = e.currentTarget.dataset.index;
      scrollInto.value = `item-${index}`;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: false,
          title: "试题分类"
        }),
        b: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.t(item.text),
            c: index,
            d: common_vendor.o(($event) => jump(item), index),
            e: "769582ff-2-" + i0 + ",769582ff-1",
            f: common_vendor.p({
              index
            })
          };
        }),
        c: common_vendor.p({
          column: 3,
          highlight: true,
          ["show-border"]: false,
          square: false
        }),
        d: common_vendor.f(leftArray.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: index == leftIndex.value ? 1 : "",
            d: "left-" + index,
            e: index,
            f: common_vendor.o(leftTap, index)
          };
        }),
        e: scrollHeight.value + "px",
        f: common_vendor.unref(leftIntoView),
        g: common_vendor.f(mainArray.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.f(item.list, (item2, index2, i1) => {
              return {
                a: common_vendor.t(item2.name),
                b: common_vendor.o(($event) => jumpKu(item2), index2),
                c: index2
              };
            }),
            c: index,
            d: "item-" + index
          };
        }),
        h: fillHeight.value + "px",
        i: scrollHeight.value + "px",
        j: common_vendor.o(mainScroll),
        k: scrollInto.value,
        l: common_vendor.p({
          currentIndex: 1
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/Classify.vue"]]);
wx.createPage(MiniProgramPage);
