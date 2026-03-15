# 前端问题

## 一、项目构建

### 1、uni-app sdk版本提示 运行环境版本和编译器版本不一致的问题

- “手机端SDK版本”：是指5+Runtime的版本号。云打包提交云端打包时确定的，也就是说生成apk/ipa之后，APP运行环境就不会改变了。离线打包时是你下载的sdk的版本。只有默认真机运行基座、云打包机的引擎是和HBuilderX升级而自动升级的。如果你使用了自定义基座、sdk离线打包，需要手动升级，或者重新用新版制作自定义基座，或者下载最新版sdk。
- “HBuilderX版本”：如果项目是HBuilderX创建的，则是HBuilderX的版本号，更新HBuilderX会改变；如果是cli创建的项目，即根目录是package.json，那么编译环境版本号是创建cli时生成的，或者上一次执行npm update生成的。不管HBuilderX如何升级，cli项目的编译器并不会跟随HBuilderX升级而升级，需手动升级。

#### 什么时候会出现这种问题？

- 情况1：HBuilderX版本很老，或cli编译器一直没升级，而云打包服务器已经升级，此时编译环境版本低，而运行环境版本高，就会报错。
- 情况2：使用老版HBuilderX打包了App后，后来使用新版HBuilderX或新版cli制作了wgt升级包。此时编译环境会高于运行环境，也会报错。
- 情况3：使用了cli或自定义基座或本地打包，虽然HBuilderX升级了，但这些配套并没有手动升级，也是报错。
- 情况4：如果HBuilderX版本高于SDK版本，有可能是HBuilderX在升级时出现问题，手机端基座没有升级成功。如果是这种情况，在插件管理里卸载“真机运行插件”，然后重新安装这个插件。

#### 出现问题该怎么办？

1. 比较简单的就是全部升级，保持HBuilderX、自定义基座、cli项目编译器都是最新版。
2. wgt升级时遇到这个问题，首先你可以自测，看老的运行引擎和新版编译器编的wgt是否搭配，如果测试有问题，那不能使用wgt升级，请使用整包升级。如果测试正常，可以在manifest.json文件的源码视图中配置忽略这个提醒，在“app-plus”->"compatible" 节点下添加配置 方式如下：
	**HBuilderX1.9.0及以上版本新增以下配置避免弹出提示框**

```
	"app-plus" : {
		"compatible": {
			// 指定版本避免提示框
			// "runtimeVersion"字段值表示应用兼容的uni-app运行环境版本号，可以配置多个版本号（使用英文字符,分隔）
			// "compilerVersion"字段值表示编译环境版本号，通常配置当前HBuilderX的版本号或cli编译器版本即可（不可以配置多个）
			// "runtimeVersion": "1.7.0", //根据实际情况填写
			// "compilerVersion": "1.7.1", //根据实际情况填写  
			
			//true表示忽略版本检查提示框，HBuilderX1.9.0及以上版本支持  
		    "ignoreVersion": true  	 
		},  
}
```

**建议：尽量使用相同的HBuilderX版本制作移动App资源升级包**

**本地离线打包请及时更新到与HBuilderX版本相对应的App离线打包SDK**

