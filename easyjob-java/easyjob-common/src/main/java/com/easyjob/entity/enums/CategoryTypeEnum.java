package com.easyjob.entity.enums;


public enum CategoryTypeEnum {

    QUESTION(0, "教师分类"),
    EXAM(1, "来源分类"),
    QUESTION_EXAM(2, "知识分类");


    private Integer type;
    private String desc;

    CategoryTypeEnum(Integer type, String desc) {
        this.type = type;
        this.desc = desc;
    }

    public static CategoryTypeEnum getByType(Integer type) {
        for (CategoryTypeEnum item : CategoryTypeEnum.values()) {
            if (item.getType().equals(type)) {
                return item;
            }
        }
        return null;
    }

    public Integer getType() {
        return type;
    }

    public String getDesc() {
        return desc;
    }
}
