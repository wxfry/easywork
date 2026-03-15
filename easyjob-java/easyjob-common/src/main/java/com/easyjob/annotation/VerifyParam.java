package com.easyjob.annotation;

import com.easyjob.entity.enums.VerifyRegexEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface VerifyParam {

    /**
     * 校验正则
     * easyjob-common-src-main-java-com-easyjob-entity-enums-VerifyRegexEnum 枚举
     *
     * @return
     */
    VerifyRegexEnum regex() default VerifyRegexEnum.NO;
    // common-src-main-java-com-easyjob-entity-enums-VerifyRegexEnum 定义枚举

    /**
     * 最小长度
     *
     * @return
     */
    int min() default -1;

    /**
     * 最大长度
     *
     * @return
     */
    int max() default -1;

    boolean required() default false; // 是否必填


}
