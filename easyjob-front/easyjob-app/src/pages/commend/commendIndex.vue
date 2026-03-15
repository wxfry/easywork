<template>
  <Navbar :showLeft="false" title="学习统计"></Navbar>
  <view class="container">
    <!-- 积分与签到部分 -->
    <view class="top-section">
      <view class="score">
        <text>我的积分</text>
        <text class="score-num">{{ userInfo.score }}</text>
      </view>
      <view class="sign-info">
        <text>已经连续签到 <text class="green-text">{{ userInfo.amount }}天</text></text>

        <view class="sign-days">
          <view v-for="(day, index) in weekDays" :key="index" class="sign-day">
            <image :class="['coin', isDaySigned(day) ? 'signed' : '']" src="@/static/integral.png" />
            <text class="day-text">{{ day }}</text>
          </view>
        </view>
      </view>
      <button :class="isSignedIn ? 'sign-btn signed' : 'sign-btn'" @click="getSign">{{ isSignedIn ? '已签到' : '签到' }}</button>
    </view>

    <!-- 图表部分 -->
    <view class="chart-section">
      <view class="tabs">
        <text :class="['nav-item', activeTab === '练习统计' ? 'active-tab' : '']" @click="changeTab('练习统计')">练习统计</text>
        <text :class="['nav-item', activeTab === '考试统计' ? 'active-tab' : '']" @click="changeTab('考试统计')">考试统计</text>
        <text :class="['nav-item', activeTab === '综合评估' ? 'active-tab' : '']" @click="changeTab('综合评估')">综合评估</text>
      </view>
    </view>
    <view>
      <canvas canvas-id="vGFteXjWCighLkllIOEFoejLdWPqkxzn" id="vGFteXjWCighLkllIOEFoejLdWPqkxzn" class="charts" @touchend="tap"/>
    </view>
    <!-- 新增部分 -->
    <view class="mastery-info">
      <text class="mastery-title">以下是你掌握度较低的部分：</text>
      <view v-for="(point, index) in weakPoint" :key="index" class="mastery-point">
        <text>{{ point }}</text>
      </view>
      <text class="mastery-title">以下是你尚未练习的部分：</text>
      <view v-for="(point, index) in nonePoint" :key="index" class="mastery-point">
        <text>{{ point }}</text>
      </view>
    </view>
    <view>
      <button class="recommend-btn" @click="navigateToRecommendPage">推荐练习</button>
    </view>
    <view class="tips">点击按钮，进行推荐练习</view>
  </view>
</template>

<script setup>
import uCharts from '@qiun/uni-ucharts/components/u-charts/u-charts';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad,onShow,onUnload } from "@dcloudio/uni-app";
import NavbarFooter from "../components/common/NavbarFooter.vue";

const { proxy } = getCurrentInstance();

const isSignedIn = ref(false); // 新增签到状态变量

// 获取积分(用户信息)
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

  // 判断签到日期是否为当天
  if (userInfo.value.signDate) {
    const signDate = new Date(userInfo.value.signDate);
    const today = new Date();
    if (signDate.getFullYear() === today.getFullYear() &&
        signDate.getMonth() === today.getMonth() &&
        signDate.getDate() === today.getDate()) {
      isSignedIn.value = true;
    } else {
      isSignedIn.value = false;
    }
  }
};

// 获取用户知识点掌握情况
const userKnowledgeMatrix = ref({});
const getUserKnowledgeMatrix = async () => {
  try {
    let result = await proxy.Request({
      url: proxy.Api.getUserKnowledgeMatrix,
      showLoading: false,
      header: {
        token: userInfo.value.token // 假设 userInfo 中包含 token
      }
    });
    if (!result) {
      console.error('Failed to get user knowledge matrix:', result);
      return;
    }
    userKnowledgeMatrix.value = result.data || {};
    // 对 userKnowledgeMatrix.value 的值进行格式化，保留两位小数
    for (let key in userKnowledgeMatrix.value) {
      if (typeof userKnowledgeMatrix.value[key] === 'number') {
        userKnowledgeMatrix.value[key] = parseFloat(userKnowledgeMatrix.value[key].toFixed(2));
      }
    }
    console.log("userKnowledgeMatrix.value", userKnowledgeMatrix.value);
    // 计算用户掌握度低于0.6的知识点
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
    console.error('Error fetching user knowledge matrix:', error);
  }
};

