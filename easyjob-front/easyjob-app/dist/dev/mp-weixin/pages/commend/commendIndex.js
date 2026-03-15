"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  _component_Navbar();
}
if (!Math) {
  NavbarFooter();
}
const NavbarFooter = () => "../components/common/NavbarFooter.js";
const _sfc_main = {
  __name: "commendIndex",
  emits: ["reload"],
  setup(__props, { emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const isSignedIn = common_vendor.ref(false);
    const userInfo = common_vendor.ref({});
    const getUserInfo = async () => {
      let result = await proxy.Request({
        url: proxy.Api.getUserInfo,
        showLoading: false
      });
      if (!result) {
        return;
      }
      userInfo.value = result.data || {};
      console.log("userInfo.value", userInfo.value);
      if (userInfo.value.signDate) {
        const signDate = new Date(userInfo.value.signDate);
        const today = new Date();
        if (signDate.getFullYear() === today.getFullYear() && signDate.getMonth() === today.getMonth() && signDate.getDate() === today.getDate()) {
          isSignedIn.value = true;
        } else {
          isSignedIn.value = false;
        }
      }
    };
    const userKnowledgeMatrix = common_vendor.ref({});
    const getUserKnowledgeMatrix = async () => {
      try {
        let result = await proxy.Request({
          url: proxy.Api.getUserKnowledgeMatrix,
          showLoading: false,
          header: {
            token: userInfo.value.token
            // 假设 userInfo 中包含 token
          }
        });
        if (!result) {
          console.error("Failed to get user knowledge matrix:", result);
          return;
        }
        userKnowledgeMatrix.value = result.data || {};
        for (let key in userKnowledgeMatrix.value) {
          if (typeof userKnowledgeMatrix.value[key] === "number") {
            userKnowledgeMatrix.value[key] = parseFloat(userKnowledgeMatrix.value[key].toFixed(2));
          }
        }
        console.log("userKnowledgeMatrix.value", userKnowledgeMatrix.value);
        for (let key in userKnowledgeMatrix.value) {
          if (userKnowledgeMatrix.value[key] < 0.6) {
            if (userKnowledgeMatrix.value[key] == 0) {
              nonePoint.value.push(key);
            } else {
              weakPoint.value.push(key);
            }
          }
        }
        console.log("weakPoint-----", weakPoint);
      } catch (error) {
        console.error("Error fetching user knowledge matrix:", error);
      }
    };
    const weakPoint = common_vendor.ref([]);
    const nonePoint = common_vendor.ref([]);
    common_vendor.ref(["马克思主义基本原理", "中国近现代史纲要", "思想道德与法治", "习近平新时代中国特色社会主义思想概论", "毛泽东思想和中国特色社会主义理论体系概论"]);
    const TextQuestionData = common_vendor.ref({});
    const getTextQuestionData = async () => {
      try {
        let result = await proxy.Request({
          url: proxy.Api.getTextQuestionData,
          showLoading: false,
          header: {
            token: userInfo.value.token
            // 假设 userInfo 中包含 token
          }
        });
        if (!result) {
          console.error("Failed to get user knowledge matrix:", result);
          return;
        }
        TextQuestionData.value = result.data || {};
        console.log("TextQuestionData.value", TextQuestionData.value);
      } catch (error) {
        console.error("Error fetching user knowledge matrix:", error);
      }
    };
    const ExamStatistics = common_vendor.ref({});
    const getExamStatistics = async () => {
      try {
        let result = await proxy.Request({
          url: proxy.Api.getExamStatistics,
          showLoading: false,
          header: {
            token: userInfo.value.token
            // 假设 userInfo 中包含 token
          }
        });
        if (!result) {
          console.error("Failed to get user knowledge matrix:", result);
          return;
        }
        ExamStatistics.value = result.data || {};
        console.log("ExamStatistics.value", ExamStatistics.value);
      } catch (error) {
        console.error("Error fetching user knowledge matrix:", error);
      }
    };
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    console.log("weekDays======", weekDays);
    const isDaySigned = (day) => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const targetDay = weekDays.indexOf(day);
      if (dayOfWeek >= targetDay) {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const date = String(today.getDate() - (dayOfWeek - targetDay)).padStart(2, "0");
        const formattedDate = `${year}-${month}-${date}`;
        return signDetails.value[formattedDate] || false;
      }
      return false;
    };
    const getSign = async () => {
      if (isSignedIn.value == false) {
        let result = await proxy.Request({
          url: proxy.Api.sign,
          showLoading: false,
          params: {
            date: new Date().toISOString().split("T")[0]
          }
        });
        if (!result) {
          return;
        }
        console.log("result.data", result.data);
        if (result.data == 0) {
          isSignedIn.value = true;
          getUserInfo();
          getSignDetail();
          emit("reload");
        }
      }
    };
    const signDetails = common_vendor.ref({});
    const getSignDetail = async () => {
      let result = await proxy.Request({
        url: proxy.Api.signDetail,
        showLoading: false
      });
      if (!result) {
        return;
      }
      signDetails.value = result.data || {};
    };
    getSignDetail();
    common_vendor.ref({});
    common_vendor.ref({
      color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
      padding: [15, 10, 0, 15],
      enableScroll: false,
      legend: {},
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        gridType: "dash",
        dashLength: 2
      },
      extra: {
        line: {
          type: "straight",
          width: 2,
          activeType: "hollow"
        }
      }
    });
    const cWidth = common_vendor.ref(0);
    const cHeight = common_vendor.ref(500);
    const uChartsInstance = {};
    const activeTab = common_vendor.ref("练习统计");
    const getServerData = () => {
      setTimeout(() => {
        let res = {};
        switch (activeTab.value) {
          case "练习统计":
            res = {
              // categories: ["马原","新思想", "史纲", "思修", "毛概"],
              categories: Object.keys(TextQuestionData.value).map((key) => {
                switch (key) {
                  case "马克思主义基本原理":
                    return "马原";
                  case "毛泽东思想和中国特色社会主义理论体系概论":
                    return "毛概";
                  case "思想道德与法治":
                    return "思修";
                  case "习近平新时代中国特色社会主义思想概论":
                    return "新思想";
                  case "中国近现代史纲要":
                    return "史纲";
                  default:
                    return key;
                }
              }),
              series: [
                {
                  name: "练习题目数量",
                  data: Object.values(TextQuestionData.value)
                  // data: ["45", "20", "6", "24", "35"]
                }
              ]
            };
            break;
          case "考试统计":
            res = {
              categories: ["第一次", "第二次", "第三次", "第四次", "第五次"],
              series: [
                {
                  name: "近5次考试正确率",
                  data: Object.values(ExamStatistics.value)
                  // data: ["0.42", "0.54", "0.56", "0.78", "0.95"]
                }
              ]
            };
            break;
          case "综合评估":
            res = {
              categories: Object.keys(TextQuestionData.value).map((key) => {
                switch (key) {
                  case "马克思主义基本原理":
                    return "马原";
                  case "毛泽东思想和中国特色社会主义理论体系概论":
                    return "毛概";
                  case "思想道德与法治":
                    return "思修";
                  case "习近平新时代中国特色社会主义思想概论":
                    return "新思想";
                  case "中国近现代史纲要":
                    return "史纲";
                  default:
                    return key;
                }
              }),
              series: [
                {
                  name: "各部分掌握程度",
                  data: Object.values(userKnowledgeMatrix.value)
                  // data: ["0.8", "0.2", "0.3", "0.5", "0.9"]
                }
              ]
            };
            break;
          default:
            res = {
              categories: [],
              series: []
            };
        }
        drawCharts("vGFteXjWCighLkllIOEFoejLdWPqkxzn", res);
      }, 500);
    };
    const drawCharts = (id, data) => {
      const ctx = common_vendor.index.createCanvasContext(id, common_vendor.getCurrentInstance());
      uChartsInstance[id] = new common_vendor.uCharts({
        type: "line",
        context: ctx,
        width: cWidth.value,
        height: cHeight.value,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 10, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "hollow"
          }
        }
      });
    };
    const tap = (e) => {
      uChartsInstance[e.target.id].touchLegend(e);
      uChartsInstance[e.target.id].showToolTip(e);
    };
    const changeTab = (tab) => {
      activeTab.value = tab;
      getServerData();
    };
    const navigateToRecommendPage = () => {
      console.log("userInfo", userInfo.value);
      const userId = userInfo.value.userId;
      if (userId) {
        common_vendor.index.navigateTo({
          // url: `/pages/commend/commendPractice`
          url: `/pages/commend/commendPractice?userId=${userId}`
        });
      } else {
        console.error("用户ID未获取到");
      }
    };
    const userSimilarity = common_vendor.ref([]);
    const getUserSimilarity = async () => {
      try {
        let result = await proxy.Request({
          url: proxy.Api.calculateTopNUserSimilarity,
          showLoading: false,
          header: {
            token: userInfo.value.token
            // 假设 userInfo 中包含 token
          }
        });
        if (!result) {
          console.error("Failed to get user similarity:", result);
          return;
        }
        userSimilarity.value = result.data || [];
        console.log("userSimilarity.value", userSimilarity.value);
      } catch (error) {
        console.error("Error fetching user similarity:", error);
      }
    };
    common_vendor.onMounted(() => {
      cWidth.value = common_vendor.index.getSystemInfoSync().windowWidth;
      cHeight.value = common_vendor.index.upx2px(500);
      getUserKnowledgeMatrix();
    });
    common_vendor.onShow(() => {
      getUserInfo();
      getServerData();
      getUserSimilarity();
      getTextQuestionData();
      getExamStatistics();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: false,
          title: "学习统计"
        }),
        b: common_vendor.t(userInfo.value.score),
        c: common_vendor.t(userInfo.value.amount),
        d: common_vendor.f(weekDays, (day, index, i0) => {
          return {
            a: common_vendor.n(isDaySigned(day) ? "signed" : ""),
            b: common_vendor.t(day),
            c: index
          };
        }),
        e: common_assets._imports_0,
        f: common_vendor.t(isSignedIn.value ? "已签到" : "签到"),
        g: common_vendor.n(isSignedIn.value ? "sign-btn signed" : "sign-btn"),
        h: common_vendor.o(getSign),
        i: common_vendor.n(activeTab.value === "练习统计" ? "active-tab" : ""),
        j: common_vendor.o(($event) => changeTab("练习统计")),
        k: common_vendor.n(activeTab.value === "考试统计" ? "active-tab" : ""),
        l: common_vendor.o(($event) => changeTab("考试统计")),
        m: common_vendor.n(activeTab.value === "综合评估" ? "active-tab" : ""),
        n: common_vendor.o(($event) => changeTab("综合评估")),
        o: common_vendor.o(tap),
        p: common_vendor.f(weakPoint.value, (point, index, i0) => {
          return {
            a: common_vendor.t(point),
            b: index
          };
        }),
        q: common_vendor.f(nonePoint.value, (point, index, i0) => {
          return {
            a: common_vendor.t(point),
            b: index
          };
        }),
        r: common_vendor.o(navigateToRecommendPage),
        s: common_vendor.p({
          currentIndex: 3
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f46d48b2"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/commend/commendIndex.vue"]]);
wx.createPage(MiniProgramPage);
