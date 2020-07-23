<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 11:05:26
 * @LastEditTime: 2020-07-22 19:35:45
 * @FilePath: f:\sourcecode\md-vue-loader\example\Button.md
--> 
## Button 组件

一、`Button` 组件的基本使用

:::demo #### Button 组件基础使用一111。

``` vue

<template>
    <div>
        <p>There some demos for Button component.</p>
        值： {{ counter }}
        <button
            @click="onClick"
            class="button"
        >Click</button>
    </div>
</template>

<script>
export default {
    name: 'Button',
    data(){
        return {
            counter: 0
        };
    },
    methods: {
        onClick(){
            this.counter++;
        }
    }
};
</script>

<style scoped >
    .button{
        cursor: pointer;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 6px 12px;
        outline: none;
        user-select: none;
    }
</style>

```
:::

分隔--------------------------------------------

## Button 组件

二、`Button` 组件的基本使用

:::demo #### Button 组件基础使用二2222222。
```vue

<template>
    <div>
        <p>There some demos for Button component.</p>
    </div>
</template>

<script>
export default {
    name: 'Button'
};
</script>

```
:::