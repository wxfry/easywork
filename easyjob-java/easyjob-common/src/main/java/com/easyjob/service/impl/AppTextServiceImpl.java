package com.easyjob.service.impl;

import com.easyjob.entity.dto.AppTextPostDto;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.enums.AnswerResultEnum;
import com.easyjob.entity.enums.AppExamStatusEnum;
import com.easyjob.entity.enums.CollectTypeEnum;
import com.easyjob.entity.enums.PageSize;
import com.easyjob.entity.po.*;
import com.easyjob.entity.query.*;
import com.easyjob.entity.vo.PaginationResultVO;
import com.easyjob.entity.vo.app.TextQuestionVO;
import com.easyjob.exception.BusinessException;
import com.easyjob.mappers.*;
import com.easyjob.service.AppTextService;
import com.easyjob.utils.CopyTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 用户练习 业务接口实现
 */
@Service("appTextService")
public class AppTextServiceImpl implements AppTextService {


    @Autowired
    private AppTextMapper<AppText, AppTextQuery> appTextMapper;
    @Autowired
    private AppExamQuestionMapper appExamQuestionMapper;

    @Resource
    private ExamQuestionMapper<ExamQuestion, ExamQuestionQuery> examQuestionMapper;
    @Resource
    private ExamQuestionItemMapper<ExamQuestionItem, ExamQuestionItemQuery> examQuestionItemMapper;
    @Resource
    private AppUserCollectMapper<AppUserCollect, AppUserCollectQuery> appUserCollectMapper;

    /**
     * 根据参数查询列表
     */
    @Override
    public List<AppText> findListByParam(AppTextQuery param) {
        return this.appTextMapper.selectList(param);
    }

    @Override
    public Integer findCountByParam(AppTextQuery param) {
        return this.appTextMapper.selectCount(param);
    }

    @Override
    public PaginationResultVO<AppText> findListByPage(AppTextQuery param) {
        int count = this.findCountByParam(param);
        int pageSize = param.getPageSize() == null ? PageSize.SIZE15.getSize() : param.getPageSize();

        SimplePage page = new SimplePage(param.getPageNo(), count, pageSize);
        param.setSimplePage(page);
        List<AppText> list = this.findListByParam(param);
        PaginationResultVO<AppText> result = new PaginationResultVO(count, page.getPageSize(), page.getPageNo(), page.getPageTotal(), list);
        return result;
    }

