package com.easyjob.mappers;

import com.easyjob.entity.dto.RelateDto;
import com.easyjob.entity.po.ExamQuestion;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

public interface AppCommentMapper<T, P> extends BaseMapper<T, P> {
    @Select("SELECT score FROM app_user_info WHERE user_id = #{userId}")
    String getScore(String userId);

    List<RelateDto> listRelate();

    List<ExamQuestion> selectCommendQuestion(Integer questionId);

    Integer updateSign(String userId, Date date);

    Integer updateAmount(String userId, Integer signCount);

    Integer selectAmount(String userId);

    Integer updateScore(String userId);
}
