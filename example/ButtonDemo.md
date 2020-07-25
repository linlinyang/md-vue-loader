<!--
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-18 11:05:26
 * @LastEditTime: 2020-07-25 15:37:05
 * @FilePath: f:\sourcecode\md-vue-loader\example\ButtonDemo.md
--> 
## Button 组件

一、`Button` 组件的基本使用

:::demo #### Button 组件基础用法:

``` vue

<template>
    <div class="demo">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">主要按钮</Button>
        <Button type="info">主要按钮</Button>
        <Button type="warning">主要按钮</Button>
        <Button type="danger">主要按钮</Button>
    </div>
</template>

<script>
import Button from "./components/Button";

export default {
    name: 'ButtonDemo',
    components: {
        Button
    }
};
</script>

<style scoped >
    .demo{
        padding-bottom: 20px;
        border-bottom: 1px solid #333;
        width: 100%;
        position: relative;
    }
</style>

```
:::

## Button 组件

二、`Button` 组件的基本使用

:::demo #### Button 组件disabled用法:
```vue

<template>
    <div class="demo">
        <Button disabled>默认按钮</Button>
        <Button type="primary" disabled>主要按钮</Button>
        <Button type="success" disabled>主要按钮</Button>
        <Button type="info" disabled>主要按钮</Button>
        <Button type="warning" disabled>主要按钮</Button>
        <Button type="danger" disabled>主要按钮</Button>
    </div>
</template>

<script>
import Button from "./components/Button";

export default {
    name: 'ButtonDemo',
    components: {
        Button
    }
};
</script>

<style scoped >
    .demo{
        padding-bottom: 20px;
        border-bottom: 1px solid #333;
        width: 100%;
        position: relative;
    }
</style>
```
:::
