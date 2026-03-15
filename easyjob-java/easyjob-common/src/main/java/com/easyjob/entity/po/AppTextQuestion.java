package com.easyjob.entity.po;

import java.io.Serializable;


/**
 * 考试问题
 */
public class AppTextQuestion implements Serializable {


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

    /**
     * 章节
     */
    private String chapter;

    /**
     * 分类名称
     */
    private String categoryName;

    /**
     * 知识点
     */
    private String knowledgePoint;

    /**
     * 问题ID
     */
    private Integer questionId;

    /**
     * 用户答案
     */
    private String userAnswer;

    /**
     * 0:未作答 1:正确  2:错误
     */
    private Integer answerResult;


    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return this.id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return this.userId;
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

    public void setAnswerResult(Integer answerResult) {
        this.answerResult = answerResult;
    }

    public Integer getAnswerResult() {
        return this.answerResult;
    }

    public Integer getTextId() {
        return textId;
    }

    public void setTextId(Integer textId) {
        this.textId = textId;
    }

    public String getChapter() {
        return chapter;
    }

    public void setChapter(String chapter) {
        this.chapter = chapter;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getKnowledgePoint() {
        return knowledgePoint;
    }

    public void setKnowledgePoint(String knowledgePoint) {
        this.knowledgePoint = knowledgePoint;
    }

    @Override
    public String toString() {
        return "自增ID:" + (id == null ? "空" : id) + "，用户ID:" + (userId == null ? "空" : userId) + "，章节:" + (chapter == null ? "空" : chapter) + "，分类名称:" + (categoryName == null ? "空" : categoryName) + "，问题ID:" + (questionId == null ? "空" : questionId) + "，用户答案:" + (userAnswer == null ? "空" : userAnswer) + "，0:未作答 1:正确  2:错误:" + (answerResult == null ? "空" : answerResult);
    }
}
