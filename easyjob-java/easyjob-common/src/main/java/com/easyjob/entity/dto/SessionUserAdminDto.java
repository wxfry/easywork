package com.easyjob.entity.dto;

import com.easyjob.entity.vo.SysMenuVO;

import java.io.Serializable;
import java.util.List;

/**
 * @Description 用户session 信息
 * @ClassName
 * @MethodName
 * @Params
 */
public class SessionUserAdminDto implements Serializable {

    private static final long serialVersionUID = 1690149993220674991L;

    private Integer userId; // 一般不反悔,但是写上
    private String userName;
    private Boolean superAdmin; // 超级管理员做成配置,后面会用,所以药判断是否是管理员
    private List<SysMenuVO> menuList; // 菜单
    private List<String> permissionCodeList; // 权限码

    public List<String> getPermissionCodeList() {
        return permissionCodeList;
    }

    public void setPermissionCodeList(List<String> permissionCodeList) {
        this.permissionCodeList = permissionCodeList;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Boolean getSuperAdmin() {
        return superAdmin;
    }

    public void setSuperAdmin(Boolean superAdmin) {
        this.superAdmin = superAdmin;
    }

    public List<SysMenuVO> getMenuList() {
        return menuList;
    }

    public void setMenuList(List<SysMenuVO> menuList) {
        this.menuList = menuList;
    }

}