**cli项目请及时npm update 更新到最新cli，如需指定cli版请参考：[修改依赖为指定版本](https://uniapp.dcloud.io/quickstart?id=修改依赖为指定版本)**

**注意**
平台并不知道使用者是正常用户还是开发者。
但开发者在发布给最终用户之前，请务必先自行测试好。
目前出这个问题的，大多是因为制作wgt升级包造成的。
请使用wgt升级的开发者的，务必在测试环境上先测试好了再发布wgt。
在HBuilderX 1.9版里，已经在制作wgt时强调提示了这个信息。



### 2、图标位置（只需要这两个文件即可，否则打包可能出现问题）

标签来自iconfont

![image-20250102092549704](C:/Users/admin/AppData/Roaming/Typora/typora-user-images/image-20250102092549704.png)

## 二、代码编写

### 1、div 和 view 

html div 标签 是一个小区域

可以把想要写在一个的几个布局写在一个div中, 把另外一个有关联的放到另外一个div中

微信小程序 使用的是view 标签, 它的作用和div 标签 是一样的

html

	 <div id="first">
		 	 <p>说明</p>
		 	<span class="me">我是谁</span>
		 </div>
微信小程序

```
<view class='driver_re_hint'>
    <text class='driver_re_hint_text'>信息仅用于审核，绝不外泄</text>
</view>
```

#### View 和 div 的区别

在Web开发中，*<div>*标签是一个非常常见的HTML元素，用于创建一个块级容器，可以包含其他HTML元素，如文本、图片、链接等。它通常用于布局和样式化网页的不同部分。而在微信小程序中，*<view>*标签扮演了类似*<div>*的角色，但它们之间存在一些关键的区别。

#### View标签的特性

*<view>*标签是微信小程序中的一个基础组件，它类似于HTML中的*<div>*标签，但专门为小程序环境设计。*<view>*标签的特点包括：

- 默认情况下，*<view>*标签的宽度为100%，这意味着它会自动填充其父容器的宽度。
- *<view>*标签在没有其他样式影响的情况下，不会独占一行，其宽度和高度由内容撑开。
- 在小程序中，*<view>*标签用于构建用户界面的布局，可以包含其他小程序组件，如*<text>*、*<image>*、*<button>*等。

#### Div标签的特性

<div>标签是HTML中的一个块级元素，用于创建网页布局的容器。它的特点包括：

- *<div>*标签没有默认宽度，它的大小通常由包含的内容或者CSS样式决定。
- *<div>*标签可以包含任何类型的HTML元素，包括其他*<div>*标签。
- *<div>*标签通常用于网页布局的分区，可以通过CSS进行样式化和定位。

#### 为什么小程序使用View而不是Div

微信小程序选择使用*<view>*标签而不是继续使用*<div>*标签的原因在于小程序的设计理念和安全考虑。小程序旨在提供一个更加管控和安全的环境，避免开发者使用可能导致安全风险的Web技术。通过自定义标签，小程序可以限制某些Web功能，如页面跳转和DOM操作，从而保护用户数据不被滥用。

小程序的组件系统是基于Exparser框架设计的，内置了一套组件来覆盖小程序的基础功能，使得开发者可以快速构建界面。同时，小程序也提供了自定义组件的能力，允许开发者扩展更多的组件以实现代码复用。

总结来说，*<view>*标签是微信小程序中的一个基础组件，用于构建用户界面的布局，而*<div>*标签是HTML中的一个块级元素，用于创建网页布局的容器。两者虽然在功能上有相似之处，但*<view>*标签是为了适应小程序的特定环境和安全要求而设计的。



### 2、页面设置及相关文件

pages.json 页面链接 底部导航栏设置 上方标题栏设置

stores 上方标题栏自定义

app.vue 引用stores中的appinfo.js，因为使用了pinia，注意main.js中也要配置，引用

```
import * as Pinia from 'pinia'
export function createApp() {
	app.use(Pinia.createPinia());
}
```

pages-components-common-Navbar.vue 上方标题栏样式设置

```
// 动态css配置信息
<template>
	<view>
		<view
     		 class="navbar"
      		:style="{ // 自定义高宽+状态栏高度为整个标题栏高度
        		height:
          		appInfoStore.getInfo().navBarHeight +
          		appInfoStore.getInfo().statusBar +
          		'px',
          		// padding=top用于防止内容遮住状态栏
        		'padding-top': appInfoStore.getInfo().statusBar + 'px',
      		}"
    	>
    </view>

<script setup>
import {useAppInfoStore} from "@/stores/appInfo";
const appInfoStore = userAppInfoStore();
</script>
```

main.js 引入，index.vue 引用



前置样式 static-base.scss 中定义基础样式，main.js 中引入样式

```
import "@/static/base.scss"
import "@/static/icon/iconfont.css"
```



![image-20250102103852054](C:/Users/admin/AppData/Roaming/Typora/typora-user-images/image-20250102103852054.png)

这里的文字内容被藏在下面，Navbar.vue中style.navbar设置为position：fixed；

最好在它下面加一个空的view，把它顶下去，高度与标题栏高度相等

![image-20250102104301164](C:/Users/admin/AppData/Roaming/Typora/typora-user-images/image-20250102104301164.png)



utils - api.js 接口文档

api.js 中的domain为自己的ip,通过浏览器访问时要走代理,否则会有跨域问题,而模拟器或者打包中不存在跨域问题

这里request用uin-app自定义的,用vue3的等可能会有兼容问题.uni-app API 网络-发起请求request

utils - Message.js 定义Message,error/success/warning



carouselList 轮播图的取值



首页分类和第二个模块的分类管理都需要调用分类信息,单独拿出来放到stores里的questionCategory.js中——然后App.vue中引用useQuestionCategotyStore，定义中在开首页的时候分类信息直接加载进来



uni-app 的扩展组件要自己下载安装



pages.josn 中 style 配置  “navigationBarTitleText ”: “uni-app” 表示开启下拉刷新。在globalStyle中可以修改刷新的相关属性



utiles中Utils.js定义方法 实现日期格式化



```html
<uni-section title="滑动视图" type="line" padding>
	<!-- 因为swiper特性的关系，请指定swiper的高度 ，swiper的高度并不会被内容撑开-->
	<swiper class="swiper" :indicator-dots="true">
		<swiper-item>
			<uni-grid :column="3" :highlight="true" @change="change">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<image :src="item.url" class="image" mode="aspectFill" />
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</swiper-item>
		<swiper-item>
			<uni-grid :column="3" :highlight="true" @change="change">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<image :src="item.url" class="image" mode="aspectFill" />
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</swiper-item>
		<swiper-item>
			<uni-grid :column="3" :highlight="true" @change="change">
				<uni-grid-item v-for="(item, index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<image :src="item.url" class="image" mode="aspectFill" />
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</swiper-item>
	</swiper>
</uni-section>
```



```vue
<template>
	<view class="uni-grid-wrap">
		<view :id="elId" ref="uniGrid" class="uni-grid" :class="{ 'uni-grid--border': showBorder }" :style="{ 'border-left-color': borderColor }">
			<slot />
		</view>
	</view>
</template>

<script>import { ref, onMounted, provide } from 'vue';
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom');
// #endif

/**
 * Grid 宫格
 * @description 宫格组件
 * @tutorial https://ext.dcloud.net.cn/plugin?id=27
 * @property {Number} column 每列显示个数
 * @property {String} borderColor 边框颜色
 * @property {Boolean} showBorder 是否显示边框
 * @property {Boolean} square 是否方形显示
 * @property {Boolean} Boolean 点击背景是否高亮
 * @event {Function} change 点击 grid 触发，e={detail:{index:0}}，index 为当前点击 gird 下标
 */
export default {
	name: 'UniGrid',
	emits: ['change'],
	props: {
		// 每列显示个数
		column: {
			type: Number,
			default: 3
		},
		// 是否显示边框
		showBorder: {
			type: Boolean,
			default: true
		},
		// 边框颜色
		borderColor: {
			type: String,
			default: '#D2D2D2'
		},
		// 是否正方形显示,默认为 true
		square: {
			type: Boolean,
			default: true
		},
		highlight: {
			type: Boolean,
			default: true
		}
	},
	setup(props, { emit }) {
		const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		const width = ref(0);
		const children = ref([]);

		provide('grid', this);

		const init = () => {
			setTimeout(() => {
				getSize((w) => {
					children.value.forEach((item, index) => {
						item.width = w;
					});
				});
			}, 50);
		};

		const change = (e) => {
			emit('change', e);
		};

		const getSize = (fn) => {
			// #ifndef APP-NVUE
			uni.createSelectorQuery()
				.in(this)
				.select(`#${elId}`)
				.boundingClientRect()
				.exec((ret) => {
					width.value = parseInt((ret[0].width - 1) / props.column) + 'px';
					fn(width.value);
				});
			// #endif
			// #ifdef APP-NVUE
			dom.getComponentRect(this.$refs['uniGrid'], (ret) => {
				width.value = parseInt((ret.size.width - 1) / props.column) + 'px';
				fn(width.value);
			});
			// #endif
		};

		onMounted(() => {
			this.$nextTick(() => {
				init();
			});
		});

		return {
			elId,
			width,
			change,
			getSize
		};
	}
};
</script>

<style lang="scss" scoped>.uni-grid-wrap {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex: 1;
	flex-direction: column;
	/* #ifdef H5 */
	width: 100%;
	/* #endif */
}

.uni-grid {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
}

.uni-grid--border {
	position: relative;
	/* #ifdef APP-NVUE */
	border-left-color: #D2D2D2;
	border-left-style: solid;
	border-left-width: 0.5px;
	/* #endif */
	/* #ifndef APP-NVUE */
	z-index: 1;
	border-left: 1px #D2D2D2 solid;
	/* #endif */
}
</style>
```



pages-question-QuestionCategoty.vue定义分类组件，八股文右侧弹出框分类



分类数据在App.vue中已载入

即，questionCategoryStore，使用 const questionCategoryStore = usequestionCategoryStore()引用，v-for = “item in questionCategoryStore.getInfo()”使用







苍穹外卖、黑马点评、rpc（通信框架）



























































