<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 10:53:13
 * @LastEditTime: 2020-07-20 20:29:33
 * @FilePath: f:\sourcecode\md-vue-loader\example\APP.vue
--> 

<template>
    <div>
        <p>There some md-vue-loader demos.</p>
        <Buttom>Click</Buttom>
    </div>
</template>

<script>
import Buttom from './Button.md';

export default {
    name: 'APP',
    components: {
        Buttom
    },
    methods: {
        onClick() {
            console.log('点击按钮');
        }
    }
};
</script>