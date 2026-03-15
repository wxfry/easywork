// 获取分类信息
import { defineStore } from "pinia"
export const useBookCategoryStore = defineStore('bookCategoryInfo', {
    state: () => {
        return {
            categoryList: []
        }
    },
    actions: {
        setInfo(categoryList) {
            this.categoryList = categoryList;
        },
        getInfo() {
            return this.categoryList
        }
    }
});

export const useSourceCategoryStore = defineStore('SourceCategoryInfo', {
    state: () => {
        return {
            sourceCategoryList: []
        }
    },
    actions: {
        setInfo(questionList) {
            this.sourceCategoryList = sourceCategoryList;
        },
        getInfo() {
            return this.sourceCategoryList
        }
    }
});

export const useSectionCategoryStore = defineStore('SectionCategoryInfo', {
    state: () => {
        return {
            sectionCategoryList: []
        }
    },
    actions: {
        setInfo(questionList) {
            this.sectionCategoryList = sectionCategoryList;
        },
        getInfo() {
            return this.sectionCategoryList
        }
    }
});

export const usePointCategoryStore = defineStore('PointCategoryInfo', {
    state: () => {
        return {
            pointCategoryList: []
        }
    },
    actions: {
        setInfo(questionList) {
            this.pointCategoryList = pointCategoryList;
        },
        getInfo() {
            return this.pointCategoryList
        }
    }
});
