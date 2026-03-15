<template>
  <view>
    <Navbar :showLeft="showLeft" :title="categoryInfo.categoryName">
      <template #right>
        <view class="iconfont icon-more-line" @click="showCategory"></view>
      </template>
    </Navbar>
<!--    <view>-->
<!--      <view class="question-list">-->
<!--        <DataList-->
<!--          :dataSource="dataSrouce"-->
<!--          @loadData="loadDataList"-->
<!--          :loadStatus="loadStatus"-->
<!--        >-->
<!--          <template #default="{ data }">-->
<!--            <QuestionItem-->
<!--              :data="data"-->
<!--              :categoryId="categoryInfo.categoryId"-->
<!--              :showDetail="true"-->
<!--            ></QuestionItem>-->
<!--          </template>-->
<!--        </DataList>-->
<!--      </view>-->
<!--    </view>-->

    <view class="goods" v-for="(item, index) in mainArray" :key="index">
      <view class="orderlist-list" v-for="(subItem, subIndex) in item.list" :key="subIndex">
        <view class="list-right"  @click="jumpKu(subItem)">
          <view class="list-name">
            {{ subItem.name }}
          </view>
        </view>
      </view>
    </view>

    <QuestionCategory
      ref="questionCategoryRef"
      @select="selectCategory"
    ></QuestionCategory>
  </view>
</template>

<script setup>
import QuestionCategory from "@/pages/question/QuestionCategory1.vue";
import QuestionItem from "./QuestionItem.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useBookCategoryStore } from '@/stores/bookCategory'

const bookCategoryStore = useBookCategoryStore();
console.log('bookCategoryStore', bookCategoryStore.getInfo());
const mainArray = ref([]);

const { proxy } = getCurrentInstance();

const props = defineProps({
  showLeft: {
    type: Boolean,
    default: true,
  },
});

const categoryInfo = ref({
  categoryId: "0",
  categoryName: "全部分类",
});

const dataSrouce = ref({});
const loadStatus = ref(null);
const loadDataList = async () => { // 获取题目列表信息
  loadStatus.value = "loading";
  let result = await proxy.Request({
    url: proxy.Api.loadQuestion,
    // url: proxy.Api.loadClassify,
    showLoading: false,
    params: {
      categoryId: categoryInfo.value.categoryId,
      pageNo: dataSrouce.value.pageNo || 1,
    },
  });
  if (!result) {
    return;
  }
  loadStatus.value = "more";
  dataSrouce.value = result.data;
  console.log("dataSource.value======", dataSrouce.value);
};

// loadDataList();

const questionCategoryRef = ref();
const showCategory = () => {
  questionCategoryRef.value.show(categoryInfo.value);
};

const selectCategory = (category) => {
  categoryInfo.value = Object.assign({}, category);
  loadDataList();
};

onLoad((options) => {
  if (Object.keys(options).length > 0) {
    let { categoryId, categoryName } = options;
    categoryName = decodeURIComponent(categoryName);
    categoryInfo.value = {
      categoryId,
      categoryName,
    };
  }
  loadDataList();
  getListData();
});

const getListData = () => {
  console.log("getListData开始运行")
  return new Promise((resolve, reject) => {
    uni.showLoading();
    setTimeout(() => {
      const main = [];
      const list = [];
      console.log("即将运行for循环")
      for (let i = 0; i < bookCategoryStore.getInfo().length; i++) {
        console.log("bookCategoryStore.getInfo()[i].pId", bookCategoryStore.getInfo()[i].pId);
        console.log("categoryInfo.value.categoryId", categoryInfo.value.categoryId);
        if (bookCategoryStore.getInfo()[i].pId == categoryInfo.value.categoryId) {
          list.push({
            name: bookCategoryStore.getInfo()[i].categoryName,
            path: `/pages/classification/ClassifyBook?id=${bookCategoryStore.getInfo()[i].categoryName}`
          })
        }
      }
      console.log("list", list);
      main.push({
        title: `${categoryInfo.value.categoryName}`,
        list
      });
      console.log("main", main);
      resolve({ main });
    }, 1000);
  }).then(res => {
    console.log('-----------请求接口返回数据示例-------------');
    console.log(res)

    uni.hideLoading();
    mainArray.value = res.main;
    console.log('mainArray.value', mainArray.value);

    // nextTick(() => {
    //   getElementTop();
    // });
  });
}

const jumpKu = (item) => {
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
    // url: "/pages/classification/ClassifyBook",
    url: item.path,
  });
}
</script>

<style lang="scss" scoped>
.icon-more-line {
  text-align: right;
  font-size: 20px;
}

/* 设置页面背景颜色为浅灰色 */
page {
  background-color: #f5f5f5;
}

.goods {
  margin-bottom: 20px;
  background-color: #fff; /* 列表背景颜色为白色 */
  border-radius: 10px; /* 圆角边框 */
  overflow: hidden; /* 确保圆角生效 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.orderlist-list {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
}

.orderlist-list:last-child {
  border-bottom: none;
}

.list-right {
  flex: 1;
}

.list-name {
  font-size: 18px;
  color: #333;
}
</style>
