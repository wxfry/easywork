<template>
  <view>
    <Navbar :showLeft="false" title="个人中心"></Navbar>
    <view class="user-body">
      <view class="base-info">
        <view class="avatar">
          <view
              v-if="Object.keys(userInfo).length === 0"
              @click="goLogin"
              class="avatar-no-img no-login"
          >未登录</view
          >
          <template v-else>
            <image
                class="avatar-img"
                v-if="userInfo.avatar"
                @click="uploadAvatar"
                :src="`${proxy.Api.domain}${proxy.Api.imageUrl}${userInfo.avatar}?${avatarLastUpdate}`"
                mode="aspectFit"
            ></image>
            <view class="avatar-no-img" @click="uploadAvatar" v-else>{{
                userInfo.nickName.split("")[0]
              }}</view>
          </template>
        </view>
        <view class="user-info" v-if="Object.keys(userInfo).length > 0">
          <view class="nick-name">
            <view>{{ userInfo.nickName }}</view>
            <view class="iconfont icon-edit" @click="editInfo"></view>
            <view class="iconfont icon-logout" @click="logout"></view>
          </view>
          <view class="join-time">
            <view class="sex">
              <view v-if="userInfo.sex == null">未知</view>
              <view v-if="userInfo.sex == 1">男</view>
              <view v-if="userInfo.sex == 0">女</view>
            </view>
            <view class="line">|</view>
            {{ proxy.Utils.dateformat(userInfo.joinTime) }} 加入
          </view>
        </view>
      </view>

      <view class="part-list">
        <view class="part-title collect">收藏</view>
        <view class="item-list">
          <uni-grid :column="2" :show-border="false" :square="false">
            <uni-grid-item
                v-for="(item, index) in collectList"
                :index="index"
                :key="index"
                @click="jump(item)"
            >
              <view class="item">
                <view
                    :class="['iconfont', item.icon]"
                    :style="{ color: item.color }"
                ></view>
                <view class="text">{{ item.text }}</view>
              </view>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>

      <view class="part-list">
        <view class="part-title collect">积累</view>
        <view class="item-list">
          <uni-grid :column="2" :show-border="false" :square="false">
            <uni-grid-item
                v-for="(item, index) in accumulationList"
                :index="index"
                :key="index"
                @click="jump(item)"
            >
              <view class="item">
                <view
                    :class="['iconfont', item.icon]"
                    :style="{ color: item.color }"
                ></view>
                <view class="text">{{ item.text }}</view>
              </view>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
      <view class="part-list">
        <view class="part-title collect">服务</view>
        <view class="item-list">
          <uni-grid :column="2" :show-border="false" :square="false">
            <uni-grid-item
                v-for="(item, index) in serviceList"
                :index="index"
                :key="index"
                @click="jump(item)"
            >
              <view class="item">
                <view
                    :class="['iconfont', item.icon]"
                    :style="{ color: item.color }"
                ></view>
                <view class="text">{{ item.text }}</view>
              </view>
            </uni-grid-item>
          </uni-grid>
        </view>
      </view>
    </view>

    <!-- 学习提醒弹窗 -->
    <uni-popup ref="reminderPopup" type="center" :is-mask-click="false">
      <view class="reminder-popup">
        <view class="popup-title">设置学习提醒</view>
        <view class="time-picker">
          <picker-view :value="timeValue" @change="timeChange" class="picker-view">
            <picker-view-column>
              <view class="picker-item" v-for="hour in 24" :key="hour">{{ hour - 1 }}时</view>
            </picker-view-column>
            <picker-view-column>
              <view class="picker-item" v-for="minute in 60" :key="minute">{{ minute - 1 }}分</view>
            </picker-view-column>
          </picker-view>
        </view>
        <view class="popup-buttons">
          <button class="cancel-btn" @click="closeReminder">取消</button>
          <button class="confirm-btn" @click="saveReminder">确定</button>
        </view>
      </view>
    </uni-popup>

    <MyEditInfo ref="myEditInfoRef" @reload="getUserInfo"></MyEditInfo>
    <Update ref="updateRef"></Update>
  </view>
<!--  <NavbarFooter :currentIndex="4" />-->
</template>

<script setup>
import MyEditInfo from "./MyEditInfo.vue";
import Update from "@/pages/components/Update.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
import { LOCAL_STORAGE_KEY } from "@/utils/Constants.js";
import NavbarFooter from "../components/common/NavbarFooter.vue";

// 学习提醒相关代码
const reminderPopup = ref();
const timeValue = ref([0, 0]); // 默认0时0分
const selectedTime = reactive({
  hour: 0,
  minute: 0
});

const timeChange = (e) => {
  const val = e.detail.value;
  selectedTime.hour = val[0];
  selectedTime.minute = val[1];
};

