package com.easyjob.mappers;

import com.easyjob.entity.po.AppTextQuestion;
import com.easyjob.entity.query.AppTextQuestionQuery;
import com.easyjob.entity.vo.app.TextQuestionVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户练习 数据库操作接口
 */
public interface AppTextMapper<T, P> extends BaseMapper<T, P> {

    /**
     * 根据textId查询
     */
    T selectByTextId(@Param("textId") Integer textId);

    Integer insertOrUpdateBatch2(List<AppTextQuestion> appTextQuestionList);

    Integer getTextAnswerResult(@Param("textId") Integer textId, @Param("questionId") Integer questionId);

    List<TextQuestionVO> selectTextQuestion(@Param("query") AppTextQuestionQuery p);

    AppTextQuestion selectByTextQuestion(@Param("textId") Integer textId, @Param("questionId") Integer questionId);

    Integer insertOrUpdate2(@Param("bean") AppTextQuestion appTextQuestion);

    Integer selectData(@Param("query") AppTextQuestionQuery p);

    List<AppTextQuestion> selectAllTextList(Object o);

    List<AppTextQuestion> selectQuestionsByUserId(String similarUserId);

    /**
     * 根据userId和knowledgePoint查询题目数量
     *
     * @param query 查询条件
     * @return 题目数量
     */
    Integer selectDataByKnowledgePoint(@Param("query") AppTextQuestionQuery query);

    List<AppTextQuestion> selectQuestionsByUserIdAndKnowledgePoint(String similarUserId, String knowledgePoint);
}
