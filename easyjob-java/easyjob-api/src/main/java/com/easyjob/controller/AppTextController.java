package com.easyjob.controller;

import com.easyjob.annotation.GlobalInterceptor;
import com.easyjob.annotation.VerifyParam;
import com.easyjob.entity.dto.AppTextPostDto;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.enums.AnswerResultEnum;
import com.easyjob.entity.enums.AppExamStatusEnum;
import com.easyjob.entity.enums.ResponseCodeEnum;
import com.easyjob.entity.po.AppText;
import com.easyjob.entity.po.AppTextQuestion;
import com.easyjob.entity.query.AppTextQuery;
import com.easyjob.entity.query.AppTextQuestionQuery;
import com.easyjob.entity.vo.ResponseVO;
import com.easyjob.entity.vo.app.AppTextVO;
import com.easyjob.entity.vo.app.TextQuestionVO;
import com.easyjob.exception.BusinessException;
import com.easyjob.service.AppTextService;
import com.easyjob.utils.CopyTools;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/appText")
public class AppTextController extends ABaseController {

    @Resource
    private AppTextService appTextService;

    /**
     * 获取练习
     */
    @RequestMapping("/getText")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO getText(@RequestHeader(value = "token", required = false) String token,
                              @VerifyParam(required = true) Integer textId) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        AppText appText = checkAppText(appDto, textId);
        // 默认不展示答案
        Boolean showAnswer = true;
//         如果练习已经完成则展示答案
        if (AppExamStatusEnum.FINISHED.getStatus().equals(appText.getStatus())) {
            showAnswer = true;
        }
        AppTextVO appTextVO = CopyTools.copy(appText, AppTextVO.class);
        AppTextQuestionQuery appTextQuestionQuery = new AppTextQuestionQuery();
        appTextQuestionQuery.setTextId(textId);
        appTextQuestionQuery.setUserId(appText.getUserId());
        appTextQuestionQuery.setShowUserAnswer(showAnswer);
        List<TextQuestionVO> textQuestionVOList = appTextService.getAppTextQuestions(appTextQuestionQuery, textId);

        for (TextQuestionVO item : textQuestionVOList) {
            item.setQuestion(resetContentImg(item.getQuestion()));
            item.setAnswerAnalysis(resetContentImg(item.getAnswerAnalysis()));
        }
        appTextVO.setTextQuestionList(textQuestionVOList);
        return getSuccessResponseVO(appTextVO);
    }

    private AppText checkAppText(AppUserLoginDto appDto, Integer textId) {
        AppText appText = appTextService.getAppTextByTextId(textId);
        if (null == appText || !appText.getUserId().equals(appDto.getUserId())) {
//            throw new BusinessException(ResponseCodeEnum.CODE_600);
            throw new BusinessException("appText为空或用户不匹配");
        }
        return appText;
    }

    @RequestMapping("/getTextQuestion")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO getTextQuestion(@RequestHeader(value = "token", required = false) String token,
                                      @VerifyParam(required = true) Integer textId,
                                      @VerifyParam(required = true) Integer questionId) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
//        AppText appText = checkAppText(appDto, textId);
        Integer answerResult = appTextService.getTextAnswerResult(textId, questionId);
        // 默认不展示答案
        Boolean showAnswer = false;
        // 如果题目已经完成则展示答案
//        if (!AnswerResultEnum.INIT.getResult().equals(appTextQuestion.getAnswerResult())) {
        if (!AnswerResultEnum.INIT.getResult().equals(answerResult)) {
            showAnswer = true;
        }
//        AppTextVO appTextVO = CopyTools.copy(appText, AppTextVO.class);
        AppTextQuestionQuery appTextQuestionQuery = new AppTextQuestionQuery();
        appTextQuestionQuery.setTextId(textId);
        appTextQuestionQuery.setQuestionId(questionId);
        appTextQuestionQuery.setUserId(appDto.getUserId());
        appTextQuestionQuery.setShowUserAnswer(showAnswer);
        List<TextQuestionVO> textQuestionVOList = appTextService.getAppTextQuestion(appTextQuestionQuery, textId, questionId);

        return getSuccessResponseVO(textQuestionVOList);
    }

    /**
     * 获取练习历史
     */
    @RequestMapping("/getTextHistory")
    @GlobalInterceptor
    public ResponseVO getHistoryText(@RequestHeader(value = "token", required = false) String token,
                                     Integer pageNo, String status) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        if (appDto == null) {
            return getSuccessResponseVO(null);
        }

        AppTextQuery appTextQuery = new AppTextQuery();
//        appTextQuery.setStatus(AppExamStatusEnum.INIT.getStatus());
        appTextQuery.setPageNo(pageNo);
        if ("未完成".equals(status)) {
            appTextQuery.setStatus(0);
        } else if ("已完成".equals(status)) {
            appTextQuery.setStatus(1);
        }
        // 如果status既不是“未完成”也不是“已完成”，则不设置status

        appTextQuery.setUserId(appDto.getUserId());
        appTextQuery.setOrderBy("text_id desc");
//        List<AppText> appTextList = appTextService.findListByParam(appTextQuery);
//        return getSuccessResponseVO(appTextList);
        return getSuccessResponseVO(appTextService.findListByPage(appTextQuery));
    }

    @RequestMapping("/postText")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO postText(@RequestHeader(value = "token", required = false) String token,
                               @RequestBody AppTextPostDto appTextPostDto) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        AppText appText = appTextService.postText(appDto, appTextPostDto);
        return getSuccessResponseVO(appText);
    }

    @RequestMapping("/postTextQuestion")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO postTextQuestion(@RequestHeader(value = "token", required = false) String token,
                                       @RequestBody AppTextPostDto appTextPostDto) {
        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        AppTextQuestion appTextQuestion = appTextService.postSingleTextQuestion(appDto, appTextPostDto);
        return getSuccessResponseVO(appTextQuestion);
    }

    @RequestMapping("/createPostPaperText")
    @GlobalInterceptor(checkLogin = true)
    public ResponseVO createPostPaperText(@RequestHeader(value = "token", required = false) String token,
                                          @RequestParam String categoryName) {

        AppUserLoginDto appDto = getAppUserLoginfoFromToken(token);
        if (appDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }

        try {
            return getSuccessResponseVO(appTextService.createPostPaperText(categoryName, appDto));
        } catch (Exception e) {
            throw new BusinessException(ResponseCodeEnum.ERROR_10002);
        }
    }
}
