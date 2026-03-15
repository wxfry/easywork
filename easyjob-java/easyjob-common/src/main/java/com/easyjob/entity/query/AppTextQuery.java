package com.easyjob.entity.query;


/**
 * 用户在线考试参数
 */
public class AppTextQuery extends BaseParam {


    /**
     * 自增ID
     */
    private Integer textId;

    /**
     * 用户ID
     */
    private String userId;

    private String userIdFuzzy;

    /**
     * 用户昵称
     */
    private String nickName;

    private String nickNameFuzzy;

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
     * 创建时间
     */
    private String createTime;

    private String createTimeStart;

    private String createTimeEnd;

    /**
     * 开始时间
     */
    private String startTime;

    private String startTimeStart;

    private String startTimeEnd;

    /**
     * 结束时间
     */
    private String endTime;

    private String endTimeStart;

    private String endTimeEnd;

    /**
     * 0:未完成 1:已完成
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    private String remarkFuzzy;


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

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getNickName() {
        return this.nickName;
    }

    public void setNickNameFuzzy(String nickNameFuzzy) {
        this.nickNameFuzzy = nickNameFuzzy;
    }

    public String getNickNameFuzzy() {
        return this.nickNameFuzzy;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getCreateTime() {
        return this.createTime;
    }

    public void setCreateTimeStart(String createTimeStart) {
        this.createTimeStart = createTimeStart;
    }

    public String getCreateTimeStart() {
        return this.createTimeStart;
    }

    public void setCreateTimeEnd(String createTimeEnd) {
        this.createTimeEnd = createTimeEnd;
    }

    public String getCreateTimeEnd() {
        return this.createTimeEnd;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getStartTime() {
        return this.startTime;
    }

    public void setStartTimeStart(String startTimeStart) {
        this.startTimeStart = startTimeStart;
    }

    public String getStartTimeStart() {
        return this.startTimeStart;
    }

    public void setStartTimeEnd(String startTimeEnd) {
        this.startTimeEnd = startTimeEnd;
    }

    public String getStartTimeEnd() {
        return this.startTimeEnd;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getEndTime() {
        return this.endTime;
    }

    public void setEndTimeStart(String endTimeStart) {
        this.endTimeStart = endTimeStart;
    }

    public String getEndTimeStart() {
        return this.endTimeStart;
    }

    public void setEndTimeEnd(String endTimeEnd) {
        this.endTimeEnd = endTimeEnd;
    }

    public String getEndTimeEnd() {
        return this.endTimeEnd;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getRemark() {
        return this.remark;
    }

    public void setRemarkFuzzy(String remarkFuzzy) {
        this.remarkFuzzy = remarkFuzzy;
    }

    public String getRemarkFuzzy() {
        return this.remarkFuzzy;
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
}