    /**
     * 提交练习
     */
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public AppText postText(AppUserLoginDto appDto, AppTextPostDto appTextPostDto) {
//        Date curDate = new Date();
//
//        AppText appText = appTextMapper.selectByTextId(appTextPostDto.getTextId());
//        if (null == appText || !appText.getUserId().equals(appDto.getUserId())) {
//            throw new BusinessException("当前练习与当前用户不匹配");
//        }
//
//        if (!appText.getStatus().equals(AppExamStatusEnum.INIT.getStatus())) {
//            throw new BusinessException("练习已经提交");
//        }
//
//        List<AppTextQuestion> appTextQuestionList = appTextPostDto.getAppTextQuestionList();
//        if (appTextQuestionList.isEmpty()) {
//            throw new BusinessException("提交的答案为空");
//        }
//
//        // 查询所有练习题目
//        AppTextQuestionQuery appTextQuestionQuery = new AppTextQuestionQuery();
//        appTextQuestionQuery.setTextId(appTextPostDto.getTextId());
//        List<AppTextQuestion> dbAppTextQuestionList = appExamQuestionMapper.selectTextList(appTextQuestionQuery);
//        List<String> dbQuestionIdList = dbAppTextQuestionList.stream().map(item -> item.getQuestionId().toString()).collect(Collectors.toList());
//
//        // 查询题库问题
//        ExamQuestionQuery examQuestionQuery = new ExamQuestionQuery();
//        examQuestionQuery.setQueryAnswer(true);
//        examQuestionQuery.setQuestionIds(dbQuestionIdList.toArray(new String[dbQuestionIdList.size()]));
//        List<ExamQuestion> textQuestionList = examQuestionMapper.selectList(examQuestionQuery);
//        Map<Integer, ExamQuestion> tempExamItemMap = textQuestionList.stream()
//                .collect(Collectors.toMap(item -> item.getQuestionId(), Function.identity(), (data1, data2) -> data2));
//
//        for (AppTextQuestion item : appTextQuestionList) {
//            ExamQuestion examQuestion = tempExamItemMap.get(item.getQuestionId());
//            if (examQuestion == null) {
//                throw new BusinessException("题库中不存在对应题目");
//            }
//            item.setTextId(appText.getTextId());
//            item.setUserId(appDto.getUserId());
//            if (examQuestion.getQuestionAnswer().equals(item.getUserAnswer())) {
//                item.setAnswerResult(AnswerResultEnum.RIGHT.getResult());
//            } else {
//                item.setAnswerResult(AnswerResultEnum.WRONG.getResult());
//            }
//        }
//        appTextMapper.insertOrUpdateBatch2(appTextQuestionList);
//
//        AppText updateText = new AppText();
//        updateText.setStatus(AppExamStatusEnum.FINISHED.getStatus());
//        updateText.setEndTime(curDate);
//
//        AppTextQuery appTextQuery = new AppTextQuery();
//        appTextQuery.setTextId(appTextPostDto.getTextId());
//        appTextQuery.setUserId(appDto.getUserId());
//        appTextQuery.setStatus(AppExamStatusEnum.INIT.getStatus());
//        Integer count = appTextMapper.updateByParam(updateText, appTextQuery);
//        if (count == 0) {
//            throw new BusinessException("考试提交失败");
//        }
//        return appText;
//    }
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AppText postText(AppUserLoginDto appDto, AppTextPostDto appTextPostDto) {
        Date curDate = new Date();

        // 查询当前练习记录
        AppText appText = appTextMapper.selectByTextId(appTextPostDto.getTextId());
        if (null == appText || !appText.getUserId().equals(appDto.getUserId())) {
            throw new BusinessException("当前练习与当前用户不匹配");
        }

        // 判断是否已经提交过
        if (!appText.getStatus().equals(AppExamStatusEnum.INIT.getStatus())) {
            throw new BusinessException("练习已经提交");
        }

        // 构建更新对象：只更新状态和结束时间
        AppText updateText = new AppText();
        updateText.setStatus(AppExamStatusEnum.FINISHED.getStatus());
        updateText.setEndTime(curDate);

        // 构建查询条件：确保只更新当前用户未提交的练习
        AppTextQuery appTextQuery = new AppTextQuery();
        appTextQuery.setTextId(appTextPostDto.getTextId());
        appTextQuery.setUserId(appDto.getUserId());
        appTextQuery.setStatus(AppExamStatusEnum.INIT.getStatus());

        // 执行更新操作
        Integer count = appTextMapper.updateByParam(updateText, appTextQuery);
        if (count == 0) {
            throw new BusinessException("练习提交失败");
        }

        return appText;
    }

    /**
     * 提交的单个练习题答案
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AppTextQuestion postSingleTextQuestion(AppUserLoginDto appDto, AppTextPostDto appTextPostDto) {
        AppText appText = appTextMapper.selectByTextId(appTextPostDto.getTextId());
        if (null == appText || !appText.getUserId().equals(appDto.getUserId())) {
            throw new BusinessException("当前练习与当前用户不匹配");
        }

        List<AppTextQuestion> appTextQuestionList = appTextPostDto.getAppTextQuestionList();
        if (appTextQuestionList.isEmpty()) {
            throw new BusinessException("提交的答案为空");
        }

        // 查询当前练习题目
//        AppTextQuestion appTextQuestion = appTextMapper.selectByTextQuestion(textId, questionId);
        AppTextQuestion appTextQuestion = appTextMapper.selectByTextQuestion(appTextPostDto.getTextId(), appTextQuestionList.get(0).getQuestionId());
//        appTextQuestion.setTextId(appTextPostDto.getTextId());
//        appTextQuestion.setUserId(appDto.getUserId());
        // 查询题库问题
        ExamQuestion examQuestion = examQuestionMapper.selectByQuestionId(appTextQuestion.getQuestionId());

        appTextQuestion.setTextId(appText.getTextId());
        appTextQuestion.setUserId(appDto.getUserId());
        appTextQuestion.setChapter(appTextQuestion.getChapter());
        appTextQuestion.setCategoryName(appTextQuestion.getCategoryName());
        appTextQuestion.setUserAnswer(appTextPostDto.getAppTextQuestionList().get(0).getUserAnswer());
        if (examQuestion == null) {
            throw new BusinessException("题库中不存在对应题目");
        }
        if (examQuestion.getQuestionAnswer().equals(appTextQuestion.getUserAnswer())) {
            appTextQuestion.setAnswerResult(AnswerResultEnum.RIGHT.getResult());
        } else {
            appTextQuestion.setAnswerResult(AnswerResultEnum.WRONG.getResult());
        }
        appTextMapper.insertOrUpdate2(appTextQuestion);

        return appTextQuestion;
    }

    @Override
    public AppText getAppTextByTextId(Integer textId) {
        return this.appTextMapper.selectByTextId(textId);
    }

    @Override
    public List<TextQuestionVO> getAppTextQuestion(AppTextQuestionQuery appTextQuestionQuery, Integer textId, Integer questionId) {
//        List<AppTextQuestion> appTextQuestion = appTextMapper.selectTextList(appTextQuestionQuery);
        List<TextQuestionVO> appTextQuestion = appTextMapper.selectTextQuestion(appTextQuestionQuery);
        return appTextQuestion;
    }

    @Override
    public List<TextQuestionVO> getAppTextQuestions(AppTextQuestionQuery appTextQuestionQuery, Integer textId) {
        List<AppTextQuestion> appTextQuestionList = appTextMapper.selectTextList(appTextQuestionQuery);

        Map<Integer, AppTextQuestion> appTextQuestionMap = new HashMap<>();
        if (appTextQuestionQuery.getShowUserAnswer() != null && appTextQuestionQuery.getShowUserAnswer()) {
            appTextQuestionMap = appTextQuestionList.stream().
                    collect(Collectors.toMap(item -> item.getQuestionId(), Function.identity(), (data1, data2) -> data2));
        }

        /**
         * 考题问题ID
         */
        List<String> questionIdList = appTextQuestionList.stream().map(item -> item.getQuestionId().toString())
                .collect(Collectors.toList());

        /**
         * 查询题目
         */
        ExamQuestionQuery examQuestionQuery = new ExamQuestionQuery();
        examQuestionQuery.setQueryAnswer(appTextQuestionQuery.getShowUserAnswer());
        examQuestionQuery.setQuestionIds(questionIdList.toArray(new String[questionIdList.size()]));
        List<ExamQuestion> examQuestionList = examQuestionMapper.selectList(examQuestionQuery);

        List<TextQuestionVO> textQuestionVOList = CopyTools.copyList(examQuestionList, TextQuestionVO.class);

        /**
         * 查询考题选项
         */
        ExamQuestionItemQuery examQuestionItemQuery = new ExamQuestionItemQuery();
        examQuestionItemQuery.setQuestionIdList(questionIdList);
        List<ExamQuestionItem> examQuestionItemList = examQuestionItemMapper.selectList(examQuestionItemQuery);

        Map<Integer, List<ExamQuestionItem>> temExamItemMap = examQuestionItemList.stream()
                .collect(Collectors.groupingBy(item -> item.getQuestionId()));

        /**
         * 查询用户是否收藏
         */
        AppUserCollectQuery appUserCollectQuery = new AppUserCollectQuery();
        appUserCollectQuery.setObjectIdList(questionIdList);
        appUserCollectQuery.setUserId(appTextQuestionQuery.getUserId());
        appUserCollectQuery.setCollectType(CollectTypeEnum.EXAM.getType());
        List<AppUserCollect> appUserCollectList = appUserCollectMapper.selectList(appUserCollectQuery);

        Map<String, AppUserCollect> appUserCollectMap = appUserCollectList.stream().collect
                (Collectors.toMap(item -> item.getObjectId(), Function.identity(), (data1, data2) -> data2));


        for (TextQuestionVO item : textQuestionVOList) {
            /**
             * 记录收藏
             */
            if (appUserCollectMap.get(String.valueOf(item.getQuestionId())) != null) {
                item.setHaveCollect(true);
            } else {
                item.setHaveCollect(false);
            }

            item.setTextId(appTextQuestionQuery.getTextId());

            //问题选项
            List<ExamQuestionItem> questionItemList = temExamItemMap.get(item.getQuestionId());

            item.setQuestionItemList(questionItemList);
            if (!appTextQuestionQuery.getShowUserAnswer()) {
                continue;
            }
            AppTextQuestion appTextQuestion = appTextQuestionMap.get(item.getQuestionId());
            if (appTextQuestion != null) {
                item.setAnswerResult(appTextQuestion.getAnswerResult());
                item.setUserAnswer(appTextQuestion.getUserAnswer());
            }
        }
        return textQuestionVOList;
    }

    @Override
    public Integer getTextAnswerResult(Integer textId, Integer questionId) {
        Integer result = appTextMapper.getTextAnswerResult(textId, questionId);
        return result;
    }

    @Override
    public AppText createPostPaperText(String categoryName, AppUserLoginDto appDto) {
        return null;
    }
}



