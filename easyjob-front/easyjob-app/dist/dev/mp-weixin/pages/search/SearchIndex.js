"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  (_easycom_uni_easyinput2 + _component_Navbar)();
}
const _easycom_uni_easyinput = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_easyinput + Tag + QuestionItem + QuestionItem2 + DataList)();
}
const Tag = () => "../components/common/Tag.js";
const QuestionItem = () => "../question/QuestionItem.js";
const QuestionItem2 = () => "./QuestionItem2.js";
const DataList = () => "../components/common/DataList.js";
const _sfc_main = {
  __name: "SearchIndex",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const showSearch = common_vendor.ref(true);
    const keyword = common_vendor.ref();
    const searchList = common_vendor.ref(
      common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.searchHistory.key) || []
    );
    const inputChange = (e) => {
      if (e == "") {
        showSearch.value = true;
      }
    };
    const clearInput = (e) => {
      keyword.value = "";
      showSearch.value = true;
    };
    const tagSearch = (tag) => {
      keyword.value = tag;
      search();
    };
    const saveTag = () => {
      common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.searchHistory.key, searchList.value);
    };
    const search = () => {
      if (keyword.value == void 0 || keyword.value.length < 3) {
        proxy.Message.error("请输入关键字");
        return;
      }
      showSearch.value = false;
      if (!searchList.value.includes(keyword.value)) {
        searchList.value.unshift(keyword.value);
        common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.searchHistory.key, searchList.value);
      }
      dataSource.pageNo = 1;
      loadDataList();
    };
    const curTab = common_vendor.ref(0);
    const tabList = common_vendor.ref(["背诵", "题目"]);
    const tabClick = (index) => {
      curTab.value = index;
      dataSource.pageNo = 1;
      dataSource.list = [];
      loadDataList();
    };
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      if (keyword.value == void 0 || keyword.value.length < 3) {
        common_vendor.index.stopPullDownRefresh();
        return;
      }
      loadStatus.value = "loading";
      console.log("keyword.value==================", keyword.value);
      let result = await proxy.Request({
        url: proxy.Api.search,
        params: {
          keyword: keyword.value,
          pageNo: dataSource.value.pageNo || 1,
          type: curTab.value
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      const list = result.data.list;
      list.forEach((element) => {
        element.curTab = curTab.value;
        element.keyword = keyword.value;
        element.title = element.title.toLowerCase();
        element.title = element.title.replace(
          keyword.value,
          "<span style='color:red'>" + keyword.value + "</span>"
        );
      });
      dataSource.value = result.data;
      dataSource.value.keyword = keyword.value;
      console.log("dataSource=======", dataSource);
    };
    loadDataList();
    common_vendor.onReachBottom(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(search),
        b: common_vendor.o(inputChange),
        c: common_vendor.o(clearInput),
        d: common_vendor.o(($event) => keyword.value = $event),
        e: common_vendor.p({
          clearable: false,
          placeholder: "请输入关键词，至少三个字",
          prefixIcon: "search",
          suffixIcon: keyword.value ? "closeempty" : "",
          trim: true,
          confirmType: "搜索",
          modelValue: keyword.value
        }),
        f: common_vendor.o(search),
        g: common_vendor.p({
          showLeft: true
        }),
        h: showSearch.value
      }, showSearch.value ? {
        i: common_vendor.o(saveTag),
        j: common_vendor.o(tagSearch),
        k: common_vendor.p({
          dataList: searchList.value
        })
      } : {
        l: common_vendor.f(tabList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.n(index == curTab.value ? "active" : ""),
            c: common_vendor.o(($event) => tabClick(index))
          };
        }),
        m: common_vendor.w(({
          data,
          extParam
        }, s0, i0) => {
          return common_vendor.e({
            a: data.curTab == 0
          }, data.curTab == 0 ? {
            b: "0f8d192e-4-" + i0 + ",0f8d192e-3",
            c: common_vendor.p({
              data
            })
          } : {}, {
            d: data.curTab == 1
          }, data.curTab == 1 ? {
            e: "0f8d192e-5-" + i0 + ",0f8d192e-3",
            f: common_vendor.p({
              data
            })
          } : {}, {
            g: i0,
            h: s0
          });
        }, {
          name: "d",
          path: "m",
          vueId: "0f8d192e-3"
        }),
        n: common_vendor.o(loadDataList),
        o: common_vendor.p({
          dataSource: dataSource.value,
          loadStatus: loadStatus.value
        }),
        p: common_vendor.n(curTab.value == 0 ? "padding-data-list" : "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f8d192e"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/search/SearchIndex.vue"]]);
wx.createPage(MiniProgramPage);
