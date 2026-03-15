package com.easyjob.entity.vo;

import java.util.ArrayList;
import java.util.List;


public class QuestionResultVO<T> {
    private Integer totalCount;
    private List<T> list = new ArrayList<T>();

    public QuestionResultVO(Integer totalCount, List<T> list) {
        this.totalCount = totalCount;
        this.list = list;
    }

    public QuestionResultVO(List<T> list) {
        this.list = list;
    }

    public QuestionResultVO() {

    }

    public Integer getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Integer totalCount) {
        this.totalCount = totalCount;
    }


    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }
}