// 添加响应式变量
const weakPoint = ref([]);
const nonePoint = ref([]);
const subject = ref(["马克思主义基本原理", "中国近现代史纲要", "思想道德与法治", "习近平新时代中国特色社会主义思想概论", "毛泽东思想和中国特色社会主义理论体系概论"]);

const TextQuestionData = ref({});
const getTextQuestionData = async () => {
  try {
    let result = await proxy.Request({
      url: proxy.Api.getTextQuestionData,
      showLoading: false,
      header: {
        token: userInfo.value.token // 假设 userInfo 中包含 token
      }
    });
    if (!result) {
      console.error('Failed to get user knowledge matrix:', result);
      return;
    }
    TextQuestionData.value = result.data || {};
    console.log("TextQuestionData.value", TextQuestionData.value);
  } catch (error) {
    console.error('Error fetching user knowledge matrix:', error);
  }
};

const ExamStatistics = ref({});
const getExamStatistics = async () => {
  try {
    let result = await proxy.Request({
      url: proxy.Api.getExamStatistics,
      showLoading: false,
      header: {
        token: userInfo.value.token // 假设 userInfo 中包含 token
      }
    });
    if (!result) {
      console.error('Failed to get user knowledge matrix:', result);
      return;
    }
    ExamStatistics.value = result.data || {};
    console.log("ExamStatistics.value", ExamStatistics.value);
  } catch (error) {
    console.error('Error fetching user knowledge matrix:', error);
  }
};

// 定义一周的天数
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
console.log("weekDays======", weekDays);

// 判断某一天是否已经签到
const isDaySigned = (day) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const targetDay = weekDays.indexOf(day);
  if (dayOfWeek >= targetDay) {
    // 计算目标日期
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate() - (dayOfWeek - targetDay)).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    return signDetails.value[formattedDate] || false;
  }
  return false;
};

// 签到
const emit = defineEmits(["reload"]);
const getSign = async () => {
  if (isSignedIn.value == false) {
    let result = await proxy.Request({
      url: proxy.Api.sign,
      showLoading: false,
      params: {
        date: new Date().toISOString().split('T')[0]
      }
    });
    if (!result) {
      return;
    }
    console.log("result.data", result.data);
    if (result.data == 0) {
      isSignedIn.value = true; // 签到成功后刷新用户信息
      getUserInfo();
      getSignDetail();
      emit("reload");
    }
  }
};

const signDetails = ref({});

