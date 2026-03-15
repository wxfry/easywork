package com.easyjob.entity.query;


import java.util.List;

/**
 * 考试问题参数
 */
public class AppTextQuestionQuery extends BaseParam {


    /**
     * 自增ID
     */
    private Integer id;

    /**
     * 练习ID
     */
    private Integer textId;

    /**
     * 用户ID
     */
    private String userId;

    private String userIdFuzzy;

    /**
     * 章节
     */
    private String chapter;
    private String chapterFuzzy;

    /**
     * 分类名称
     */
    private String categoryName;
    private String categoryNameFuzzy;

    /**
     * 问题ID
     */
    private Integer questionId;

    /**
     * 用户答案
     */
    private String userAnswer;

    private String userAnswerFuzzy;

    /**
     * 0:未作答 1:正确  2:错误
     */
    private Integer answerResult;

    private String knowledgePoint;

    private Boolean showUserAnswer;

    private List<String> questionIds;

    private String postTime;

    public List<String> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<String> questionIds) {
        this.questionIds = questionIds;
    }

    public Boolean getShowUserAnswer() {
        return showUserAnswer;
    }

    public void setShowUserAnswer(Boolean showUserAnswer) {
        this.showUserAnswer = showUserAnswer;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return this.id;
    }

    public void setTextId(Integer textId) {
        this.textId = textId;
    }

    public Integer getTextId() {
        return this.textId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserIdFuzzy(String userIdFuzzy) {
        this.userIdFuzzy = userIdFuzzy;
    }

    public String getUserIdFuzzy() {
        return this.userIdFuzzy;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Integer getQuestionId() {
        return this.questionId;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public String getUserAnswer() {
        return this.userAnswer;
    }

    public void setUserAnswerFuzzy(String userAnswerFuzzy) {
        this.userAnswerFuzzy = userAnswerFuzzy;
    }

    public String getUserAnswerFuzzy() {
        return this.userAnswerFuzzy;
    }

    public void setAnswerResult(Integer answerResult) {
        this.answerResult = answerResult;
    }

    public Integer getAnswerResult() {
        return this.answerResult;
    }

    public String getChapter() {
        return chapter;
    }

    public void setChapter(String chapter) {
        this.chapter = chapter;
    }

    public String getChapterFuzzy() {
        return chapterFuzzy;
    }

    public void setChapterFuzzy(String chapterFuzzy) {
        this.chapterFuzzy = chapterFuzzy;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryNameFuzzy() {
        return categoryNameFuzzy;
    }

    public void setCategoryNameFuzzy(String categoryNameFuzzy) {
        this.categoryNameFuzzy = categoryNameFuzzy;
    }

    public String getKnowledgePoint() {
        return knowledgePoint;
    }

    public void setKnowledgePoint(String knowledgePoint) {
        this.knowledgePoint = knowledgePoint;
    }

    public String getPostTime() {
        return this.postTime;
    }

    public void setPostTime(String postTime) {
        this.postTime = postTime;
    }
}