const showReminderPopup = () => {
  // 从本地存储加载之前设置的时间
  const savedTime = uni.getStorageSync('studyReminderTime');
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
  uni.setStorageSync('studyReminderTime', {
    hour: selectedTime.hour,
    minute: selectedTime.minute
  });

  // 获取当前时间 + 设置的时间，生成一个精确的时间戳
  function getTomorrowTimestamp(hour, minute) {
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0); // 设置为当天指定时间

    // 如果已经过了这个时间，则设置为第二天
    if (now.getTime() >= target.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    return Math.floor(target.getTime() / 1000); // 返回秒级时间戳
  }

  const triggerTime = getTomorrowTimestamp(selectedTime.hour, selectedTime.minute);

  // 创建一个定时器，在目标时间执行 showAlarmMsg()
  const interval = 24 * 60 * 60 * 1000; // 每天执行一次
  const timerId = setInterval(() => {
    showAlarmMsg(); // 触发 NativeMsg 弹窗
  }, interval);

  // 首次执行后也保存 timerId 到全局变量中
  uni.setStorageSync('dailyReminderTimer', timerId);

  // 设置本地通知（兼容小程序和APP）
  // 使用 local notification 做唤醒作用（仅 APP-PLUS）
  // #ifdef APP-PLUS
  // APP端使用原生通知
  plus.push.scheduleLocalNotification({
    title: '学习提醒',
    content: '学习时间到啦！记得去学习哦~',
    trigger: { type: 'time', time: new Date(triggerTime * 1000) },
    payload: 'studyReminder'
  });
  // #endif

  // 关闭弹窗
  uni.showToast({
    title: '提醒设置成功',
    icon: 'none'
  });
  closeReminder();
};

onLoad(() => {
  const savedTime = uni.getStorageSync('studyReminderTime');
  if (savedTime) {
    selectedTime.hour = savedTime.hour;
    selectedTime.minute = savedTime.minute;

    // 恢复定时器
    const timerId = uni.getStorageSync('dailyReminderTimer');
    if (timerId) {
      clearInterval(timerId); // 先清除可能存在的旧定时器
    }

    const interval = 24 * 60 * 60 * 1000;
    const newTimerId = setInterval(() => {
      showAlarmMsg(); // 每天触发 NativeMsg 弹窗
    }, interval);

    uni.setStorageSync('dailyReminderTimer', newTimerId);
  }
});

// 学习提醒弹窗相关
const reminderPopupRef = ref(null);
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const selectedHour = ref('00');
const selectedMinute = ref('00');

const openReminderPopup = async () => {
  await nextTick();
  reminderPopupRef.value.open();
  // 强制更新 picker 组件
  await nextTick(() => {
    selectedHour.value = selectedHour.value;
    selectedMinute.value = selectedMinute.value;
  });
};

import { createAlarm } from "@/utils/nativeMsg";
// 定义一个全局变量保存 NativeMsg 实例
let alarmMsgInstance = null;
function showAlarmMsg() {
  console.log(" ====> 显示学习提醒");

  // #ifdef APP-PLUS
  if (alarmMsgInstance && alarmMsgInstance.getStatus() === "active") {
    let _oldIns = alarmMsgInstance;
    alarmMsgInstance = null;
    setTimeout(() => {
      _oldIns.hide();
    }, 300);
  }

  alarmMsgInstance = createAlarm({
    alarmId: "fixed_study_reminder",
    warningTypeStr: "学习提醒",
    projectName: "",
    description: "今天学习了吗？记得去学习哦"
  }, res => {
    const { type, result } = res;
    if (type === "move") return;
    uni.navigateTo({
      url: `/pages/classification/Classify`
    });
  });
  // #endif
}

const updateRef = ref();
const checkUpdate = () => {
  updateRef.value.checkUpdate(true);
};

const jump = (item) => {
  if (item.needLogin) {
    const token = uni.getStorageSync(LOCAL_STORAGE_KEY.token.key);
    if (token == "" || token == null) {
      uni.navigateTo({
        url: "/pages/account/LoginAndRegister",
      });
      return;
    }
  }
  if (item.clickFun) {
    item.clickFun();
    return;
  }
  uni.navigateTo({
    url: item.path,
  });
};

const collectList = ref([
  {
    text: "背诵",
    icon: "icon-question",
    path: "/pages/my/CollectQuestion",
    color: "#a294e8",
    needLogin: true,
  },
  {
    text: "考题",
    icon: "icon-exam1",
    path: "/pages/my/CollectExamQuestionList",
    color: "#a294e8",
    needLogin: true,
  },
]);

const accumulationList = ref([
  {
    text: "我的考试",
    icon: "icon-exam1",
    color: "#a294e8",
    path: "/pages/my/ExamList",
    needLogin: true,
  },
  {
    text: "我的错题集",
    icon: "icon-wrong-question",
    color: "#a294e8",
    path: "/pages/my/WrongQuestionList",
    needLogin: true,
  },
]);

