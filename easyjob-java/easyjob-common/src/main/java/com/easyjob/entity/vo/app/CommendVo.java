package com.easyjob.entity.vo.app;

import com.easyjob.entity.po.ExamQuestion;

import java.io.Serializable;
import java.util.List;

public class CommendVo implements Serializable {

    private static final long serialVersionUID = -7549621731807895211L;

    private List<ExamQuestion> commendQuestionList;

    public List<ExamQuestion> getCommendQuestionList() {
        return commendQuestionList;
    }

    public void setCommendQuestionList(List<ExamQuestion> commendQuestionList) {
        this.commendQuestionList = commendQuestionList;
    }
}
