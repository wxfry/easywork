"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_Constants = require("./utils/Constants.js");
const stores_appInfo = require("./stores/appInfo.js");
const stores_questionCategory = require("./stores/questionCategory.js");
const stores_bookCategory = require("./stores/bookCategory.js");
const utils_Message = require("./utils/Message.js");
const utils_Request = require("./utils/Request.js");
const utils_Api = require("./utils/Api.js");
const utils_Utils = require("./utils/Utils.js");
const utils_Confirm = require("./utils/Confirm.js");
if (!Math) {
  "./pages/Index.js";
  "./pages/question/QuestionIndex.js";
  "./pages/question/QuestionList.js";
  "./pages/question/QuestionDetail.js";
  "./pages/exam/ExamIndex.js";
  "./pages/exam/ExamQuestion.js";
  "./pages/share/ShareIndex.js";
  "./pages/share/ShareDetail.js";
  "./pages/my/MyIndex.js";
  "./pages/my/CollectQuestion.js";
  "./pages/my/CollectExamQuestionList.js";
  "./pages/my/CollectExamQuestion.js";
  "./pages/my/ExamList.js";
  "./pages/my/WrongExamQuestion.js";
  "./pages/my/WrongQuestionList.js";
  "./pages/my/WrongQuestionText.js";
  "./pages/my/Feedback.js";
  "./pages/my/FeedbackReply.js";
  "./pages/account/LoginAndRegister.js";
  "./pages/carousel/ExamQuestion.js";
  "./pages/carousel/WebView.js";
  "./pages/search/SearchIndex.js";
  "./pages/search/QuestionItem.js";
  "./pages/search/Questions.js";
  "./pages/classification/Classify.js";
  "./pages/classification/ClassifyBook.js";
  "./pages/classification/ClassifyList.js";
  "./pages/classification/TestQuestion.js";
  "./pages/classification/QuestionDetail.js";
  "./pages/classification/TextDetail.js";
  "./pages/classification/HistoryIndex.js";
  "./pages/commend/commendIndex.js";
  "./pages/commend/commendPractice.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const quesitonCategoryStore = stores_questionCategory.useQuestionCategoryStore();
    const bookCategoryStore = stores_bookCategory.useBookCategoryStore();
    const saveDeviceInfo = (e) => {
      let statusBar = 0;
      statusBar = e.statusBarHeight;
      if (e.platform === "android")
        ;
      statusBar = e.statusBarHeight;
      const navBarHeight = 45;
      const deviceId = e.deviceId;
      const deviceBrand = e.deviceBrand;
      appInfoStore.setInfo(
        statusBar,
        navBarHeight,
        e.screenWidth,
        e.screenHeight,
        deviceId,
        deviceBrand,
        e.appWgtVersion
      );
      reportInfo({ deviceId, deviceBrand });
      autoLogin({ deviceId, deviceBrand });
    };
    const reportInfo = async ({ deviceId, deviceBrand }) => {
      await proxy.Request({
        url: proxy.Api.report,
        showLoading: false,
        showError: false,
        params: {
          deviceId,
          deviceBrand
        }
      });
    };
    const autoLogin = async ({ deviceId, deviceBrand }) => {
      let token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
      if (token == "") {
        return;
      }
      let result = await proxy.Request({
        url: proxy.Api.autoLogin,
        showLoading: false,
        showError: false,
        params: {
          token,
          deviceId,
          deviceBrand
        }
      });
      if (!result) {
        return;
      }
      if (result.data != null) {
        common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key, result.data);
      }
    };
    const loadCategoryData = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadAllCategory,
        params: {
          type: 0
        },
        showLoading: false
      });
      if (!result) {
        return;
      }
      quesitonCategoryStore.setInfo(result.data);
    };
    const loadBookCategoryData = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadAllCategory,
        params: {
          type: 2
        },
        showLoading: false
      });
      if (!result) {
        return;
      }
      bookCategoryStore.setInfo(result.data);
    };
    common_vendor.onLaunch(() => {
      common_vendor.index.getSystemInfo({
        // uni.getSystemSetting({
        success: (e) => {
          saveDeviceInfo(e);
        }
      });
      loadCategoryData();
    });
    common_vendor.onLaunch(() => {
      common_vendor.index.getSystemInfo({
        // uni.getSystemSetting({
        success: (e) => {
          saveDeviceInfo(e);
        }
      });
      loadBookCategoryData();
    });
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/App.vue"]]);
const Navbar = () => "./pages/components/common/Navbar.js";
const DataList = () => "./pages/components/common/DataList.js";
const Popup = () => "./pages/components/common/Popup.js";
const ShowTips = () => "./pages/components/common/ShowTips.js";
const Footer = () => "./pages/components/common/Footer.js";
const SlidePage = () => "./pages/components/common/SlidePage.js";
const Dialog = () => "./pages/components/common/Dialog.js";
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.createPinia());
  app.component("Navbar", Navbar);
  app.component("DataList", DataList);
  app.component("Popup", Popup);
  app.component("ShowTips", ShowTips);
  app.component("Footer", Footer);
  app.component("SlidePage", SlidePage);
  app.component("Dialog", Dialog);
  app.config.globalProperties.Message = utils_Message.message;
  app.config.globalProperties.Request = utils_Request.request;
  app.config.globalProperties.Api = utils_Api.api;
  app.config.globalProperties.Utils = utils_Utils.Utils;
  app.config.globalProperties.Confirm = utils_Confirm.confirm;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
