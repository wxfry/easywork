<template>
  <view>
    <Navbar title="刷题练习">{{ categoryName }}</Navbar>

    <uni-collapse class="collapse" v-model="activeNames">
      <uni-collapse-item
          v-for="(item, index) in titleList"
          :key="index"
          :title="item.head"
          :show-animation="false"
          title-border:show
      >
        <view class="content-item" v-for="(item2, index2) in item.body" :key="index2">
          <view class="col-content" @click="showModeSelection(item.path[index2])">
            <text class="col-text">{{ item2 }}</text>
          </view>
        </view>
      </uni-collapse-item>
    </uni-collapse>

    <!-- 弹窗组件 -->
    <view class="modal" v-if="showModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">选择模式</text>
          <text class="modal-close" @click="closeModal">x</text>
        </view>
        <view class="modal-body">
          <view class="mode-option" @click="selectMode('brush')">背题模式</view>
          <view class="mode-option" @click="selectMode('practice')">继续练习</view>
          <view class="mode-option" @click="selectMode('newPractice')">新的练习</view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
import { useRoute } from 'vue-router';
import {LOCAL_STORAGE_KEY} from "../../utils/Constants";

const route = useRoute();

const { proxy } = getCurrentInstance();

const categoryName = ref('');

const getCategoryNameFromUrl = () => {
  const pages = getCurrentPages();
  console.log("pages", pages);
  const currentPage = pages[pages.length - 1];
  console.log("currentPage", currentPage);
  const options = currentPage.$page.options || {}; // 修改这里
  console.log("options", options);
  return options.id || ''; // 添加默认值
};

onMounted(() => {
  // categoryName.value = route.query.id;
  categoryName.value = getCategoryNameFromUrl();
  console.log("categoryName set to:", categoryName.value); // 调试信息
});


const titleList = ref([
  {
    head: '马克思主义基本原理',
    body: [],
    path: []
  },
  {
    head: '毛泽东思想和中国特色社会主义理论体系概论',
    body: [],
    path: []
  },
  {
    head: '习近平新时代中国特色社会主义思想概论',
    body: [],
    path: []
  },
  {
    head: '中国近现代史纲要',
    body: [],
    path: []
  },
  {
    head: '思想道德与法治',
    body: [],
    path: []
  }
])

const activeNames = ref([]);
const dataSource = ref({});
const loadStatus = ref(null);
const loadDataList = async () => {
  loadStatus.value = "loading";
  let result = await proxy.Request({
    url: proxy.Api.loadQuestion1,
    showLoading: false,
    params: {
      pageNo: dataSource.value.pageNo,
    },
  });
  if (!result) {
    return;
  }
  loadStatus.value = "more";

  result.data.list.forEach((element) => {
    if (element.categoryName == categoryName.value) {
      for (let i = 0; i < titleList.value.length; i++) {
        if (element.knowledgePoints == titleList.value[i].head) {
          let found = false; // 标记是否找到该元素,去重
          for (let j = 0; j < titleList.value[i].body.length; j++) {
            if (element.chapter == titleList.value[i].body[j]) {
              found = true;
              break;
            }
          }
          if (!found) {
            // 记录 chapter 和 path 的映射关系
            const chapterPathMap = {};
            titleList.value[i].body.forEach((chapter, index) => {
              chapterPathMap[chapter] = titleList.value[i].path[index];
            });

            // 添加新的 chapter 和 path
            titleList.value[i].body.push(element.chapter);
            chapterPathMap[element.chapter] = `/pages/classification/QuestionDetail?chapter=${element.chapter}&categoryName=${element.categoryName}`;

            // 对 body 进行升序排序
            titleList.value[i].body.sort();

            // 重新构建 path 数组
            titleList.value[i].path = titleList.value[i].body.map(chapter => chapterPathMap[chapter]);

            if (!activeNames.value.includes(i)) {
              activeNames.value.push(i);
            }
          }
        }
      }
      dataSource.value = result.data;
    }
  });
  console.log("Title List:", titleList.value); // 添加调试信息
};
onLoad(() => {
  loadDataList();
});

onReachBottom(() => {});


const showModal = ref(false);
const selectedPath = ref('');

const showModeSelection = (path) => {
  showModal.value = true;
  selectedPath.value = path;
  console.log("Selected Path:", selectedPath.value); // 添加调试信息
};

const closeModal = () => {
  showModal.value = false;
};

const selectMode = async (mode) => {
  const token =uni.getStorageSync(LOCAL_STORAGE_KEY.token.key);
  // if (token == "" || token == null) {
  //   uni.navigateTo( {
  //     url: "/pages/account/LoginAndRegister",
  //   });
  // }
  if (!token) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.reLaunch({ // 或 uni.redirectTo 根据需求选择
        url: "/pages/account/LoginAndRegister",
      });
    }, 1000); // 延迟跳转，给予用户提示反馈时间
  }

  const chapter = ref([]);
  console.log("chapter=========", chapter);
  chapter.value = selectedPath.value.split('&')[0].split('=')[1];
  const categoryName1 = ref([]);
  categoryName1.value = categoryName.value;
  console.log("chapter.value", chapter.value);
  console.log("categoryName1.value", categoryName1.value);

  let url = '';
  if (mode === 'brush') {
    url = `/pages/classification/QuestionDetail?chapter=${selectedPath.value.split('&')[0].split('=')[1]}&categoryName=${selectedPath.value.split('&')[1].split('=')[1]}`;
  } else if (mode === 'practice') {
    url = `/pages/classification/HistoryIndex?chapter=${selectedPath.value.split('&')[0].split('=')[1]}&categoryName=${selectedPath.value.split('&')[1].split('=')[1]}`;
  } else if (mode === 'newPractice') {
    let result = await proxy.Request({
      url: proxy.Api.createTexts,
      params: {
        chapter: chapter.value,
        categoryName: categoryName1.value,
      }
    });
    if(!result) {
      return;
    }
    url = `/pages/classification/TextDetail?chapter=${selectedPath.value.split('&')[0].split('=')[1]}&categoryName=${selectedPath.value.split('&')[1].split('=')[1]}&textId=${result.data.textId}`;
  }
  uni.navigateTo({
    url: url,
  });
  closeModal();
};
</script>

<style lang="scss" scoped>

.col-content {
  padding: 10px;
  border-radius: 5px;
  margin-left: 15px;
  height: 50px;
  background: #F5F6F7;
  font-size: 14px;
  font-weight: bold;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
}

.modal-close {
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.mode-option {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
}

.mode-option:hover {
  background: #f0f0f0;
}
</style>