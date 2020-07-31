<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 10:53:13
 * @LastEditTime: 2020-07-31 20:12:56
 * @FilePath: f:\sourcecode\md-vue-loader\example\APP.vue
--> 

<template>
    <div class="demo-button">
        <ButtonDemo></ButtonDemo>
    </div>
</template>

<script>
import 'highlight.js/styles/atom-one-dark.css';
import hljs from 'highlight.js';
import ButtonDemo from './ButtonDemo.md';

export default {
    name: 'APP',
    components: {
        ButtonDemo
    },
    mounted(){
        this.$nextTick(() => {
            [...document.querySelectorAll('.vue-demo-highlight pre code:not(.hljs)')].forEach(block => {
                hljs.highlightBlock(block);
            });
        });
    }
};
</script>

<style lang="scss">

    .demo-button{
        margin: 20px auto 0;
        width: 70%;

        .vue-demo-wrapper{
            position: relative;
            overflow: hidden;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            margin-top: 20px;

            .vue-demo-desc,
            .vue-demo-highlight{
                margin-top: 20px;
            }
        }
    }

</style>