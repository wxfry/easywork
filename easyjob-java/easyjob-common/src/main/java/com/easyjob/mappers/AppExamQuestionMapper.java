package com.easyjob.mappers;

import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 * 考试问题 数据库操作接口
 */
public interface AppExamQuestionMapper<T, P> extends BaseMapper<T, P> {

    /**
     * 根据Id更新
     */
    Integer updateById(@Param("bean") T t, @Param("id") Integer id);


    /**
     * 根据Id删除
     */
    Integer deleteById(@Param("id") Integer id);


    /**
     * 根据Id获取对象
     */
    T selectById(@Param("id") Integer id);


    /**
     * 根据ExamIdAndUserIdAndQuestionId更新
     */
    Integer updateByExamIdAndUserIdAndQuestionId(@Param("bean") T t, @Param("examId") Integer examId, @Param("userId") String userId, @Param("questionId") Integer questionId);


    /**
     * 根据ExamIdAndUserIdAndQuestionId删除
     */
    Integer deleteByExamIdAndUserIdAndQuestionId(@Param("examId") Integer examId, @Param("userId") String userId, @Param("questionId") Integer questionId);


    /**
     * 根据ExamIdAndUserIdAndQuestionId获取对象
     */
    T selectByExamIdAndUserIdAndQuestionId(@Param("examId") Integer examId, @Param("userId") String userId, @Param("questionId") Integer questionId);

    /**
     * 统计每个考试的正确和错误题目数量
     *
     * @param examId 考试ID
     * @return 正确和错误题目数量的map
     */
    Map<String, Integer> countCorrectAndIncorrectQuestions(@Param("examId") Integer examId);

}