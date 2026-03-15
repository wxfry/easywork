package com.easyjob.entity.enums;


public enum PageSize {
    SIZE15(15), SIZE20(20), SIZE33(33), SIZE40(40), SIZE50(50), SIZE100(100), SIZE200(200);
    int size;

    private PageSize(int size) {
        this.size = size;
    }

    public int getSize() {
        return this.size;
    }
}
