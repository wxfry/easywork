"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  (uniPopup + QuestionItem)();
}
const QuestionItem = () => "./WrongQuestionItem.js";
const uniPopup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _sfc_main = {
  __name: "WrongQuestionList",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataSource = common_vendor.ref({});
    const loadStatus = common_vendor.ref(null);
    const questionCount = common_vendor.ref(20);
    const practiceMode = common_vendor.ref("random");
    const popup = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      proxy.Api.myCollect;
      let result = await proxy.Request({
        url: proxy.Api.myWrongQuestion,
        showLoading: false,
        params: {
          pageNo: dataSource.value.pageNo
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSource.value = result.data;
    };
    common_vendor.onLoad(() => {
      loadDataList();
    });
    common_vendor.onReachBottom(() => {
    });
    const showPopup = () => {
      popup.value.open();
    };
    const startPractice = async () => {
      console.log("Selected practice mode:", practiceMode.value);
      const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
      if (token == "" || token == null) {
        common_vendor.index.navigateTo({
          url: "/pages/account/LoginAndRegister"
        });
      }
      let result = await proxy.Request({
        // url: proxy.Api.createExam,
        url: proxy.Api.createWrongText,
        params: {
          questionCount: questionCount.value,
          practiceMode: practiceMode.value
        }
      });
      if (!result) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/my/WrongQuestionText?examId=" + result.data.examId
      });
    };
    const onPracticeModeChange = (event) => {
      console.log("Practice mode changed to:", event.detail.value);
      practiceMode.value = event.detail.value;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: true,
          title: "错题列表"
        }),
        b: common_vendor.o(showPopup),
        c: questionCount.value,
        d: common_vendor.o(($event) => questionCount.value = $event.detail.value),
        e: practiceMode.value === "random",
        f: practiceMode.value === "sequential",
        g: common_vendor.o(onPracticeModeChange),
        h: common_vendor.o(startPractice),
        i: common_vendor.sr(popup, "090be3ff-1", {
          "k": "popup"
        }),
        j: common_vendor.p({
          type: "center"
        }),
        k: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "090be3ff-3-" + i0 + ",090be3ff-2",
            b: common_vendor.p({
              data
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "k",
          vueId: "090be3ff-2"
        }),
        l: common_vendor.o(loadDataList),
        m: common_vendor.p({
          dataSource: dataSource.value,
          loadStatus: loadStatus.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-090be3ff"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/WrongQuestionList.vue"]]);
wx.createPage(MiniProgramPage);
