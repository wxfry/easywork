"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_appInfo = require("../../stores/appInfo.js");
if (!Array) {
  const _component_Dialog = common_vendor.resolveComponent("Dialog");
  _component_Dialog();
}
const _sfc_main = {
  __name: "Update",
  setup(__props, { expose }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const { deviceId, appVersion } = appInfoStore.getInfo();
    const checkDialogRef = common_vendor.ref();
    const updateInfo = common_vendor.ref({});
    const checkUpdate = async (showTips) => {
      downloading.value = false;
      let result = await proxy.Request({
        url: proxy.Api.checkUpdate,
        showLoading: showTips,
        params: {
          deviceId,
          appVersion
        }
      });
      if (!result) {
        return;
      }
      if (result.data == null) {
        if (showTips) {
          proxy.Message.success("已经是最新版");
        }
        return;
      }
      updateInfo.value = result.data;
      checkDialogRef.value.show();
    };
    const downloading = common_vendor.ref(false);
    const downloadPercent = common_vendor.ref({
      progress: 0,
      totalBytesWritten: 0,
      totalBytesExpectedToWrite: 0
    });
    const updateApp = () => {
      downloading.value = true;
      let downloadTask = common_vendor.index.downloadFile({
        url: proxy.Api.domain + proxy.Api.downloadApp + "?id=" + updateInfo.value.id,
        success: (downloadResult) => {
          if (downloadResult.statusCode == 200) {
            close();
            plus.runtime.install(
              downloadResult.tempFilePath,
              { force: false },
              function() {
                plus.nativeUI.toast("安装成功");
                plus.runtime.restart();
              },
              function(e) {
                plus.nativeUI.toast("安装失败");
              }
            );
          }
        }
      });
      downloadTask.onProgressUpdate((res) => {
        downloadPercent.value = res;
      });
    };
    expose({ checkUpdate });
    const close = () => {
      checkDialogRef.value.close();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_vendor.t(updateInfo.value.version),
        c: common_vendor.t(common_vendor.unref(proxy).Utils.size2Str(updateInfo.value.size)),
        d: common_vendor.f(updateInfo.value.updateList, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item)
          };
        }),
        e: downloading.value
      }, downloading.value ? {
        f: downloadPercent.value.progress,
        g: common_vendor.t(common_vendor.unref(proxy).Utils.size2Str(downloadPercent.value.totalBytesWritten)),
        h: common_vendor.t(common_vendor.unref(proxy).Utils.size2Str(downloadPercent.value.totalBytesExpectedToWrite))
      } : {}, {
        i: !downloading.value
      }, !downloading.value ? {
        j: common_vendor.o(updateApp)
      } : {}, {
        k: !downloading.value
      }, !downloading.value ? {
        l: common_vendor.o(close)
      } : {}, {
        m: common_vendor.sr(checkDialogRef, "a7c235a9-0", {
          "k": "checkDialogRef"
        }),
        n: common_vendor.p({
          styleBg: "none",
          styleBorder: "none",
          showCancel: false
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a7c235a9"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/Update.vue"]]);
wx.createComponent(Component);
