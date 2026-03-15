package com.easyjob.service;

import com.easyjob.entity.dto.StatisticsDataWeekDto;
import com.easyjob.entity.po.ExamQuestion;

import java.util.List;
import java.util.Map;

public interface AppCommentService {
    String getScore(String userId);

    List<ExamQuestion> userCF(String userId);

    List<ExamQuestion> getQuestionById(Integer questionId);

    /**
     * 用户签到
     */
    int doSign(String token, String date);

    int getSignCount(String userId);

    /**
     * 获取当月签到详情
     */
    Map<String, Boolean> getSignDetail(String token, String dateStr);

    StatisticsDataWeekDto getTextData(String userId);

    /**
     * 构建试题-知识点矩阵A
     *
     * @return 试题-知识点矩阵
     */
    Map<Integer, Map<String, Integer>> buildQuestionKnowledgeMatrix();

    /**
     * 构建用户-试题题目矩阵B
     *
     * @return 用户-试题题目矩阵B
     */
    Map<Integer, Map<String, Integer>> buildUserQuestionMatrix();

    /**
     * 构建用户-知识点矩阵C
     *
     * @return 用户-知识点矩阵C
     */
    Map<String, Map<String, Double>> buildUserKnowledgeMatrix();

    /**
     * 构建指定用户的知识点掌握程度矩阵
     *
     * @param userId 用户ID
     * @return 用户对每个知识点的掌握程度
     */
    Map<String, Double> buildUserKnowledgeMatrix(String userId);

    /**
     * 计算当前用户与其他所有用户的相关性，并根据相关系数倒序排序输出前N项的结果
     *
     * @param userId 用户ID
     * @return 前N个相似用户的ID及其对应的皮尔逊相关系数
     */
    List<Map.Entry<String, Double>> calculateTopNUserSimilarity(String userId);

    List<ExamQuestion> getCommendQuestion(String userId);

    Map<String, Integer> getKnowledgePointQuestionCount(String token);
//    Map<String, Double> getKnowledgePointQuestionCount(String token);

    Map<Integer, Double> getExamStatistics(String token);
}