// 当月签到详情
const getSignDetail = async () => {
  let result = await proxy.Request({
    url: proxy.Api.signDetail,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  signDetails.value = result.data || {};
};
getSignDetail();

// 图表部分
const chartData = ref({});
const opts = ref({
  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [15,10,0,15],
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
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

const cWidth = ref(0);
const cHeight = ref(500);

const uChartsInstance = {};

const activeTab = ref('练习统计');

const getServerData = () => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    // 模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    let res = {};
    switch (activeTab.value) {
      case '练习统计':
        res = {
          // categories: ["马原","新思想", "史纲", "思修", "毛概"],
          categories: Object.keys(TextQuestionData.value).map(key => {
            switch (key) {
              case '马克思主义基本原理':
                return '马原';
              case '毛泽东思想和中国特色社会主义理论体系概论':
                return '毛概';
              case '思想道德与法治':
                return '思修';
              case '习近平新时代中国特色社会主义思想概论':
                return '新思想';
              case '中国近现代史纲要':
                return '史纲';
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
      case '考试统计':
        res = {
          categories: ["近五次", "近四次", "近三次", "近二次", "近一次"],
          series: [
            {
              name: "近5次考试正确率",
              data: Object.values(ExamStatistics.value)
              // data: ["0.42", "0.54", "0.56", "0.78", "0.95"]
            }
          ]
        };
        break;
      case '综合评估':
        res = {
          categories: Object.keys(userKnowledgeMatrix.value).map(key => {
            switch (key) {
              case '马克思主义基本原理':
                return '马原';
              case '毛泽东思想和中国特色社会主义理论体系概论':
                return '毛概';
              case '思想道德与法治':
                return '思修';
              case '习近平新时代中国特色社会主义思想概论':
                return '新思想';
              case '中国近现代史纲要':
                return '史纲';
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
    drawCharts('vGFteXjWCighLkllIOEFoejLdWPqkxzn', res);
  }, 500);
};

const drawCharts = (id, data) => {
  const ctx = uni.createCanvasContext(id, getCurrentInstance());
  uChartsInstance[id] = new uCharts({
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

// 跳转到推荐练习页面
const navigateToRecommendPage = () => {
  // 判断是否登录：userInfo.value 为空对象 {}
  if (Object.keys(userInfo.value).length === 0) {
    uni.showToast({
      title: '请先去登录',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  console.log("userInfo",userInfo.value);
  const userId = userInfo.value.userId; // 假设 userInfo 中包含用户ID
  if (userId) {
    uni.navigateTo({
      // url: `/pages/commend/commendPractice`
      url: `/pages/commend/commendPractice?userId=${userId}`
    });
  } else {
    console.error('用户ID未获取到');
  }
};

// 获取用户相似度数据
const userSimilarity = ref([]);

const getUserSimilarity = async () => {
  try {
    let result = await proxy.Request({
      url: proxy.Api.calculateTopNUserSimilarity,
      showLoading: false,
      header: {
        token: userInfo.value.token // 假设 userInfo 中包含 token
      }
    });
    if (!result) {
      console.error('Failed to get user similarity:', result);
      return;
    }
    userSimilarity.value = result.data || [];
    console.log("userSimilarity.value", userSimilarity.value);
  } catch (error) {
    console.error('Error fetching user similarity:', error);
  }
};

// 在组件挂载时初始化用户相似度数据
onMounted(() => {
  cWidth.value = uni.getSystemInfoSync().windowWidth;
  cHeight.value = uni.upx2px(500);
  getUserKnowledgeMatrix(); // 初始化时获取用户知识点掌握情况
});

onShow(() => {
  getUserInfo();
  getServerData();
  getUserSimilarity(); // 初始化时获取用户相似度数据
  getTextQuestionData(); // 获取图表练习数据
  getExamStatistics();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.top-section {
  background-color: #8a2be2;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
}

.score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-num {
  font-size: 24px;
  font-weight: bold;
}

.score-btn {
  background-color: #ffa500;
  padding: 1px 20px;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-right: 0px;
}

.sign-info {
  margin-top: 20px;
}

.green-text {
  color: green;
}

.sign-days {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.sign-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.coin {
  width: 30px;
  height: 30px;
}

.coin.signed {
  filter: grayscale(100%);
}

.day-text {
  font-size: 12px;
}

.sign-btn {
  margin-top: 10px;
  background-color: #ffa500;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
}

.sign-btn.signed {
  background-color: #d3d3d3;
}

.chart-section {
  margin-top: 20px;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.active-tab {
  color: red;
  border-bottom: 2px solid red;
}

.chart {
  width: 100%;
  height: 200px;
}

.chart-note {
  text-align: center;
  font-size: 14px;
}

.nav-item {
  text-align: center;
}

.icon {
  width: 24px;
  height: 24px;
  display: block;
}

.recommend-btn {
  margin-top: 10px;
  background: #6e80e5;
  color: white;
}

.tips {
  font-size: 14px;
  margin-top: 10px;
  color: #7f7f7f;
}

.charts{
  //width: 750rpx;
  width: 100%;
  height: 500rpx;
}

.mastery-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.mastery-title {
  font-size: 18px;
  font-weight: bold;
}

.mastery-point {
  margin-top: 5px;
}

.lowest-mastery {
  font-weight: bold;
  color: red;
}
</style>