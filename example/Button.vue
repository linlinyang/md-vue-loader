<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 11:08:31
 * @LastEditTime: 2020-07-18 11:16:12
 * @FilePath: f:\sourcecode\md-vue-loader\example\Button.vue
--> 

<template>
    <button
        class="button"
        @click="onClick"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<style scoped>
    .button{
        display: inline-block;
        vertical-align: middle;
        padding: 6px 12px;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        color: #333;
        border: 1px solid #333;
        text-align: center;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        transition: all 0.2s ease-in;
        outline: none;
    }
    .button:hover{
        border-color: blueviolet;
        color: blueviolet;
    }
</style>