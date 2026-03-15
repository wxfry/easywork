package com.easyjob.mappers;

import com.easyjob.entity.po.AppTextQuestion;
import com.easyjob.entity.po.ExamQuestion;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 考试题目 数据库操作接口
 */
public interface ExamQuestionMapper<T, P> extends BaseMapper<T, P> {

    /**
     * 根据QuestionId更新
     */
    Integer updateByQuestionId(@Param("bean") T t, @Param("questionId") Integer questionId);


    /**
     * 根据QuestionId删除
     */
    Integer deleteByQuestionId(@Param("questionId") Integer questionId);


    /**
     * 根据QuestionId获取对象
     */
    T selectByQuestionId(@Param("questionId") Integer questionId);

    T showDetailNext(@Param("query") P p);

    AppTextQuestion selectByChapterAndCategoryName(@Param("chapter") String chapter, @Param("categoryName") String categoryName);


    List<ExamQuestion> selectAllQuestions();

    List<ExamQuestion> selectListByIds(List<Integer> questionIds);
}
