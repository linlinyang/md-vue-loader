<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 11:08:31
 * @LastEditTime: 2020-07-25 15:17:03
 * @FilePath: f:\sourcecode\md-vue-loader\example\components\Button.vue
--> 

<template>
    <button
        class="button"
        :class="btnClass"
        @click="onClick"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        type: {
            type: String,
            validator: val => [
                'default',
                'primary',
                'success',
                'info',
                'warning',
                'danger'
            ].includes(val),
            default: 'default'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        btnClass(){
            const {
                type,
                disabled
            } = this;
            return {
                [`btn-${type}`]: true,
                'is-disabled': disabled
            };
        }
    },
    methods: {
        onClick() {
            this.disabled && this.$emit('click');
        }
    }
};
</script>

<style lang="scss" >
    .button{
        display: inline-block;
        vertical-align: middle;
        padding: 10px 20px;
        font-size: 14px;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #333;
        text-align: center;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        transition: all 0.2s ease-in;
        outline: none;
        appearance: none;
        line-height: 1;

        &.is-disabled{
            cursor: not-allowed;
        }

        &.btn-default {
            background-color: #fff;
            color: #606266;
            border-color: #dcdfe6;

            &:hover,
            &:focus{
                color: #409eff;
                border-color: #c6e2ff;
                background-color: #ecf5ff;
            }

            &:active{
                color: #3a8ee6;
                border-color: #3a8ee6;
                outline: none;
            }

            &.is-disabled{
                color: #c0c4cc;
                background-color: #fff;
                border-color: #ebeef5;
            }
        }
        &.btn-primary {
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;

            &:hover,
            &:focus{
                background: #66b1ff;
                border-color: #66b1ff;
                color: #fff;
            }

            &:active{
                background: #3a8ee6;
                border-color: #3a8ee6;
                color: #fff;
            }
            
            &.is-disabled{
                color: #fff;
                background-color: #a0cfff;
                border-color: #a0cfff;
            }
        }
        &.btn-success {
            color: #fff;
            background-color: #67c23a;
            border-color: #67c23a;

            &:hover,
            &:focus{
                background: #85ce61;
                border-color: #85ce61;
                color: #fff;
            }

            &:active{
                background: #5daf34;
                border-color: #5daf34;
                color: #fff;
            }

            &.is-disabled{
                color: #fff;
                background-color: #b3e19d;
                border-color: #b3e19d;
            }
        }
        &.btn-info {
            color: #fff;
            background-color: #909399;
            border-color: #909399;

            &:hover,
            &:focus{
                background: #a6a9ad;
                border-color: #a6a9ad;
                color: #fff;
            }

            &:active{
                background: #82848a;
                border-color: #82848a;
                color: #fff;
            }

            &.is-disabled{
                color: #c0c4cc;
                background-color: #fff;
                border-color: #ebeef5;
            }
        }
        &.btn-warning {
            color: #fff;
            background-color: #e6a23c;
            border-color: #e6a23c;

            &:hover,
            &:focus{
                background: #ebb563;
                border-color: #ebb563;
                color: #fff;
            }

            &:active{
                background: #cf9236;
                border-color: #cf9236;
                color: #fff;
            }

            &.is-disabled{
                color: #fff;
                background-color: #f3d19e;
                border-color: #f3d19e;
            }
        }
        &.btn-danger {
            color: #fff;
            background-color: #f56c6c;
            border-color: #f56c6c;

            &:hover,
            &:focus{
                background: #f78989;
                border-color: #f78989;
                color: #fff;
            }

            &:active{
                background: #dd6161;
                border-color: #dd6161;
                color: #fff;
            }

            &.is-disabled{
                color: #fff;
                background-color: #fab6b6;
                border-color: #fab6b6;
            }
        }


    }
</style>