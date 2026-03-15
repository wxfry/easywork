"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _component_DataList = common_vendor.resolveComponent("DataList");
  (_component_Navbar + _component_DataList)();
}
if (!Math) {
  ExamQuestionItem();
}
const ExamQuestionItem = () => "../exam/ExamQuestionItem.js";
const _sfc_main = {
  __name: "CollectExamQuestion",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const questionId = common_vendor.ref("");
    common_vendor.onLoad((option) => {
      try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.$page.options || {};
        questionId.value = options.questionId;
        console.log("questionId.value", questionId.value);
        loadDataList().catch((error) => {
          console.error("Error in loadDataList:", error);
          proxy.Message.error("加载题目失败，请稍后再试");
        });
      } catch (error) {
        console.error("Error in onLoad:", error);
        proxy.Message.error("页面初始化失败，请检查参数");
      }
    });
    const dataSource = common_vendor.ref({});
    const question = common_vendor.ref({
      list: []
    });
    const loadStatus = common_vendor.ref(null);
    const loadDataList = async () => {
      loadStatus.value = "loading";
      let url = proxy.Api.myCollect;
      let result = await proxy.Request({
        url,
        params: {
          pageNo: dataSource.value.pageNo,
          collectType: 2
        }
      });
      if (!result) {
        return;
      }
      loadStatus.value = "more";
      dataSource.value = result.data;
      console.log("dataSource.value", dataSource.value);
      const _dataSource = dataSource.value.list;
      for (let i = 0; i < _dataSource.length; i++) {
        if (_dataSource[i].questionId == questionId.value) {
          question.value.list[0] = _dataSource[i];
          question.value.pageNo = 1;
          question.value.totalCount = 1;
          question.value.pageSize = 1;
          question.value.pageTotal = 1;
          console.log("question.value======", question.value);
        }
      }
    };
    common_vendor.onLoad(() => {
      loadDataList();
    });
    common_vendor.onReachBottom(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: true,
          title: "收藏考题详情"
        }),
        b: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "170b4e29-2-" + i0 + ",170b4e29-1",
            b: common_vendor.p({
              showAnswer: true,
              data,
              showHtml: true
            }),
            c: i0,
            d: s0
          };
        }, {
          name: "d",
          path: "b",
          vueId: "170b4e29-1"
        }),
        c: common_vendor.o(loadDataList),
        d: common_vendor.p({
          dataSource: question.value,
          loadStatus: loadStatus.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-170b4e29"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/CollectExamQuestion.vue"]]);
wx.createPage(MiniProgramPage);
