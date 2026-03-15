"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_Navbar + _easycom_uni_grid_item2 + _easycom_uni_grid2 + _easycom_uni_popup2)();
}
const _easycom_uni_grid_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-grid/uni-grid.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_grid_item + _easycom_uni_grid + _easycom_uni_popup + MyEditInfo + Update + NavbarFooter)();
}
const MyEditInfo = () => "./MyEditInfo.js";
const Update = () => "../components/Update.js";
const NavbarFooter = () => "../components/common/NavbarFooter.js";
const _sfc_main = {
  __name: "MyIndex",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const reminderPopup = common_vendor.ref();
    const timeValue = common_vendor.ref([0, 0]);
    const selectedTime = common_vendor.reactive({
      hour: 0,
      minute: 0
    });
    const timeChange = (e) => {
      const val = e.detail.value;
      selectedTime.hour = val[0];
      selectedTime.minute = val[1];
    };
    const showReminderPopup = () => {
      const savedTime = common_vendor.index.getStorageSync("studyReminderTime");
      if (savedTime) {
        timeValue.value = [savedTime.hour, savedTime.minute];
        selectedTime.hour = savedTime.hour;
        selectedTime.minute = savedTime.minute;
      }
      reminderPopup.value.open();
    };
    const closeReminder = () => {
      reminderPopup.value.close();
    };
    const saveReminder = () => {
      common_vendor.index.setStorageSync("studyReminderTime", {
        hour: selectedTime.hour,
        minute: selectedTime.minute
      });
      if (common_vendor.wx$1.requestSubscribeMessage) {
        common_vendor.wx$1.requestSubscribeMessage({
          tmplIds: ["你的模板ID"],
          // 需要替换为实际模板ID
          success(res) {
            if (res["你的模板ID"] === "accept")
              ;
          }
        });
      }
      common_vendor.index.showToast({
        title: "提醒设置成功",
        icon: "none"
      });
      closeReminder();
    };
    const updateRef = common_vendor.ref();
    const checkUpdate = () => {
      updateRef.value.checkUpdate(true);
    };
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
    const collectList = common_vendor.ref([
      {
        text: "背诵",
        icon: "icon-question",
        path: "/pages/my/CollectQuestion",
        color: "#a294e8",
        needLogin: true
      },
      {
        text: "考题",
        icon: "icon-exam1",
        path: "/pages/my/CollectExamQuestionList",
        color: "#a294e8",
        needLogin: true
      }
    ]);
    const accumulationList = common_vendor.ref([
      {
        text: "我的考试",
        icon: "icon-exam1",
        color: "#a294e8",
        path: "/pages/my/ExamList",
        needLogin: true
      },
      {
        text: "我的错题集",
        icon: "icon-wrong-question",
        color: "#a294e8",
        path: "/pages/my/WrongQuestionList",
        needLogin: true
      }
    ]);
    common_vendor.ref(null);
    Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
    common_vendor.ref("00");
    common_vendor.ref("00");
    const serviceList = common_vendor.ref([
      {
        text: "问题反馈",
        icon: "icon-email",
        path: "/pages/my/Feedback",
        color: "#6e80e5",
        needLogin: true
      },
      {
        text: "检查更新",
        icon: "icon-update",
        color: "#6e80e5",
        needLogin: false,
        clickFun: checkUpdate
      },
      {
        text: "学习提醒",
        icon: "icon-share",
        color: "#6e80e5",
        needLogin: true,
        clickFun: showReminderPopup
        // 修改为直接调用函数
      }
    ]);
    const logout = () => {
      proxy.Confirm("确定要退出吗？", () => {
        common_vendor.index.removeStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
        userInfo.value = {};
      });
    };
    const goLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/account/LoginAndRegister"
      });
    };
    const uploadAvatar = () => {
      common_vendor.index.chooseImage({
        mediaType: ["image"],
        sourceType: ["camera", "album"],
        sizeType: ["compressed"],
        count: 1,
        success: function(res) {
          let header = {
            token: common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key)
          };
          common_vendor.index.showLoading();
          common_vendor.index.uploadFile({
            url: proxy.Api.domain + proxy.Api.uploadAvatar,
            filePath: res.tempFilePaths[0],
            name: "file",
            header,
            complete: (e) => {
              common_vendor.index.hideLoading();
              getUserInfo();
              common_vendor.index.setStorageSync(
                utils_Constants.LOCAL_STORAGE_KEY.avatar.key,
                new Date().getTime()
              );
            }
          });
        }
      });
    };
    const avatarLastUpdate = common_vendor.ref(0);
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
      avatarLastUpdate.value = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.avatar.key);
    };
    const myEditInfoRef = common_vendor.ref();
    const editInfo = () => {
      myEditInfoRef.value.show(userInfo.value);
    };
    common_vendor.onShow(() => {
      getUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          showLeft: false,
          title: "个人中心"
        }),
        b: Object.keys(userInfo.value).length === 0
      }, Object.keys(userInfo.value).length === 0 ? {
        c: common_vendor.o(goLogin)
      } : common_vendor.e({
        d: userInfo.value.avatar
      }, userInfo.value.avatar ? {
        e: common_vendor.o(uploadAvatar),
        f: `${common_vendor.unref(proxy).Api.domain}${common_vendor.unref(proxy).Api.imageUrl}${userInfo.value.avatar}?${avatarLastUpdate.value}`
      } : {
        g: common_vendor.t(userInfo.value.nickName.split("")[0]),
        h: common_vendor.o(uploadAvatar)
      }), {
        i: Object.keys(userInfo.value).length > 0
      }, Object.keys(userInfo.value).length > 0 ? common_vendor.e({
        j: common_vendor.t(userInfo.value.nickName),
        k: common_vendor.o(editInfo),
        l: common_vendor.o(logout),
        m: userInfo.value.sex == null
      }, userInfo.value.sex == null ? {} : {}, {
        n: userInfo.value.sex == 1
      }, userInfo.value.sex == 1 ? {} : {}, {
        o: userInfo.value.sex == 0
      }, userInfo.value.sex == 0 ? {} : {}, {
        p: common_vendor.t(common_vendor.unref(proxy).Utils.dateformat(userInfo.value.joinTime))
      }) : {}, {
        q: common_vendor.f(collectList.value, (item, index, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: item.color,
            c: common_vendor.t(item.text),
            d: index,
            e: common_vendor.o(($event) => jump(item), index),
            f: "93109bc9-2-" + i0 + ",93109bc9-1",
            g: common_vendor.p({
              index
            })
          };
        }),
        r: common_vendor.p({
          column: 2,
          ["show-border"]: false,
          square: false
        }),
        s: common_vendor.f(accumulationList.value, (item, index, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: item.color,
            c: common_vendor.t(item.text),
            d: index,
            e: common_vendor.o(($event) => jump(item), index),
            f: "93109bc9-4-" + i0 + ",93109bc9-3",
            g: common_vendor.p({
              index
            })
          };
        }),
        t: common_vendor.p({
          column: 2,
          ["show-border"]: false,
          square: false
        }),
        v: common_vendor.f(serviceList.value, (item, index, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: item.color,
            c: common_vendor.t(item.text),
            d: index,
            e: common_vendor.o(($event) => jump(item), index),
            f: "93109bc9-6-" + i0 + ",93109bc9-5",
            g: common_vendor.p({
              index
            })
          };
        }),
        w: common_vendor.p({
          column: 3,
          ["show-border"]: false,
          square: false
        }),
        x: common_vendor.f(24, (hour, k0, i0) => {
          return {
            a: common_vendor.t(hour - 1),
            b: hour
          };
        }),
        y: common_vendor.f(60, (minute, k0, i0) => {
          return {
            a: common_vendor.t(minute - 1),
            b: minute
          };
        }),
        z: timeValue.value,
        A: common_vendor.o(timeChange),
        B: common_vendor.o(closeReminder),
        C: common_vendor.o(saveReminder),
        D: common_vendor.sr(reminderPopup, "93109bc9-7", {
          "k": "reminderPopup"
        }),
        E: common_vendor.p({
          type: "center",
          ["is-mask-click"]: false
        }),
        F: common_vendor.sr(myEditInfoRef, "93109bc9-8", {
          "k": "myEditInfoRef"
        }),
        G: common_vendor.o(getUserInfo),
        H: common_vendor.sr(updateRef, "93109bc9-9", {
          "k": "updateRef"
        }),
        I: common_vendor.p({
          currentIndex: 4
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93109bc9"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/MyIndex.vue"]]);
wx.createPage(MiniProgramPage);
