package com.easyjob.controller;

import com.easyjob.annotation.GlobalInterceptor;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.dto.StatisticsDataWeekDto;
import com.easyjob.entity.enums.ResponseCodeEnum;
import com.easyjob.entity.po.ExamQuestion;
import com.easyjob.entity.vo.ResponseVO;
import com.easyjob.entity.vo.app.CommendVo;
import com.easyjob.exception.BusinessException;
import com.easyjob.mappers.AppExamQuestionMapper;
import com.easyjob.service.AppCommentService;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController("commend")
@RequestMapping("/commend")
public class CommentController extends ABaseController {

    @Resource
    private AppCommentService appCommentService;

    private AppExamQuestionMapper examQuestionMapper;

//    @RequestMapping("/userCF")
//    @GlobalInterceptor
//    public ResponseVO userCF(@RequestHeader(value = "token", required = false) String token) {
//        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
//
//        List<ExamQuestion> questionList = appCommentService.userCF(userLoginDto.getUserId());
//        CommendVo commendVo = new CommendVo();
//        commendVo.setCommendQuestionList(questionList);
//        return getSuccessResponseVO(commendVo);
//    }

//    @RequestMapping("/getCommendQestion")
//    @GlobalInterceptor
//    public ResponseVO getCommendQestion(@RequestHeader(value = "token", required = false) String token,
//                                        @VerifyParam(required = true) Integer questionId) {
//        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
//        // 默认不展示答案
//        Boolean showAnswer = false;
//        List<ExamQuestion> questionList = appCommentService.getQuestionById(questionId);
//        return getSuccessResponseVO(questionList);
//    }

    /**
     * 签到,可以补签
     */
    @RequestMapping("/sign")
    public ResponseVO sign(@RequestHeader(value = "token", required = false) String token,
                           @RequestParam(required = false) String date) {
        int count = appCommentService.doSign(token, date);
        return getSuccessResponseVO(count);
    }

    /**
     * 获取连续签到天数
     */
    @RequestMapping("/getSignCount")
    public ResponseVO getSignCount(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
        int count = appCommentService.getSignCount(userLoginDto.getUserId());
        return getSuccessResponseVO(count);
    }

    /**
     * 获取用户当月签到明细情况
     */
    @RequestMapping("/getSignDetail")
    public ResponseVO getSignDetail(@RequestHeader(value = "token", required = false) String token,
                                    @RequestParam(required = false) String dateStr) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);

        // 判断用户是否未登录
        if (userLoginDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_401);
        }
        Map<String, Boolean> map = appCommentService.getSignDetail(token, dateStr);
        return getSuccessResponseVO(map);
    }

    @RequestMapping("/getTextData")
    public ResponseVO getTextData(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
        StatisticsDataWeekDto appTextData = appCommentService.getTextData(userLoginDto.getUserId());
        return getSuccessResponseVO(appTextData);
    }

    @RequestMapping("/getUserKnowledgeMatrix")
    public ResponseVO getUserKnowledgeMatrix(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);

        // 判断用户是否未登录
        if (userLoginDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_401);
        }

        Map<String, Double> userKnowledgeMatrix = appCommentService.buildUserKnowledgeMatrix(userLoginDto.getUserId());
        // 定义需要检查的课程名称列表
        String[] requiredCourses = {
                "马克思主义基本原理",
                "中国近现代史纲要",
                "思想道德与法治",
                "习近平新时代中国特色社会主义思想概论",
                "毛泽东思想和中国特色社会主义理论体系概论"
        };

        // 检查并添加缺失的课程
        for (String course : requiredCourses) {
            userKnowledgeMatrix.putIfAbsent(course, 0.0);
        }
        return getSuccessResponseVO(userKnowledgeMatrix);
    }

    /**
     * 计算当前用户与其他所有用户的相关性，并根据相关系数倒序排序输出前N项的结果
     */
    @RequestMapping("/calculateTopNUserSimilarity")
    @GlobalInterceptor
    public ResponseVO calculateTopNUserSimilarity(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);

        // 判断用户是否未登录
        if (userLoginDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_401);
        }
//        List<Map.Entry<String, Double>> similarityList = appCommentService.calculateTopNUserSimilarity(userLoginDto.getUserId());
        List<ExamQuestion> questionList = appCommentService.getCommendQuestion(userLoginDto.getUserId());
        CommendVo commendVo = new CommendVo();
        commendVo.setCommendQuestionList(questionList);
        return getSuccessResponseVO(commendVo);
    }

    @RequestMapping("/getExamStatistics")
    @GlobalInterceptor
    public ResponseVO getExamStatistics(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);

        // 判断用户是否未登录
        if (userLoginDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_401);
        }
        Map<Integer, Double> examStatistics = appCommentService.getExamStatistics(token);
        return getSuccessResponseVO(examStatistics);
    }

    @RequestMapping("getTextQuestionData")
    @GlobalInterceptor
    public ResponseVO getKnowledgePointQuestionCount(@RequestHeader(value = "token", required = false) String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);

        // 判断用户是否未登录
        if (userLoginDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_401);
        }
        return getSuccessResponseVO(appCommentService.getKnowledgePointQuestionCount(token));
    }
}
