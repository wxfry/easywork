package com.easyjob.entity.po;

import java.io.Serializable;

public class UserRelate implements Serializable {

    private String userId;

    private Integer questionId;

    private Integer times;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Integer getTimes() {
        return times;
    }

    public void setTimes(Integer times) {
        this.times = times;
    }


}
