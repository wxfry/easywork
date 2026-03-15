package com.easyjob.mappers;

import com.easyjob.entity.po.AppText;
import com.easyjob.entity.po.AppTextQuestion;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 考试 数据库操作接口
 */
public interface AppExamMapper<T, P> extends BaseMapper<T, P> {

    /**
     * 根据ExamId更新
     */
    Integer updateByExamId(@Param("bean") T t, @Param("examId") Integer examId);


    /**
     * 根据ExamId删除
     */
    Integer deleteByExamId(@Param("examId") Integer examId);


    /**
     * 根据ExamId获取对象
     */
    T selectByExamId(@Param("examId") Integer examId);

    AppText selectByChapterAndCategoryName2(@Param("chapter") String chapter, @Param("categoryName") String categoryName);

    AppTextQuestion selectByChapterAndCategoryName(@Param("chapter") String chapter, @Param("categoryName") String categoryName);

    /**
     * 获取用户最后5次已完成考试的exam_id
     *
     * @param userId 用户ID
     * @return 最后5次已完成考试的exam_id列表
     */
    List<Integer> selectLastFiveCompletedExams(@Param("userId") String userId);
}
