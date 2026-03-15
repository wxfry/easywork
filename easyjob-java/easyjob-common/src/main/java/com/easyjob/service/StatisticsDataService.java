package com.easyjob.service;

import com.easyjob.entity.dto.StatisticsDataDto;
import com.easyjob.entity.dto.StatisticsDataWeekDto;

import java.util.List;

/**
 * @Description 数据统计
 * @ClassName
 * @MethodName
 * @Params
 */
public interface StatisticsDataService {
    List<StatisticsDataDto> getAllData();

    StatisticsDataWeekDto getAppWeekData();

    StatisticsDataWeekDto getContentWeekData();
}
