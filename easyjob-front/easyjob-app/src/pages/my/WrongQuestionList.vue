<template>
  <view>
    <Navbar :showLeft="true" title="错题列表"></Navbar>

    <!-- 添加错题练习按钮 -->
    <view class="btn-panel">
      <button type="primary" @click="showPopup">点击这里进行错题练习</button>
    </view>

    <!-- 错题练习选择弹框 -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content">
        <view>
          <label>请输入想要题目数量:</label>
          <label>(最小为1,默认为20)</label>
          <input type="number" v-model="questionCount" min="1" />
        </view>
        <view>
          <label>请选择练习模式(默认随机):</label>
<!--          <radio-group v-model="practiceMode" @change="onPracticeModeChange">-->
<!--            <label><radio value="random" /> 随机练习</label>-->
<!--            <label><radio value="sequential" /> 顺序练习</label>-->
<!--          </radio-group>-->
          <radio-group @change="onPracticeModeChange">
            <label>
              <radio value="random" :checked="practiceMode === 'random'" /> 随机练习
            </label>
            <label>
              <radio value="sequential" :checked="practiceMode === 'sequential'" /> 顺序练习
            </label>
          </radio-group>
        </view>
        <button type="primary" @click="startPractice">开始练习错题</button>
      </view>
    </uni-popup>

    <view class="question-list">

      <view class="question-list">
        <DataList
            :dataSource="dataSource"
            @loadData="loadDataList"
            :loadStatus="loadStatus"
        >
          <template #default="{ data }">
            <QuestionItem :data="data"></QuestionItem>
          </template>
        </DataList>
      </view>

    </view>
  </view>
</template>

<script setup>
import QuestionItem from "@/pages/my/WrongQuestionItem.vue";
import { LOCAL_STORAGE_KEY } from "@/utils/Constants.js";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
const { proxy } = getCurrentInstance();

const dataSource = ref({});
const loadStatus = ref(null);


const questionCount = ref(20); // 题目数量默认为20
const practiceMode = ref('random'); // 练习模式默认为随机练习
const popup = ref(null);

const loadDataList = async () => {
  loadStatus.value = "loading";
  let url = proxy.Api.myCollect;
  let result = await proxy.Request({
    url: proxy.Api.myWrongQuestion,
    showLoading: false,
    params: {
      pageNo: dataSource.value.pageNo,
    },
  });
  if (!result) {
    return;
  }
  loadStatus.value = "more";
  dataSource.value = result.data;
};

onLoad(() => {
  loadDataList();
});
onReachBottom(() => {});

// 显示弹框
const showPopup = () => {
  popup.value.open();
};

const startPractice = async () => {
  console.log('Selected practice mode:', practiceMode.value);

  const token = uni.getStorageSync(LOCAL_STORAGE_KEY.token.key);
  if (token == "" || token == null) {
    uni.navigateTo({
      url: "/pages/account/LoginAndRegister",
    });
  }

  let result = await proxy.Request({
    // url: proxy.Api.createExam,
    url: proxy.Api.createWrongText,
    params: {
      questionCount: questionCount.value,
      practiceMode: practiceMode.value,
    }
  });
  if (!result) {
    return;
  }
  uni.navigateTo({
    url: '/pages/my/WrongQuestionText?examId=' + result.data.examId,
  });
}

const onPracticeModeChange = (event) => {
  console.log('Practice mode changed to:', event.detail.value);
  practiceMode.value = event.detail.value;
}

</script>

<style lang="scss" scoped>
.question-list {
  padding: 10px;
  .list-item {
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
  }
}

.btn-panel {
  position: fixed;
  bottom: 0px;
  right: 0;
  uni-button[type="primary"] {
    background: #6e80e5;
  }
}

/* 添加弹框样式 */
.popup-content {
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  width: 100%;

  text-align: center;
  label {
    display: block;
    margin: 10px 0;
  }
  input {
    margin: 0 auto;
    width: 100px;
  }
  radio-group {
    //display: flex;
    justify-content: center;
    label {
      margin: 10px 10px;
    }
  }
}
</style>
