package com.easyjob.service;

import com.easyjob.entity.dto.AppTextPostDto;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.po.AppText;
import com.easyjob.entity.po.AppTextQuestion;
import com.easyjob.entity.query.AppTextQuery;
import com.easyjob.entity.query.AppTextQuestionQuery;
import com.easyjob.entity.vo.PaginationResultVO;
import com.easyjob.entity.vo.app.TextQuestionVO;

import java.util.List;

public interface AppTextService {

    /**
     * 根据参数查询列表
     *
     * @param param
     * @return
     */
    List<AppText> findListByParam(AppTextQuery param);

    Integer findCountByParam(AppTextQuery param);

    PaginationResultVO<AppText> findListByPage(AppTextQuery param);

    AppText postText(AppUserLoginDto appDto, AppTextPostDto appTextPostDto);

    AppText getAppTextByTextId(Integer textId);

    List<TextQuestionVO> getAppTextQuestion(AppTextQuestionQuery appTextQuestionQuery, Integer textId, Integer questionId);

    List<TextQuestionVO> getAppTextQuestions(AppTextQuestionQuery appTextQuestionQuery, Integer textId);

    Integer getTextAnswerResult(Integer textId, Integer questionId);

    // 只提交当前题目信息，不修改当前textId状态
    AppTextQuestion postSingleTextQuestion(AppUserLoginDto appDto, AppTextPostDto appTextPostDto);

    AppText createPostPaperText(String categoryName, AppUserLoginDto appDto);
}
