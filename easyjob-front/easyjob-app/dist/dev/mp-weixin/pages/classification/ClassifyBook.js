"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_component_Navbar + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_uni_collapse_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_uni_collapse_item + _easycom_uni_collapse)();
}
const _sfc_main = {
  __name: "ClassifyBook",
  setup(__props) {
    common_vendor.useRoute();
    const { proxy } = common_vendor.getCurrentInstance();
    const categoryName = common_vendor.ref("");
    const getCategoryNameFromUrl = () => {
      const pages = getCurrentPages();
      console.log("pages", pages);
      const currentPage = pages[pages.length - 1];
      console.log("currentPage", currentPage);
      const options = currentPage.$page.options || {};
      console.log("options", options);
      return options.id || "";
    };
    common_vendor.onMounted(() => {
      categoryName.value = getCategoryNameFromUrl();
      console.log("categoryName set to:", categoryName.value);
    });
    const titleList = common_vendor.ref([
      {
        head: "马克思主义基本原理",
        body: [],
        path: []
      },
      {
        head: "毛泽东思想和中国特色社会主义理论体系概论",
        body: [],
        path: []
      },
      {
        head: "习近平新时代中国特色社会主义思想概论",
        body: [],
        path: []
      },
      {
        head: "中国近现代史纲要",
        body: [],
        path: []
      },
      {
        head: "思想道德与法治",
        body: [],
        path: []
      }
    ]);
    const activeNames = common_vendor.ref([]);
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let result = await proxy.Request({
        url: proxy.Api.loadQuestion1,
        showLoading: false,
        params: {
          pageNo: dataSource.value.pageNo
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      result.data.list.forEach((element) => {
        if (element.categoryName == categoryName.value) {
          for (let i = 0; i < titleList.value.length; i++) {
            if (element.knowledgePoints == titleList.value[i].head) {
              let found = false;
              for (let j = 0; j < titleList.value[i].body.length; j++) {
                if (element.chapter == titleList.value[i].body[j]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                const chapterPathMap = {};
                titleList.value[i].body.forEach((chapter, index) => {
                  chapterPathMap[chapter] = titleList.value[i].path[index];
                });
                titleList.value[i].body.push(element.chapter);
                chapterPathMap[element.chapter] = `/pages/classification/QuestionDetail?chapter=${element.chapter}&categoryName=${element.categoryName}`;
                titleList.value[i].body.sort();
                titleList.value[i].path = titleList.value[i].body.map((chapter) => chapterPathMap[chapter]);
                if (!activeNames.value.includes(i)) {
                  activeNames.value.push(i);
                }
              }
            }
          }
          dataSource.value = result.data;
        }
      });
      console.log("Title List:", titleList.value);
    };
    common_vendor.onLoad(() => {
      loadDataList();
    });
    common_vendor.onReachBottom(() => {
    });
    const showModal = common_vendor.ref(false);
    const selectedPath = common_vendor.ref("");
    const showModeSelection = (path) => {
      showModal.value = true;
      selectedPath.value = path;
      console.log("Selected Path:", selectedPath.value);
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const selectMode = async (mode) => {
      const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
      if (!token) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.reLaunch({
            // 或 uni.redirectTo 根据需求选择
            url: "/pages/account/LoginAndRegister"
          });
        }, 1e3);
      }
      const chapter = common_vendor.ref([]);
      console.log("chapter=========", chapter);
      chapter.value = selectedPath.value.split("&")[0].split("=")[1];
      const categoryName1 = common_vendor.ref([]);
      categoryName1.value = categoryName.value;
      console.log("chapter.value", chapter.value);
      console.log("categoryName1.value", categoryName1.value);
      let url = "";
      if (mode === "brush") {
        url = `/pages/classification/QuestionDetail?chapter=${selectedPath.value.split("&")[0].split("=")[1]}&categoryName=${selectedPath.value.split("&")[1].split("=")[1]}`;
      } else if (mode === "practice") {
        url = `/pages/classification/HistoryIndex?chapter=${selectedPath.value.split("&")[0].split("=")[1]}&categoryName=${selectedPath.value.split("&")[1].split("=")[1]}`;
      } else if (mode === "newPractice") {
        let result = await proxy.Request({
          url: proxy.Api.createTexts,
          params: {
            chapter: chapter.value,
            categoryName: categoryName1.value
          }
        });
        if (!result) {
          return;
        }
        url = `/pages/classification/TextDetail?chapter=${selectedPath.value.split("&")[0].split("=")[1]}&categoryName=${selectedPath.value.split("&")[1].split("=")[1]}&textId=${result.data.textId}`;
      }
      common_vendor.index.navigateTo({
        url
      });
      closeModal();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(categoryName.value),
        b: common_vendor.p({
          title: "刷题练习"
        }),
        c: common_vendor.f(titleList.value, (item, index, i0) => {
          return {
            a: common_vendor.f(item.body, (item2, index2, i1) => {
              return {
                a: common_vendor.t(item2),
                b: common_vendor.o(($event) => showModeSelection(item.path[index2]), index2),
                c: index2
              };
            }),
            b: index,
            c: "754b4168-2-" + i0 + ",754b4168-1",
            d: common_vendor.p({
              title: item.head,
              ["show-animation"]: false,
              ["title-border:show"]: true
            })
          };
        }),
        d: common_vendor.o(($event) => activeNames.value = $event),
        e: common_vendor.p({
          modelValue: activeNames.value
        }),
        f: showModal.value
      }, showModal.value ? {
        g: common_vendor.o(closeModal),
        h: common_vendor.o(($event) => selectMode("brush")),
        i: common_vendor.o(($event) => selectMode("practice")),
        j: common_vendor.o(($event) => selectMode("newPractice"))
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-754b4168"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/ClassifyBook.vue"]]);
wx.createPage(MiniProgramPage);
