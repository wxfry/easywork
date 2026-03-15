package com.easyjob.controller;

import com.easyjob.annotation.GlobalInterceptor;
import com.easyjob.annotation.VerifyParam;
import com.easyjob.entity.dto.AppExamPostDto;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.enums.AppExamStatusEnum;
import com.easyjob.entity.enums.ResponseCodeEnum;
import com.easyjob.entity.po.AppExam;
import com.easyjob.entity.po.AppText;
import com.easyjob.entity.query.AppExamQuery;
import com.easyjob.entity.query.AppExamQuestionQuery;
import com.easyjob.entity.vo.ResponseVO;
import com.easyjob.entity.vo.app.AppExamVO;
import com.easyjob.entity.vo.app.ExamQuestionVO;
import com.easyjob.exception.BusinessException;
import com.easyjob.service.AppExamService;
import com.easyjob.service.ExamQuestionService;
import com.easyjob.service.QuestionInfoService;
import com.easyjob.utils.CopyTools;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Description 用户在线考试
 * @ClassName
 * @MethodName
 * @Params
 */
@RestController("appExamController")
@RequestMapping("/appExam")
@Slf4j
public class AppExamController extends ABaseController {

    @Resource
    private AppExamService appExamService;
    @Autowired
    private ExamQuestionService examQuestionService;
    @Resource
    private QuestionInfoService questionInfoService;

    /**
     * 根据条件分页查询
     */
    @RequestMapping("/loadNoFinishedExam")
    @GlobalInterceptor
    public ResponseVO loadNoFinishedExam(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        if (appDto == null) {
            // 未登录, 直接返回空
            return getSuccessResponseVO(null);
        }
        AppExamQuery appExamQuery = new AppExamQuery();
        appExamQuery.setStatus(AppExamStatusEnum.INIT.getStatus());
        appExamQuery.setUserId(appDto.getUserId());
        appExamQuery.setType(0);
        appExamQuery.setOrderBy("exam_id desc");
        List<AppExam> appExamList = appExamService.findListByParam(appExamQuery);
        return getSuccessResponseVO(appExamList);
    }


    @RequestMapping("/createExam")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO createExam(@RequestHeader(value = "token", required = false) String token,
                                 @VerifyParam(required = true) String categoryIds,
                                 @VerifyParam(required = true) Integer type) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        return getSuccessResponseVO(appExamService.createExam(categoryIds, type, appDto));
    }

    @RequestMapping("/createText")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO createText(@RequestHeader(value = "token", required = false) String token,
                                 @RequestParam String chapter, @RequestParam String categoryName) {
        // 打印请求参数
        log.info("Received token: {}", token);
        log.info("Received chapter: {}", chapter);
        log.info("Received categoryName: {}", categoryName);

        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
//        return getSuccessResponseVO(appExamService.createText(chapter, categoryName, appDto));
        if (appDto == null) {
            log.error("Invalid token or user not logged in");
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }

        try {
            return getSuccessResponseVO(appExamService.createText(chapter, categoryName, appDto));
        } catch (Exception e) {
            log.error("Error creating text: {}", e.getMessage(), e);
            throw new BusinessException(ResponseCodeEnum.ERROR_10002);
        }
    }


    @RequestMapping("/getExamQuestion")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO getExamQuestion(@RequestHeader(value = "token", required = false) String token,
                                      @VerifyParam(required = true) Integer examId) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        AppExam appExam = checkAppExam(appDto, examId);

        // 考试题目从后端返回,考试中切换题目比较丝滑,不会卡顿

        // 默认不展示答案
        Boolean showAnswer = false;

        // 如果题目已经完成则展示答案
        if (AppExamStatusEnum.FINISHED.getStatus().equals(appExam.getStatus())) {
            showAnswer = true;
        }

        AppExamVO appExamVO = CopyTools.copy(appExam, AppExamVO.class);

//        涉及的数据库表
//        app_exam 考试表
//        app_exam_question 考试对应的考题 --用户
//        app_user_collect
//        exam_question 题库表
//        exam_question_item 题目选项
        AppExamQuestionQuery appExamQuestionQuery = new AppExamQuestionQuery();
        appExamQuestionQuery.setExamId(examId);
        appExamQuestionQuery.setUserId(appExam.getUserId());
        appExamQuestionQuery.setShowUserAnswer(showAnswer);
        List<ExamQuestionVO> examQuestionVOList = appExamService.getAppExamQuestion(appExamQuestionQuery);

        for (ExamQuestionVO item : examQuestionVOList) {
            item.setQuestion(resetContentImg(item.getQuestion()));
            item.setAnswerAnalysis(resetContentImg(item.getAnswerAnalysis()));
        }
        appExamVO.setExamQuestionList(examQuestionVOList);
        return getSuccessResponseVO(appExamVO);
    }

    // 检查考试信息,判断当前考试是否时当前用户创建的
    private AppExam checkAppExam(AppUserLoginDto appDto, Integer examId) {
        AppExam appExam = appExamService.getAppExamByExamId(examId);
        if (null == appExam || !appExam.getUserId().equals(appDto.getUserId())) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
        return appExam;
    }

    private AppText checkAppText(AppUserLoginDto appDto, String chapter, String categoryName) {
        AppText appText = appExamService.getAppTextByChapterAndCategoryName(chapter, categoryName);
//        if (null == appText || !appText.getUserId().equals(appDto.getUserId())) {
        if (null == appText) {
//            throw new BusinessException(ResponseCodeEnum.CODE_600);
            throw new BusinessException(ResponseCodeEnum.ERROR_10002);
        }
        return appText;
    }


    @RequestMapping("/startExam")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO startExam(@RequestHeader(value = "token", required = false) String token,
                                @VerifyParam(required = true) Integer examId) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        checkAppExam(appDto, examId);
        Date curDate = new Date();
        AppExam updateInfo = new AppExam();
        updateInfo.setStartTime(curDate);
        AppExamQuery appExamQuery = new AppExamQuery();
        appExamQuery.setExamId(examId);
        appExamQuery.setUserId(appDto.getUserId());
        appExamService.updateByParam(updateInfo, appExamQuery);
        // 返回当前时间.从服务端返回时间,防止前端时间有误
        return getSuccessResponseVO(curDate);
    }

    @RequestMapping("/postExam")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO postExam(@RequestHeader(value = "token", required = false) String token,
                               @RequestBody AppExamPostDto appExamPostDto) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        AppExam appExam = appExamService.postExam(appDto, appExamPostDto);
        return getSuccessResponseVO(appExam);
    }

    @RequestMapping("/delExam")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO delExam(@RequestHeader(value = "token", required = false) String token,
                              @VerifyParam(required = true) Integer examId) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        checkAppExam(appDto, examId);
        appExamService.delExam4Api(appDto.getUserId(), examId);
        return getSuccessResponseVO(null);
    }
}