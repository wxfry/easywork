package com.easyjob.service.impl;

import com.easyjob.entity.enums.PageSize;
import com.easyjob.entity.po.AppExamQuestion;
import com.easyjob.entity.query.AppExamQuestionQuery;
import com.easyjob.entity.query.SimplePage;
import com.easyjob.entity.vo.PaginationResultVO;
import com.easyjob.mappers.AppExamQuestionMapper;
import com.easyjob.service.AppExamQuestionService;
import com.easyjob.utils.StringTools;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;


/**
 * 考试问题 业务接口实现
 */
@Service("appExamQuestionService")
public class AppExamQuestionServiceImpl implements AppExamQuestionService {

    @Resource
    private AppExamQuestionMapper<AppExamQuestion, AppExamQuestionQuery> appExamQuestionMapper;

    /**
     * 根据条件查询列表
     */
    @Override
    public List<AppExamQuestion> findListByParam(AppExamQuestionQuery param) {
        return this.appExamQuestionMapper.selectList(param);
    }

    /**
     * 根据条件查询列表
     */
    @Override
    public Integer findCountByParam(AppExamQuestionQuery param) {
        return this.appExamQuestionMapper.selectCount(param);
    }

    /**
     * 分页查询方法
     */
//	@Override
//	public PaginationResultVO<AppExamQuestion> findListByPage(AppExamQuestionQuery param) {
//		int count = this.findCountByParam(param);
//		int pageSize = param.getPageSize() == null ? PageSize.SIZE15.getSize() : param.getPageSize();
//
//		SimplePage page = new SimplePage(param.getPageNo(), count, pageSize);
//		param.setSimplePage(page);
//		List<AppExamQuestion> list = this.findListByParam(param);
//		PaginationResultVO<AppExamQuestion> result = new PaginationResultVO(count, page.getPageSize(), page.getPageNo(), page.getPageTotal(), list);
//		return result;
//	}
    @Override
    public PaginationResultVO<AppExamQuestion> findListByPage(AppExamQuestionQuery param) {
        int count = this.findCountByParam(param);
        int pageSize = param.getPageSize() == null ? PageSize.SIZE15.getSize() : param.getPageSize();

        SimplePage page = new SimplePage(param.getPageNo(), count, pageSize);
        param.setSimplePage(page);
        List<AppExamQuestion> list = this.findListByParam(param);

        // 去重逻辑：基于 questionId 进行去重
        List<AppExamQuestion> distinctList = list.stream()
                .filter(distinctByKey(AppExamQuestion::getQuestionId))
                .collect(Collectors.toList()); // 使用 Collectors.toList() 替代 toList()

        PaginationResultVO<AppExamQuestion> result = new PaginationResultVO(count, page.getPageSize(), page.getPageNo(), page.getPageTotal(), distinctList);
        return result;
    }

    // 辅助方法：用于流式操作中的去重
    private static <T> java.util.function.Predicate<T> distinctByKey(java.util.function.Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    /**
     * 新增
     */
    @Override
    public Integer add(AppExamQuestion bean) {
        return this.appExamQuestionMapper.insert(bean);
    }

    /**
     * 批量新增
     */
    @Override
    public Integer addBatch(List<AppExamQuestion> listBean) {
        if (listBean == null || listBean.isEmpty()) {
            return 0;
        }
        return this.appExamQuestionMapper.insertBatch(listBean);
    }

    /**
     * 批量新增或者修改
     */
    @Override
    public Integer addOrUpdateBatch(List<AppExamQuestion> listBean) {
        if (listBean == null || listBean.isEmpty()) {
            return 0;
        }
        return this.appExamQuestionMapper.insertOrUpdateBatch(listBean);
    }

    /**
     * 多条件更新
     */
    @Override
    public Integer updateByParam(AppExamQuestion bean, AppExamQuestionQuery param) {
        StringTools.checkParam(param);
        return this.appExamQuestionMapper.updateByParam(bean, param);
    }

    /**
     * 多条件删除
     */
    @Override
    public Integer deleteByParam(AppExamQuestionQuery param) {
        StringTools.checkParam(param);
        return this.appExamQuestionMapper.deleteByParam(param);
    }

    /**
     * 根据Id获取对象
     */
    @Override
    public AppExamQuestion getAppExamQuestionById(Integer id) {
        return this.appExamQuestionMapper.selectById(id);
    }

    /**
     * 根据Id修改
     */
    @Override
    public Integer updateAppExamQuestionById(AppExamQuestion bean, Integer id) {
        return this.appExamQuestionMapper.updateById(bean, id);
    }

    /**
     * 根据Id删除
     */
    @Override
    public Integer deleteAppExamQuestionById(Integer id) {
        return this.appExamQuestionMapper.deleteById(id);
    }

    /**
     * 根据ExamIdAndUserIdAndQuestionId获取对象
     */
    @Override
    public AppExamQuestion getAppExamQuestionByExamIdAndUserIdAndQuestionId(Integer examId, String userId, Integer questionId) {
        return this.appExamQuestionMapper.selectByExamIdAndUserIdAndQuestionId(examId, userId, questionId);
    }

    /**
     * 根据ExamIdAndUserIdAndQuestionId修改
     */
    @Override
    public Integer updateAppExamQuestionByExamIdAndUserIdAndQuestionId(AppExamQuestion bean, Integer examId, String userId, Integer questionId) {
        return this.appExamQuestionMapper.updateByExamIdAndUserIdAndQuestionId(bean, examId, userId, questionId);
    }

    /**
     * 根据ExamIdAndUserIdAndQuestionId删除
     */
    @Override
    public Integer deleteAppExamQuestionByExamIdAndUserIdAndQuestionId(Integer examId, String userId, Integer questionId) {
        return this.appExamQuestionMapper.deleteByExamIdAndUserIdAndQuestionId(examId, userId, questionId);
    }
}