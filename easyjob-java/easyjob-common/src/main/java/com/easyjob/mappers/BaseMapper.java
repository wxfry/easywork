package com.easyjob.mappers;


import com.easyjob.entity.po.AppText;
import com.easyjob.entity.po.AppTextQuestion;
import com.easyjob.entity.po.ExamQuestion;
import com.easyjob.entity.query.AppTextQuestionQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

interface BaseMapper<T, P> {

    /**
     * selectList:(根据参数查询集合)
     */
    List<T> selectList(@Param("query") P p);

    List<T> selectList2(@Param("query") P p);

    List<T> selectQuestionList();

    List<T> selectExamQuestionList(@Param("query") P p);

    ExamQuestion selectQuestion(Integer questionId);

    List<AppTextQuestion> selectTextList(@Param("query") AppTextQuestionQuery p);


    /**
     * selectCount:(根据集合查询数量)
     */
    Integer selectCount(@Param("query") P p);

    /**
     * insert:(插入)
     */
    Integer insert(@Param("bean") T t);

    Integer insert2(@Param("bean") AppText t);


    /**
     * insertOrUpdate:(插入或者更新)
     */
    Integer insertOrUpdate(@Param("bean") T t);


    /**
     * insertBatch:(批量插入)
     */
    Integer insertBatch(@Param("list") List<T> list);

    Integer insertBatch2(@Param("list") List<AppTextQuestion> list);


    /**
     * insertOrUpdateBatch:(批量插入或更新)
     */
    Integer insertOrUpdateBatch(@Param("list") List<T> list);


    /**
     * updateByParams:(多条件更新)
     */
    Integer updateByParam(@Param("bean") T t, @Param("query") P p);

    /**
     * deleteByParam:(多条件删除)
     */
    Integer deleteByParam(@Param("query") P p);
}
