<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 10:53:13
 * @LastEditTime: 2020-07-22 20:47:45
 * @FilePath: f:\sourcecode\md-vue-loader\example\APP.vue
--> 

<template>
    <div>
        <p>There some md-vue-loader demos.</p>
        <Button>Click</Button>
    </div>
</template>

<script>
import Button from './Button.md';

export default {
    name: 'APP',
    components: {
        Button
    },
    methods: {
        onClick() {
            console.log('点击按钮');
        }
    }
};
</script>