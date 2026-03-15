package com.easyjob.aspect;

import com.easyjob.annotation.GlobalInterceptor;
import com.easyjob.annotation.VerifyParam;
import com.easyjob.entity.constants.Constants;
import com.easyjob.entity.dto.SessionUserAdminDto;
import com.easyjob.entity.enums.PermissionCodeEnum;
import com.easyjob.entity.enums.ResponseCodeEnum;
import com.easyjob.exception.BusinessException;
import com.easyjob.utils.StringTools;
import com.easyjob.utils.VerifyUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.List;

@Aspect // 引入切面包
@Component("operationAspect") //交给spring管理
public class OperationAspect {
    // 内置AOP配置,未单独写切点表达式定义

    private final Logger logger = LoggerFactory.getLogger(OperationAspect.class);

    private static final String[] BASE_TYPE_ARRAY = new String[]{"java.lang.String", "java.lang.Integer", "java.lang.Long"};

    // before前置, 表示执行方法之前进行切片, 切片执行不过,无法进入方法
    @Before("@annotation(com.easyjob.annotation.GlobalInterceptor)") // 切点定义
    public void interceptorDo(JoinPoint point) { // 事件通知类型
        Object[] arguments = point.getArgs();
        Method method = ((MethodSignature) point.getSignature()).getMethod(); //logger.info("方法名:{}", method.getName());
        GlobalInterceptor interceptor = method.getAnnotation(GlobalInterceptor.class);
        if (interceptor == null) {
            return;
        }

        /**
         * 登录校验
         */
        if (interceptor.checkLogin()) {
            checkLogin();
        }

        /**
         * 校验权限
         */
        if (interceptor.permissionCode() != null && interceptor.permissionCode() != PermissionCodeEnum.NO_PERMISSION) {
            checkPermission(interceptor.permissionCode());
        }

        /**
         * 校验参数
         */
        if (interceptor.checkParams()) {
            validateParams(method, arguments);
        }
    }

    void checkLogin() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        SessionUserAdminDto sessionUserAdminDto = (SessionUserAdminDto) request.getSession().getAttribute(Constants.SESSION_KEY);
        if (sessionUserAdminDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_901);
        }
    }

    void checkPermission(PermissionCodeEnum permissionCodeEnum) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        SessionUserAdminDto sessionUserAdminDto = (SessionUserAdminDto) request.getSession().getAttribute(Constants.SESSION_KEY);
        List<String> permissionCodeList = sessionUserAdminDto.getPermissionCodeList();
        if (!permissionCodeList.contains(permissionCodeEnum.getCode())) {
            throw new BusinessException(ResponseCodeEnum.CODE_902);
        }
    }

    private void validateParams(Method method, Object[] arguments) {
        Parameter[] parameters = method.getParameters();
        for (int i = 0; i < parameters.length; i++) {
            Parameter parameter = parameters[i];
            Object value = arguments[i];
            VerifyParam verifyParam = parameter.getAnnotation(VerifyParam.class);
            if (verifyParam == null) {
                continue;
            }
            logger.info("xx");
            // 判断参数类型
            String paramTypeName = parameter.getParameterizedType().getTypeName();
            /**
             * 基本数据类型
             */
            if (ArrayUtils.contains(BASE_TYPE_ARRAY, paramTypeName)) {
                checkValue(value, verifyParam);
            } else {
                checkObjValue(parameter, value);
            }
        }
    }

    private void checkObjValue(Parameter parameter, Object value) {
        // @VerifyParam(required = true) SysAccount sysAccount -> controller方法对象参数实例
        // 参数多的话可定义对象, 少的话用上面基本数据类型即可
        // 对象->反射->获取属性
        try {
            String typeName = parameter.getParameterizedType().getTypeName();
            Class classz = Class.forName(typeName);
            Field[] fields = classz.getDeclaredFields();
            for (Field field : fields) {
                VerifyParam fieldVerifyParam = field.getAnnotation(VerifyParam.class);
                if (fieldVerifyParam == null) {
                    continue;
                }
                field.setAccessible(true);
                Object resultValue = field.get(value);
                checkValue(resultValue, fieldVerifyParam);
            }

        } catch (Exception e) { // 捕获异常, 一定记得返回日志
            logger.error("校验参数失败", e);
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
    }

    private void checkValue(Object value, VerifyParam verifyParam) {
        // 判断是否为空
        Boolean isEmpty = value == null || StringTools.isEmpty(value.toString());
        // 判断长度
        Integer length = value == null ? 0 : value.toString().length();

        /**
         * 校验空
         */
        if (isEmpty && verifyParam.required()) {
            // 绕过前端不给具体错误, 只报参数异常
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
        /**
         * 校验长度
         */
        if (!isEmpty && (verifyParam.max() != -1 && verifyParam.max() < length || verifyParam.min() != -1 && verifyParam.min() > length)) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }

        /**
         * 校验正则
         * easyjob-common\src\main\java\com\easyjob\ utils\VerifyUtils.java 正则表达式类(校验工具)
         */
        if (!isEmpty && !StringTools.isEmpty(verifyParam.regex().getRegex()) && !VerifyUtils.verify(verifyParam.regex(), String.valueOf(value))) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
    }
}
