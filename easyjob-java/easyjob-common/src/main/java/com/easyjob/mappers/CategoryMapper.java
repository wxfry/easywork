package com.easyjob.mappers;

import com.easyjob.entity.po.Category;
import com.easyjob.entity.query.CategoryQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 分类 数据库操作接口
 */
public interface CategoryMapper<T, P> extends BaseMapper<T, P> {

    /**
     * 根据CategoryId更新
     */
    Integer updateByCategoryId(@Param("bean") T t, @Param("categoryId") Integer categoryId);


    /**
     * 根据CategoryId删除
     */
    Integer deleteByCategoryId(@Param("categoryId") Integer categoryId);


    /**
     * 根据CategoryId获取对象
     */
    T selectByCategoryId(@Param("categoryId") Integer categoryId);


    void updateCategoryName(@Param("categoryName") String categoryName, @Param("categoryId") Integer categoryId);

    List<Category> selectClassify(@Param("query") CategoryQuery query);
}
