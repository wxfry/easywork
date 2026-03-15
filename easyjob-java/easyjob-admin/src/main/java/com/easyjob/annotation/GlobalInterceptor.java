package com.easyjob.annotation;

import com.easyjob.entity.enums.PermissionCodeEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Java自定义注解
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface GlobalInterceptor {

    // 是否定义参数校验, 默认为true,这是必填的
    // 如果没有默认的，在使用的时候就必须要写上，有默认就可以不写了
    boolean checkLogin() default true;

    PermissionCodeEnum permissionCode() default PermissionCodeEnum.NO_PERMISSION;

    boolean checkParams() default true;
}
