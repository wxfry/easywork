package com.easyjob.entity.dto;

import com.easyjob.entity.po.AppTextQuestion;

import java.util.List;

public class AppTextPostDto {
    private Integer textId;

    private List<AppTextQuestion> appTextQuestionList;

    public Integer getTextId() {
        return textId;
    }

    public void setTextId(Integer textId) {
        this.textId = textId;
    }

    public List<AppTextQuestion> getAppTextQuestionList() {
        return appTextQuestionList;
    }

    public void setAppTextQuestion(List<AppTextQuestion> appTextQuestionList) {
        this.appTextQuestionList = appTextQuestionList;
    }
}
