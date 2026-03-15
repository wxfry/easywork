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
  __name: "WrongExamQuestion",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const questionId = common_vendor.ref("");
    common_vendor.onLoad((option) => {
      try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.$page.options || {};
        questionId.value = options.questionId;
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
      let url = proxy.Api.myWrongQuestion;
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
          title: "我的错题"
        }),
        b: common_vendor.w(({
          data
        }, s0, i0) => {
          return {
            a: "e3e89e37-2-" + i0 + ",e3e89e37-1",
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
          vueId: "e3e89e37-1"
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e3e89e37"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/WrongExamQuestion.vue"]]);
wx.createPage(MiniProgramPage);