const serviceList = ref([
  {
    text: "问题反馈",
    icon: "icon-email",
    path: "/pages/my/Feedback",
    color: "#6e80e5",
    needLogin: true,
  },
  {
    text: "检查更新",
    icon: "icon-update",
    color: "#6e80e5",
    needLogin: false,
    clickFun: checkUpdate,
  },
  // {
  //   text: "学习提醒",
  //   icon: "icon-share",
  //   color: "#6e80e5",
  //   needLogin: true,
  //   clickFun: showReminderPopup, // 修改为直接调用函数
  // },
]);

//退出
const logout = () => {
  proxy.Confirm("确定要退出吗？", () => {
    uni.removeStorageSync(LOCAL_STORAGE_KEY.token.key);
    userInfo.value = {};
  });
};
const goLogin = () => {
  uni.navigateTo({
    url: "/pages/account/LoginAndRegister",
  });
};

//更新头像
const uploadAvatar = () => {
  uni.chooseImage({
    mediaType: ["image"],
    sourceType: ["camera", "album"],
    sizeType: ["compressed"],
    count: 1,
    success: function (res) {
      let header = {
        token: uni.getStorageSync(LOCAL_STORAGE_KEY.token.key),
      };
      uni.showLoading();
      uni.uploadFile({
        url: proxy.Api.domain + proxy.Api.uploadAvatar,
        filePath: res.tempFilePaths[0],
        name: "file",
        header,
        complete: (e) => {
          uni.hideLoading();
          getUserInfo();
          uni.setStorageSync(
              LOCAL_STORAGE_KEY.avatar.key,
              new Date().getTime()
          );
        },
      });
    },
  });
};

const avatarLastUpdate = ref(0);
const userInfo = ref({});
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getUserInfo,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data || {};
  console.log("userInfo.value", userInfo.value);
  avatarLastUpdate.value = uni.getStorageSync(LOCAL_STORAGE_KEY.avatar.key);
};

//修改用户信息
const myEditInfoRef = ref();
const editInfo = () => {
  myEditInfoRef.value.show(userInfo.value);
};

onShow(() => {
  getUserInfo();
});
</script>

<style>
page {
  background: #f3f3f3;
}
</style>
<style lang="scss" scoped>
.user-body {
  padding: 40px 8px 10px 8px;
  .base-info {
    background: #fff;
    border-radius: 10px;
    position: relative;
    padding: 30px 10px 10px 10px;
    .icon-logout {
      font-size: 18px;
      font-weight: bold;
      position: absolute;
      top: 10px;
      right: 10px;
      color: #949292;
    }
    .avatar {
      position: absolute;
      left: 30px;
      top: -30px;
      border: 3px solid #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 60px;
      height: 60px;
      border-radius: 30px;
      .avatar-img {
        background: #d6d6d6;
      }
      .avatar-no-img {
        width: 100%;
        height: 100%;
        font-size: 20px;
        font-weight: bold;
        background: #8806b8;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .no-login {
        font-size: 13px;
      }
    }
    .user-info {
      margin-top: 5px;
      .nick-name {
        display: flex;
        .icon-edit {
          margin-left: 5px;
          margin-top: 3px;
        }
      }
      .join-time {
        color: #a2a2a2;
        font-size: 12px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        .sex {
          margin-top: 3px;
        }
        .line {
          padding: 0px 5px;
        }
      }
    }
    .collect {
      margin-top: 20px;
    }
  }
}

.part-list {
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  padding: 10px 10px 0px 10px;
  .part-title {
    margin-top: 5px;
    font-weight: bold;
  }
  .item-list {
    .item {
      text-align: center;
      padding: 20px;
      width: 100%;
      margin-right: 20px;
      &:last-child {
        margin-right: 0px;
      }
      .iconfont {
        color: #949292;
        font-size: 40px;
        align-items: center;
        margin: 0px auto;
        display: inline-block;
      }
      .text {
        margin-top: 5px;
        color: #3a3939;
      }
    }
    .item:last-child {
      margin-right: 0px;
    }
  }
}

.icon-exam1 {
  font-weight: bold;
}

.reminder-popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.reminder-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.reminder-time {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.colon {
  font-size: 24px;
  margin: 0 10px;
}

.reminder-buttons {
  display: flex;
  justify-content: center;
}

.reminder-buttons button {
  margin: 0 10px;
}

/* 学习提醒弹窗样式 */
.reminder-popup {
  width: 80vw;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;

  .popup-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }

  .time-picker {
    height: 200px;
    margin-bottom: 20px;

    .picker-view {
      width: 100%;
      height: 100%;
    }

    .picker-item {
      line-height: 40px;
      text-align: center;
      font-size: 16px;
    }
  }

  .popup-buttons {
    display: flex;
    justify-content: space-between;

    button {
      flex: 1;
      margin: 0 10px;
      font-size: 16px;
      border-radius: 6px;

      &.cancel-btn {
        background-color: #f1f1f1;
        color: #333;
      }

      &.confirm-btn {
        background-color: #6e80e5;
        color: #fff;
      }
    }
  }
}
</style>